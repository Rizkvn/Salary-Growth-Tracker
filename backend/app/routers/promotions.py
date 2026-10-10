from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud, auth
from ..database import get_db

router = APIRouter(
    prefix="/api/promotions",
    tags=["promotions"],
    dependencies=[Depends(auth.get_current_user)],
)

@router.get("/", response_model=List[schemas.PromotionResponse])
def read_promotions(db: Session = Depends(get_db)):
    return crud.get_promotions(db)

@router.post("/", response_model=schemas.PromotionResponse, status_code=status.HTTP_201_CREATED)
def create_promotion(promotion: schemas.PromotionCreate, db: Session = Depends(get_db)):
    return crud.create_promotion(db=db, promotion=promotion)

@router.delete("/{promotion_id}")
def delete_promotion(promotion_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_promotion(db=db, promotion_id=promotion_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promotion not found")
    return {"status": "deleted", "id": promotion_id}
