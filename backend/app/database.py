from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Connect to SQLite, avoiding the same thread error common in FastAPI + SQLite
engine = create_engine(
    settings.database_url, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class whose instances will be database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for our declarative models
Base = declarative_base()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
