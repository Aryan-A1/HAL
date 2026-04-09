from pydantic import BaseModel
from typing import Optional

class DiseaseDetectionResponse(BaseModel):
    crop_name: str
    disease_name: str
    confidence: float
    description: str
    chemical: str
    organic: str
    precautions: str
    stores: str
