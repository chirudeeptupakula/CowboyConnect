from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime


class UserRole(str, Enum):
    student = "student"
    faculty = "faculty"
    admin = "admin"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    role: UserRole
    department: str


class CourseCreate(BaseModel):
    title: str
    description: str

class CourseOut(BaseModel):
    id: int
    title: str
    description: str
    created_by: int

    class Config:
        orm_mode = True

class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    date: datetime

class EventOut(BaseModel):
    id: int
    title: str
    description: str
    location: str
    date: datetime
    created_by: int

    class Config:
        orm_mode = True

