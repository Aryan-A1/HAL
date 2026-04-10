from fastapi import APIRouter, Query
from typing import Optional
import json
from ..services.ai_insights import ai_insights_service

router = APIRouter(prefix="/catchup", tags=["catchup"])

from pydantic import BaseModel

class CatchUpRequest(BaseModel):
    crop: str
    location: str
    soilType: Optional[str] = None
    plantingDate: Optional[str] = None
    lastIrrigation: Optional[str] = None
    diseaseStatus: Optional[str] = None

@router.post("")
def get_catchup_summary(request: CatchUpRequest):
    """
    Generate a personalized Catch Up summary for the crop using real data.
    """
    if not ai_insights_service.client:
        return {
            "summary": f"Your {request.crop} crop in {request.location} is currently active. "
                       f"Soil type is {request.soilType or 'Unknown'}. "
                       f"Last irrigation: {request.lastIrrigation or 'No data'}. "
                       f"Disease status: {request.diseaseStatus or 'No data'}."
        }
        
    prompt = f"""
    You are an expert agriculture AI. Provide a short, structured "Catch Up" response for a farmer based ONLY on this real data:
    Crop: {request.crop}
    Location: {request.location}
    Soil Type: {request.soilType or 'Not specified'}
    Planting Date: {request.plantingDate or 'Not specified'}
    Last Irrigation: {request.lastIrrigation or 'None recorded'}
    Disease Status: {request.diseaseStatus or 'No issues reported'}
    
    Structure your response sequentially and factually based on the data. For example:
    "Your {request.crop} crop in {request.location} is active since {request.plantingDate or 'recently'}.
    Soil type is {request.soilType or 'standard'}.
    Last irrigation was {request.lastIrrigation or 'not recorded'}.
    Disease status: {request.diseaseStatus or 'Healthy'}."
    
    Keep it concise and practical. You don't need to wrap the sentences in quotes. Do not invent any data or suggestions not supported by the parameters. Respond in JSON format with a single key 'summary'.
    """
    try:
        response = ai_insights_service.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a professional agricultural AI assistant."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        data = json.loads(response.choices[0].message.content)
        summary_val = data.get("summary")
        
        if not summary_val:
            summary_val = f"Monitor your {request.crop} in {request.location} based on current conditions."
        elif isinstance(summary_val, dict):
            summary_val = "\n".join([f"{str(v)}" for k, v in summary_val.items()])
        elif isinstance(summary_val, list):
            summary_val = "\n".join([str(v) for v in summary_val])
            
        return {"summary": str(summary_val)}
    except Exception as e:
        print(f"Error generating catchup summary: {e}")
        return {
            "summary": f"Your {request.crop} crop in {request.location} is currently active. \nLast irrigation: {request.lastIrrigation or 'No data'}. \nDisease status: {request.diseaseStatus or 'No data'}."
        }
