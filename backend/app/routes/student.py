from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User
from backend.app.utils import get_current_user  # if using JWT

router = APIRouter(prefix="/student", tags=["student"])

@router.get("/data")
def get_student_data(db: Session = Depends(get_db)):
    return {"message": "Hello from Student Route"}
