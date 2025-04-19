from fastapi import APIRouter, Depends, HTTPException, Body, Request
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.utils import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

# ✅ Replacement for token-based auth
def get_current_user(request: Request, db: Session = Depends(get_db)):
    username = request.headers.get("X-Username")

    if not username:
        raise HTTPException(status_code=401, detail="Missing X-Username header")

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

# ✅ Registration Route
@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db_user.password = hash_password(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"status": "success", "user_id": db_user.id}


# ✅ Login Route
@router.post("/login")
def login_user(data: dict = Body(...), db: Session = Depends(get_db)):
    username = data.get("username")
    password = data.get("password")

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ No token, just send identity info to store in localStorage
    return {
        "username": user.username,
        "role": user.role.value,  # convert enum to "student", "faculty", etc.
        "department": user.department
    }
