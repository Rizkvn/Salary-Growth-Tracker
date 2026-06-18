from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud
from ..database import get_db

router = APIRouter(
    prefix="/api/salaries",
    tags=["Salaries"]
)

@router.get("/", response_model=List[schemas.SalaryResponse])
def read_salaries(db: Session = Depends(get_db)):
    return crud.get_salaries(db)

@router.post("/", response_model=schemas.SalaryResponse, status_code=status.HTTP_201_CREATED)
def create_salary(salary: schemas.SalaryCreate, db: Session = Depends(get_db)):
    return crud.create_salary(db=db, salary=salary)

@router.delete("/{salary_id}")
def delete_salary(salary_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_salary(db=db, salary_id=salary_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Salary not found")
    return {"status": "deleted", "id": salary_id}
