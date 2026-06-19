from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas, crud
from ..database import get_db

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"]
)

@router.get("/", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_metrics(db)
