from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Enum
from backend.app.database import Base

from .database import Base  # ✅ This is what defines Base
import enum


class UserRole(enum.Enum):
    student = "student"
    faculty = "faculty"
    admin = "admin"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password = Column(String, nullable=False)  # Store hashed
    role = Column(Enum(UserRole), nullable=False)
    department = Column(String, nullable=False)
