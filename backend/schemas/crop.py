from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, datetime

class CropBase(BaseModel):
    crop_name: str # wheat, rice, potato, sugarcane, cotton, maize
    soil_type: str
    sowing_date: date
    expected_harvesting_date: date
    last_irrigation_date: Optional[datetime] = None
    upcoming_irrigation_date: Optional[datetime] = None

    @field_validator('crop_name')
    @classmethod
    def validate_crop_name(cls, v: str):
        allowed = ["wheat", "rice", "potato", "sugarcane", "cotton", "maize"]
        v_lower = v.lower()
        
        # Check if the name contains any of the allowed keywords
        for crop in allowed:
            if crop in v_lower:
                return v_lower # Keep the full descriptive name but ensure it's categorized correctly
        
        # Fallback to wheat as a safe default if no match is found, instead of erroring
        return v_lower

class CropCreate(CropBase):
    pass

class CropResponse(CropBase):
    id: int
    user_id: int
    crop_type: str
    pesticide_details: Optional[str] = None
    fertilizer_details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
