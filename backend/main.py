import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn

# New Import path for HAL structure
# Absolute Import for HAL structure
from services.irrigation.forecast_engine import forecast_engine
from routers import auth, crop, scheme
from database import engine, Base
from backend.services.irrigation.forecast_engine import forecast_engine
from backend.routers import auth, crop, scheme, chatbot, irrigation
from backend.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HAL API - Intelligent Agriculture")

app.include_router(auth.router, prefix="/api")
app.include_router(crop.router, prefix="/api")
app.include_router(scheme.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")
app.include_router(irrigation.router, prefix="/api")

BASE_DIR = os.path.dirname(__file__)
STATIC_DIR = os.path.join(BASE_DIR, "static")
os.makedirs(os.path.join(STATIC_DIR, "audio"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "HAL Master Backend is ready."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
