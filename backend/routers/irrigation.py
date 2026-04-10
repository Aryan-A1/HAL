from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..database import get_db
from ..models.crop import CropProfile
from .auth import get_current_user
from ..models.user import User
from ..services.irrigation.forecast_engine import get_forecast_engine

router = APIRouter(prefix="/irrigation", tags=["irrigation"])

class ForecastRequest(BaseModel):
    crop_id: Optional[int] = None
    lat: float
    lon: float
    crop_type: str
    soil_type: str
    sowing_date: str
    region: str
    water_source: str = "Canal"
    field_area_hectare: float = 1.0
    mulching_used: str = "No"

@router.post("/forecast")
def get_irrigation_forecast(
    request: ForecastRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    try:
        # Pre-fetch crop profile to get historical data
        crop = None
        engine_input = request.dict()
        
        if request.crop_id:
            crop = db.query(CropProfile).filter(
                CropProfile.id == request.crop_id,
                CropProfile.user_id == current_user.id
            ).first()
            
            if crop:
                # Tell engine when we last watered
                engine_input["last_irrigation_date"] = crop.last_irrigation_date

        forecast_engine = get_forecast_engine()
        calendar = forecast_engine.get_30_day_forecast(engine_input)
        if not calendar:
            raise HTTPException(status_code=500, detail="Weather integration failed.")
        
        # Persistence Logic: Update 'upcoming_irrigation_date' if crop_id is provided
        upcoming_date = None
        if request.crop_id:
            # Find first date with recommendation "irrigate"
            for day in calendar:
                if day["recommendation"].get("irrigate"):
                    upcoming_date = datetime.strptime(day["date"], "%Y-%m-%d")
                    break
            
            if crop:
                crop.upcoming_irrigation_date = upcoming_date
                db.commit()
                db.refresh(crop)

        result = {
            "crop": request.crop_type,
            "module": "irrigation",
            "upcoming_date": upcoming_date,
            "calendar": calendar
        }
        
        if request.crop_id and crop:
            result["last_irrigation_date"] = crop.last_irrigation_date
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
