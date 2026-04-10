import os
import sys
from datetime import datetime

# Setup paths to allow importing from backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from backend.services.irrigation.forecast_engine import get_forecast_engine
    
    engine = get_forecast_engine()
    
    dummy_input = {
        "lat": 30.9,
        "lon": 75.85,
        "crop_type": "Wheat",
        "soil_type": "loamy",
        "sowing_date": "2026-04-10",
        "region": "Punjab",
        "water_source": "Canal",
        "field_area_hectare": 1.0,
        "mulching_used": "No"
    }
    
    print("Testing 30-day forecast generation...")
    calendar = engine.get_30_day_forecast(dummy_input)
    
    if calendar:
        print(f"SUCCESS: Generated {len(calendar)} days of forecast.")
        print(f"First day: {calendar[0]['date']} - {calendar[0]['recommendation']['reason']}")
    else:
        print("FAILED: No calendar generated.")
        
except Exception as e:
    print(f"CRASH OCCURRED: {e}")
    import traceback
    traceback.print_exc()
