from sqlalchemy import Column, Integer, String, Float, Date
from .database import Base

class Salary(Base):
    __tablename__ = "salaries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    amount = Column(Float, nullable=False)
    effective_date = Column(Date, nullable=False, index=True)
    notes = Column(String, nullable=True)

class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    promotion_date = Column(Date, nullable=False, index=True)
    notes = Column(String, nullable=True)
