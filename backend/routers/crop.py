from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.crop import CropProfile
from backend.schemas.crop import CropCreate, CropResponse
from backend.routers.auth import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/crops", tags=["crops"])

CROP_TYPE_MAPPING = {
    "wheat": "Rabi",
    "rice": "Kharif",
    "potato": "Rabi",
    "sugarcane": "Kharif", # perenial but usually Kharif
    "cotton": "Kharif",
    "maize": "Kharif"
}

@router.post("/", response_model=CropResponse)
def create_crop_profile(
    crop_in: CropCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Map crop name to crop type
    crop_type = CROP_TYPE_MAPPING.get(crop_in.crop_name.lower(), "Unknown")
    
    db_crop = CropProfile(
        **crop_in.dict(),
        user_id=current_user.id,
        crop_type=crop_type
    )
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.get("/", response_model=List[CropResponse])
def get_user_crops(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(CropProfile).filter(CropProfile.user_id == current_user.id).all()
