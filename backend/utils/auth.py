import os
from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

# Security configurations
import bcrypt
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = type('about', (object,), {'__version__': bcrypt.__version__})

PWD_CONTEXT = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set. Please check your .env file.")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

import hashlib

def get_password_hash(password: str) -> str:
    """Hash the password after pre-hashing with SHA-256 to overcome bcrypt's 72-byte limit."""
    pw_sha = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return PWD_CONTEXT.hash(pw_sha)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify the password by pre-hashing with SHA-256 first."""
    pw_sha = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return PWD_CONTEXT.verify(pw_sha, hashed_password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
