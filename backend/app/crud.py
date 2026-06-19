from datetime import date
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

def get_dashboard_metrics(db: Session):
    today = date.today()
    
    # 1. Current Salary
    current_salary_record = db.query(models.Salary).filter(
        models.Salary.effective_date <= today
    ).order_by(
        models.Salary.effective_date.desc(),
        models.Salary.id.desc()
    ).first()
    
    current_salary = current_salary_record.amount if current_salary_record else None
    
    # 2. Earliest Salary
    earliest_salary_record = db.query(models.Salary).order_by(
        models.Salary.effective_date.asc(),
        models.Salary.id.asc()
    ).first()
    
    salary_growth = None
    years_worked = None
    
    if earliest_salary_record is not None:
        e_date = earliest_salary_record.effective_date
        
        # Calendar-year calculation
        years_worked = today.year - e_date.year - ((today.month, today.day) < (e_date.month, e_date.day))
        
        if current_salary is not None:
            salary_growth = current_salary - earliest_salary_record.amount
            
    # 3. Promotion Count
    promotion_count = db.query(models.Promotion).count()
    
    return {
        "current_salary": current_salary,
        "salary_growth": salary_growth,
        "promotion_count": promotion_count,
        "years_worked": years_worked
    }

def get_qualifying_salaries(db: Session, as_of: date):
    """Salary records dengan effective_date <= as_of, diurutkan kronologis.
    Tie-break dengan id ascending untuk duplicate effective_date."""
    return (
        db.query(models.Salary)
        .filter(models.Salary.effective_date <= as_of)
        .order_by(models.Salary.effective_date.asc(), models.Salary.id.asc())
        .all()
    )

def calculate_average_nominal_increase(qualifying_salaries: list):
    if len(qualifying_salaries) < 2:
        return None
    diffs = [
        qualifying_salaries[i].amount - qualifying_salaries[i - 1].amount
        for i in range(1, len(qualifying_salaries))
    ]
    return sum(diffs) / len(diffs)

def get_forecast(db: Session) -> dict:
    today = date.today()
    qualifying = get_qualifying_salaries(db, as_of=today)

    if not qualifying:
        return {
            "current_salary": None,
            "average_nominal_increase": None,
            "forecast_1_year": None,
            "forecast_2_year": None,
            "forecast_3_year": None,
        }

    current_salary = qualifying[-1].amount
    average_increase = calculate_average_nominal_increase(qualifying)

    if average_increase is None:
        return {
            "current_salary": current_salary,
            "average_nominal_increase": None,
            "forecast_1_year": None,
            "forecast_2_year": None,
            "forecast_3_year": None,
        }

    forecast_1 = max(current_salary + average_increase, 0)
    forecast_2 = max(forecast_1 + average_increase, 0)
    forecast_3 = max(forecast_2 + average_increase, 0)

    return {
        "current_salary": current_salary,
        "average_nominal_increase": average_increase,
        "forecast_1_year": forecast_1,
        "forecast_2_year": forecast_2,
        "forecast_3_year": forecast_3,
    }



