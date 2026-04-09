import os
import logging
import platform

# Work around slow/hanging WMI lookups on some Windows setups.
if os.name == "nt":
    arch = os.environ.get("PROCESSOR_ARCHITECTURE")
    if arch:
        def _fast_machine() -> str:
            return arch

        platform.machine = _fast_machine

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv

# Load backend/.env regardless of current working directory.
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=ENV_PATH)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Neon DB's PostgreSQL URL from env
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

# Check for database URL and handle fallback
if not SQLALCHEMY_DATABASE_URL:
    logger.warning("DATABASE_URL not set. Falling back to local SQLite: sqlite:///./hal.db")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./hal.db"

# Handle Neon DB specific prefix
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Logic to choose engine parameters based on DB type
is_sqlite = SQLALCHEMY_DATABASE_URL.startswith("sqlite")
engine_args = {
    "pool_pre_ping": True,
}

if is_sqlite:
    # SQLite needs this for multi-thread access in FastAPI
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    # Set a timeout for cloud databases to prevent infinite hang
    engine_args["pool_recycle"] = 300
    engine_args["connect_args"] = {"connect_timeout": 5}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
