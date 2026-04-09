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

@router.get("/")
def get_filtered_schemes(crop: Optional[str] = None, state: Optional[str] = None):
    try:
        schemes = load_schemes()
        filtered_schemes = []
        for scheme in schemes:
            scheme_crop = scheme.get('crop', '').lower()
            scheme_state = scheme.get('state', '').lower()

            # Logic: Match input crop OR "all"
            crop_match = not crop or scheme_crop == 'all' or scheme_crop == crop.lower()
            
            # Logic: Match input state OR "all"
            state_match = not state or scheme_state == 'all' or scheme_state == state.lower()

            if crop_match and state_match:
                filtered_schemes.append(scheme)

        return filtered_schemes
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
