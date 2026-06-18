from sqlalchemy.orm import Session
from . import models, schemas

def get_salaries(db: Session):
    return db.query(models.Salary).order_by(models.Salary.effective_date.asc()).all()

def create_salary(db: Session, salary: schemas.SalaryCreate):
    db_salary = models.Salary(
        amount=salary.amount,
        effective_date=salary.effective_date,
        notes=salary.notes
    )
    db.add(db_salary)
    db.commit()
    db.refresh(db_salary)
    return db_salary

def delete_salary(db: Session, salary_id: int):
    db_salary = db.query(models.Salary).filter(models.Salary.id == salary_id).first()
    if db_salary is None:
        return False
    db.delete(db_salary)
    db.commit()
    return True

def get_promotions(db: Session):
    return db.query(models.Promotion).order_by(models.Promotion.promotion_date.asc()).all()

def create_promotion(db: Session, promotion: schemas.PromotionCreate):
    db_promotion = models.Promotion(
        title=promotion.title,
        promotion_date=promotion.promotion_date,
        notes=promotion.notes
    )
    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)
    return db_promotion

def delete_promotion(db: Session, promotion_id: int):
    db_promotion = db.query(models.Promotion).filter(models.Promotion.id == promotion_id).first()
    if db_promotion is None:
        return False
    db.delete(db_promotion)
    db.commit()
    return True

