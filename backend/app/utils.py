from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
from fastapi import HTTPException, Header, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT configuration (not used but retained for future expansion)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")  # Use a strong secret in production!
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# JWT helper (optional)
def create_access_token(data: dict, expires_delta=None):
    from datetime import datetime, timedelta
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=2))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ✅ Custom header-based user resolution
def get_user_from_header(x_username: str = Header(...), db: Session = Depends(get_db)) -> User:
    if not x_username:
        raise HTTPException(status_code=401, detail="Missing X-Username header")

    user = db.query(User).filter(User.username == x_username).first()

    if not user:
        print("❌ No user found for:", x_username)

        raise HTTPException(status_code=404, detail="User not found")

    return user

# 🔒 Optional: retain get_current_user for token-based access if needed
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
