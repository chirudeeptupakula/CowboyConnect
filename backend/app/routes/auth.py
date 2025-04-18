from sqlalchemy.orm import Session
from backend.app import schemas, models
from backend.app.database import get_db
from fastapi import APIRouter, Depends, HTTPException, Body
from backend.app.utils import hash_password, verify_password



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

@router.post("/login")
def login_user(data: dict = Body(...), db: Session = Depends(get_db)):
    username = data.get("username")
    password = data.get("password")

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"status": "success", "role": user.role, "username": user.username}

