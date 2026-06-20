from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from . import models, schemas, auth
from .database import engine, get_db
from .config import settings
from .routers import salaries, promotions, dashboard, export

# Create database tables automatically during startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salary Growth Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(salaries.router)
app.include_router(promotions.router)
app.include_router(dashboard.router)
app.include_router(export.router)

@app.get("/")
def read_root():
    return {"message": "Salary Growth Tracker API is running"}

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Validate database connection by executing a simple query
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected"}

@app.post("/api/auth/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest):
    # Single-user authentication: Verify against the environment variable
    if request.password != settings.app_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password",
        )
    
    # Generate JWT token
    access_token = auth.create_access_token(data={"sub": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}
