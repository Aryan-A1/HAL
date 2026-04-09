from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class CropProfile(Base):
    __tablename__ = "crop_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    
    crop_name = Column(String, index=True)
    crop_type = Column(String) # Rabi, Kharif, Zaid
    soil_type = Column(String)
    
    sowing_date = Column(Date)
    expected_harvesting_date = Column(Date)
    
    # Irrigation & Monitoring (initially null)
    last_irrigation_date = Column(DateTime, nullable=True)
    upcoming_irrigation_date = Column(DateTime, nullable=True)
    
    # Fertilizer & Pesticide (initially null)
    pesticide_details = Column(String, nullable=True)
    fertilizer_details = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to user
    owner = relationship("User", back_populates="crops")
