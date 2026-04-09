from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.crop import CropProfile
from ..schemas.crop import CropCreate, CropResponse
from .auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/crops", tags=["crops"])

CROP_TYPE_MAPPING = {
    "wheat": "Rabi",
    "rice": "Kharif",
    "potato": "Rabi",
    "sugarcane": "Kharif", # perenial but usually Kharif
    "cotton": "Kharif",
    "maize": "Kharif"
}

@router.post("", response_model=CropResponse)
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

@router.get("", response_model=List[CropResponse])
def get_user_crops(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(CropProfile).filter(CropProfile.user_id == current_user.id).all()

@router.get("/{crop_id}", response_model=CropResponse)
def get_crop_profile(
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crop = db.query(CropProfile).filter(
        CropProfile.id == crop_id, 
        CropProfile.user_id == current_user.id
    ).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop profile not found")
    return crop

@router.post("/{crop_id}/irrigate", response_model=CropResponse)
def record_irrigation(
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crop = db.query(CropProfile).filter(
        CropProfile.id == crop_id, 
        CropProfile.user_id == current_user.id
    ).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop profile not found")
    
    from datetime import datetime
    crop.last_irrigation_date = datetime.now()
    # When they irrigate, we should probably clear the 'upcoming' one until next forecast
    crop.upcoming_irrigation_date = None
    
    db.commit()
    db.refresh(crop)
    return crop
