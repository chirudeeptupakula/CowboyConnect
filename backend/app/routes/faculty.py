from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User
from backend.app.utils import get_current_user

# ✅ You forgot this line!
router = APIRouter(prefix="/faculty", tags=["faculty"])

@router.get("/students")
def get_all_students(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if current_user.role != "faculty":
        return {"error": "Access denied"}

    students = db.query(User).filter(User.role == "student").all()
    return students
