from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app import schemas, models
from backend.app.database import get_db
from backend.app.utils import hash_password

# ✅ Define your router first
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db_user.password = hash_password(db_user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"status": "success", "user_id": db_user.id}
