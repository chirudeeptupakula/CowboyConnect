from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User
from backend.app.utils import get_current_user

# ✅ Define your router here!
router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users")
def get_all_users(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        return {"error": "Access denied"}

    return db.query(User).all()
