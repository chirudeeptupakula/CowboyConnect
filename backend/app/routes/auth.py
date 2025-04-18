# ✅ File: backend/app/routes/auth.py (updated login with JWT)

from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.database import get_db
from backend.app.utils import hash_password, verify_password
from jose import jwt
import os
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db_user.password = hash_password(user.password)
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

    payload = {
        "sub": str(user.id),
        "username": user.username,
        "role": user.role.value,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "role": user.role
    }
