from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.crop import CropProfile
from ..routers.auth import get_current_user
from ..schemas.disease import DiseaseDetectionResponse
from ..services.disease_service import analyze_disease

router = APIRouter(prefix="/disease", tags=["disease"])

@router.post("/detect", response_model=DiseaseDetectionResponse)
async def quick_scan(file: UploadFile = File(...)):
    """
    Quick scan an image without requiring it to be tied to a specific crop profile.
    Can be used anonymously or by logged-in users.
    """
    return await analyze_disease(file)

@router.post("/detect/{crop_id}", response_model=DiseaseDetectionResponse)
async def scan_crop_profile(
    crop_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Scan an image tied to a specific user's crop profile.
    """
    # Verify crop belongs to the current user
    crop = db.query(CropProfile).filter(
        CropProfile.id == crop_id, 
        CropProfile.user_id == current_user.id
    ).first()
    
    if not crop:
        raise HTTPException(status_code=404, detail="Crop profile not found or doesn't belong to the user")
        
    return await analyze_disease(file)
