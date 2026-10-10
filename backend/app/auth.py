from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings

# Password hashing context (included for learning, even if not strictly used for single-user plain text pwd)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTPBearer scheme — auto-rejects requests without an Authorization: Bearer header
_bearer_scheme = HTTPBearer(auto_error=True)

# Generic 401 exception — never exposes token contents or secret values in the response
_CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

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

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> str:
    """FastAPI dependency that validates the Bearer JWT on every protected request.

    Verifies:
    - Token is present and has Bearer scheme (enforced by HTTPBearer)
    - Signature is valid against settings.jwt_secret using HS256 only
    - Token has not expired (jose checks 'exp' claim automatically)
    - 'sub' claim is present and non-empty

    Returns:
        The 'sub' claim (identity string) on success.

    Raises:
        HTTP 401 for any missing, malformed, expired, or invalid token.
        The error detail is intentionally generic — no secret or token data is included.
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=["HS256"],  # Explicit allowlist — never accepts 'none' or other algorithms
        )
        subject: str = payload.get("sub")
        if not subject:
            raise _CREDENTIALS_EXCEPTION
    except JWTError:
        # Covers: invalid signature, expired token, malformed token, wrong algorithm
        raise _CREDENTIALS_EXCEPTION

    return subject
