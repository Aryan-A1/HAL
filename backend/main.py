from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

# New Import path for HAL structure
# Absolute Import for HAL structure
from backend.services.irrigation.forecast_engine import forecast_engine
from backend.routers import auth, crop, scheme, irrigation
from backend.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HAL API - Intelligent Agriculture")

app.include_router(auth.router, prefix="/api")
app.include_router(crop.router, prefix="/api")
app.include_router(scheme.router, prefix="/api")
app.include_router(irrigation.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "HAL Master Backend is ready."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
