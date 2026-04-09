import json
import os
import logging
import asyncio
import requests
from fastapi import UploadFile, HTTPException
from ..schemas.disease import DiseaseDetectionResponse

# Path to the curated solutions mappings
SOLUTIONS_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'disease_solutions.json')
MODEL_API_URL = "https://disease-detection-model-ew9o.onrender.com/predict"

logger = logging.getLogger(__name__)


def _get_groq_client():
    api_key = (os.getenv("GROQ_API_KEY") or "").strip().strip('"').strip("'")
    if not api_key:
        return None

    try:
        from groq import Groq
        return Groq(api_key=api_key)
    except Exception as exc:
        logger.warning("Groq client unavailable for disease recommendations: %s", exc)
        return None


def _generate_llm_solutions_sync(crop: str, disease: str, confidence: float, fallback_solution: dict) -> dict:
    """Generate treatment guidance from LLM and gracefully fall back on errors."""
    client = _get_groq_client()
    if not client:
        return {}

    prompt = f"""
    You are an agricultural advisor. A crop disease model predicted:
    - Crop: {crop}
    - Disease: {disease}
    - Confidence: {confidence}%

    Provide concise, practical recommendations in plain language for farmers.
    Return ONLY valid JSON with EXACTLY these keys:
    - organic
    - chemical
    - precautions

    Keep each value under 60 words.
    If disease indicates healthy/no disease, say no treatment is needed and provide preventive precautions.

    Reference fallback context where helpful:
    - fallback_organic: {fallback_solution.get('organic', '')}
    - fallback_chemical: {fallback_solution.get('chemical', '')}
    - fallback_precautions: {fallback_solution.get('precautions', '')}
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a crop disease treatment assistant."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )

        content = response.choices[0].message.content if response.choices else "{}"
        parsed = json.loads(content or "{}")

        organic = str(parsed.get("organic", "")).strip()
        chemical = str(parsed.get("chemical", "")).strip()
        precautions = str(parsed.get("precautions", "")).strip()

        if not (organic and chemical and precautions):
            return {}

        return {
            "organic": organic,
            "chemical": chemical,
            "precautions": precautions,
        }
    except Exception as exc:
        logger.warning("Groq disease recommendation failed, using fallback: %s", exc)
        return {}

def get_solutions_db():
    if not os.path.exists(SOLUTIONS_PATH):
        return {}
    with open(SOLUTIONS_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

async def analyze_disease(file: UploadFile) -> DiseaseDetectionResponse:
    solutions_db = get_solutions_db()
    
    # Read file content
    contents = await file.read()
    
    # Make request to the external model
    # Use requests since we know it correctly formats the multipart for the Keras model
    def call_predict_api():
        url = MODEL_API_URL
        # Pass bytes directly with explicit content type
        files = {"file": (file.filename or "image.jpg", contents, file.content_type or "image/jpeg")}
        return requests.post(url, files=files, timeout=60)
        
    try:
        if contents:
            print(f"DEBUG: Forwarding {len(contents)} bytes to {MODEL_API_URL} using requests module")
            
        # Run synchronous requests call in a thread pool
        response = await asyncio.to_thread(call_predict_api)
        
        if response.status_code != 200:
            error_detail = response.text
            print(f"DEBUG: Model API Error ({response.status_code}): {error_detail}")
            raise HTTPException(status_code=response.status_code, detail=f"Model API error ({response.status_code}): {error_detail}")
        
        data = response.json()
        
        crop = data.get("crop", "Unknown")
        disease = data.get("disease", "Unknown")
        confidence = data.get("confidence", 0.0) * 100 # Convert to percentage
        
        # Find the best matching solution in the DB
        disease_key = "Default"
        for key in solutions_db:
            if key.lower() == disease.lower():
                disease_key = key
                break
                
        if disease_key == "Default":
            for key in solutions_db:
                if key.lower() in disease.lower() or disease.lower() in key.lower():
                    disease_key = key
                    break
        
        solution = solutions_db.get(disease_key, solutions_db.get("Default", {}))
        
        disease_name_display = disease
        if disease_name_display.lower() == "healthy":
            disease_name_display = "No Disease Detected (Healthy)"

        # Ask LLM for tailored recommendations and fall back to curated static mappings.
        llm_solution = await asyncio.to_thread(
            _generate_llm_solutions_sync,
            crop,
            disease_name_display,
            round(confidence, 1),
            solution,
        )

        organic = llm_solution.get("organic") or solution.get("organic", "No organic treatment suggestions available.")
        chemical = llm_solution.get("chemical") or solution.get("chemical", "No chemical treatment suggestions available.")
        precautions = llm_solution.get("precautions") or solution.get("precautions", "Maintain general crop hygiene.")

        return DiseaseDetectionResponse(
            crop_name=crop,
            disease_name=disease_name_display,
            confidence=round(confidence, 1),
            description=solution.get("description", "No description available."),
            chemical=chemical,
            organic=organic,
            precautions=precautions,
            stores=solution.get("stores", "Consult local providers.")
        )
            
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request to disease detection model timed out")
    except requests.exceptions.RequestException as exc:
        raise HTTPException(status_code=503, detail=f"Failed to communicate with disease detection model: {exc}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
