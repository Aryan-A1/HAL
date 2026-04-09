from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

# New Import path for HAL structure
# Absolute Import for HAL structure
from services.irrigation.forecast_engine import forecast_engine
from routers import auth, crop, scheme
from database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HAL API - Intelligent Agriculture")

app.include_router(auth.router, prefix="/api")
app.include_router(crop.router, prefix="/api")
app.include_router(scheme.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    lat: float
    lon: float
    crop_type: str
    soil_type: str
    sowing_date: str
    region: str
    water_source: str
    field_area_hectare: float
    mulching_used: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "HAL Master Backend is ready."}

@app.post("/api/irrigation/forecast")
def get_irrigation_forecast(request: ForecastRequest):
    try:
        calendar = forecast_engine.get_30_day_forecast(request.dict())
        if not calendar:
            raise HTTPException(status_code=500, detail="Weather integration failed.")
        return {
            "crop": request.crop_type,
            "module": "irrigation",
            "calendar": calendar
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
