import csv
import io
from datetime import date
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from .. import crud
from ..database import get_db

router = APIRouter(
    prefix="/api/export",
    tags=["export"]
)

@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    salaries = crud.get_all_salaries_for_export(db)
    promotions = crud.get_all_promotions_for_export(db)
    
    # Build CSV in memory
    stream = io.StringIO()
    
    # Write UTF-8 BOM for Excel compatibility
    stream.write('\ufeff')
    
    writer = csv.writer(stream)
    
    # Section 1: Salary History
    writer.writerow(["SALARY HISTORY"])
    writer.writerow(["id", "amount", "effective_date", "notes"])
    for s in salaries:
        writer.writerow([s.id, s.amount, s.effective_date, s.notes])
        
    # Empty row as separator
    writer.writerow([])
    
    # Section 2: Promotion History
    writer.writerow(["PROMOTION HISTORY"])
    writer.writerow(["id", "title", "promotion_date", "notes"])
    for p in promotions:
        writer.writerow([p.id, p.title, p.promotion_date, p.notes])
        
    filename = f"salary_growth_export_{date.today().isoformat()}.csv"
    
    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
