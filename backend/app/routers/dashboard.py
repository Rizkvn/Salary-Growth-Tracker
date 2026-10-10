from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas, crud, auth
from ..database import get_db

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
    dependencies=[Depends(auth.get_current_user)],
)

@router.get("/", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_metrics(db)

@router.get("/forecast", response_model=schemas.ForecastResponse)
def get_salary_forecast(db: Session = Depends(get_db)):
    return crud.get_forecast(db)

