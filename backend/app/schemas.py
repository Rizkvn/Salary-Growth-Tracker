from datetime import date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

class SalaryBase(BaseModel):
    amount: float = Field(..., gt=0)
    effective_date: date
    notes: Optional[str] = Field(None, max_length=500)

class SalaryCreate(SalaryBase):
    pass

class SalaryResponse(SalaryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class PromotionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, pattern=r".*\S+.*")
    promotion_date: date
    notes: Optional[str] = Field(None, max_length=500)

class PromotionCreate(PromotionBase):
    pass

class PromotionResponse(PromotionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class DashboardResponse(BaseModel):
    current_salary: Optional[float]
    salary_growth: Optional[float]
    promotion_count: int
    years_worked: Optional[int]

