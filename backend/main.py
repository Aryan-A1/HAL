import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Routers and DB - these are core and must always be available
from .routers import auth, crop, scheme, weather
from .database import engine, Base

# Try to import optional routers (may not exist in all branches)
try:
    from .routers import chatbot, irrigation
    HAS_EXTRA_ROUTERS = True
except ImportError:
    HAS_EXTRA_ROUTERS = False

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HAL API - Intelligent Agriculture")

app.include_router(auth.router, prefix="/api")
app.include_router(crop.router, prefix="/api")
app.include_router(scheme.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
if HAS_EXTRA_ROUTERS:
    app.include_router(chatbot.router, prefix="/api")
    app.include_router(irrigation.router, prefix="/api")

BASE_DIR = os.path.dirname(__file__)
STATIC_DIR = os.path.join(BASE_DIR, "static")
os.makedirs(os.path.join(STATIC_DIR, "audio"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "HAL Master Backend is ready."}

@app.post("/api/irrigation/forecast")
def get_irrigation_forecast(request: dict):
    try:
        # Lazy import — only fails if called, not on startup
        from services.irrigation.forecast_engine import forecast_engine
        calendar = forecast_engine.get_30_day_forecast(request)
        if not calendar:
            raise HTTPException(status_code=500, detail="Weather integration failed.")
        return {
            "crop": request.get("crop_type"),
            "module": "irrigation",
            "calendar": calendar
        }
    except ImportError:
        raise HTTPException(status_code=503, detail="Irrigation ML service not available. Please install ML dependencies.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
