from fastapi import APIRouter, HTTPException
from typing import Optional, List, Dict, Any
import json
import os

router = APIRouter(prefix="/schemes", tags=["schemes"])

# Safe path fetching considering backend/routers/scheme.py
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'schemes.json')

def load_schemes() -> List[Dict[str, Any]]:
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading schemes.json: {e}")
        return []

@router.get("/all")
def get_all_schemes():
    return load_schemes()

@router.get("")
def get_filtered_schemes(crop: Optional[str] = None, state: Optional[str] = None):
    try:
        schemes = load_schemes()
        filtered_schemes = []
        for scheme in schemes:
            scheme_crop = scheme.get('crop', '').lower()
            scheme_state = scheme.get('state', '').lower()

            # Logic: Match input crop OR "all" (case-insensitive)
            scheme_crop_lower = scheme_crop.lower()
            input_crop_lower = crop.lower() if crop else ""
            crop_match = not crop or scheme_crop_lower == 'all' or scheme_crop_lower == input_crop_lower
            
            # Logic: Match input state OR "all" (case-insensitive)
            scheme_state_lower = scheme_state.lower()
            input_state_lower = state.lower() if state else ""
            state_match = not state or scheme_state_lower == 'all' or scheme_state_lower == input_state_lower

            if crop_match and state_match:
                filtered_schemes.append(scheme)

        return filtered_schemes
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
