from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
from .config import settings

# Password hashing context (included for learning, even if not strictly used for single-user plain text pwd)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Helper to verify a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Helper to hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    """Creates a JWT access token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    
    # Encode JWT using the secret key from settings
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm="HS256")
    return encoded_jwt
