import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Routers and DB - these are core and must always be available
from .routers import auth, crop, scheme, weather, disease
from .database import engine, Base

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Keep startup fast by making schema creation opt-in.
    auto_create_tables = os.getenv("AUTO_CREATE_TABLES", "0").lower() in {"1", "true", "yes"}
    if auto_create_tables:
        try:
            Base.metadata.create_all(bind=engine)
        except Exception as exc:
            logger.warning("Skipping table auto-create due to DB issue: %s", exc)
    yield


app = FastAPI(title="HAL API - Intelligent Agriculture", lifespan=lifespan)

# Try to import optional routers (may not exist in all branches)
try:
    from .routers import chatbot, irrigation
    HAS_EXTRA_ROUTERS = True
except ImportError:
    HAS_EXTRA_ROUTERS = False

app.include_router(auth.router, prefix="/api")
app.include_router(crop.router, prefix="/api")
app.include_router(scheme.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(disease.router, prefix="/api")

try:
    from .routers import catchup
    app.include_router(catchup.router, prefix="/api")
except ImportError:
    pass
if HAS_EXTRA_ROUTERS:
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

from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) or "Internal Server Error"},
        headers={"Access-Control-Allow-Origin": "*"}
    )

@app.get("/")
def read_root():
    return {"status": "online", "message": "HAL Master Backend is ready."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
