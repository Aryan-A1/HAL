from fastapi import APIRouter, HTTPException, Body
from ..services.weather_service import weather_service
from ..services.ai_insights import ai_insights_service
from typing import List, Optional, Dict

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("/forecast")
def get_weather_forecast(lat: float, lon: float, days: int = 16):
    """
    Get weather forecast for a specific location.
    """
    data = weather_service.get_forecast(lat, lon, days=days)
    if not data:
        raise HTTPException(status_code=500, detail="Failed to fetch weather data")
    return data

@router.post("/insights/weekly")
def get_weekly_ai_insights(
    weather_data: List[Dict] = Body(...),
    crops_count: int = Body(...)
):
    """
    Get AI-generated weekly insights based on weather and crop data.
    """
    insights = ai_insights_service.get_weekly_insights(weather_data, crops_count)
    return insights
