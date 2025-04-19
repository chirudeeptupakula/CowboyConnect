from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime
from typing import Optional


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



class ClubBase(BaseModel):
    name: str
    description: str

class ClubOut(ClubBase):
    id: int
    class Config:
        orm_mode = True

class ClubJoin(BaseModel):
    club_id: int

class TimesheetLog(BaseModel):
    club_id: int
    hours: float
    description: str

class TimesheetOut(BaseModel):
    id: int
    club_id: int
    date: datetime
    hours: float
    description: str
    class Config:
        orm_mode = True

class CourseCreate(BaseModel):
    course_name: str
    course_code: str
    description: Optional[str] = None



class CourseOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    created_by: int

    class Config:
        orm_mode = True

# -----------------------
# 📦 Club Volunteer
# -----------------------

class ClubVolunteerBase(BaseModel):
    club_id: int

class ClubVolunteerCreate(ClubVolunteerBase):
    pass

class ClubVolunteerOut(BaseModel):
    id: int
    student_id: int
    club_id: int
    joined_at: datetime

    class Config:
        orm_mode = True

# -----------------------
# ⏱️ Student Timesheet
# -----------------------

class TimesheetClockIn(BaseModel):
    club_id: int
    description: Optional[str] = ""

class TimesheetClockOut(BaseModel):
    timesheet_id: int

class StudentTimesheetOut(BaseModel):
    id: int
    student_id: int
    club_id: int
    date: datetime
    hours: float
    description: Optional[str]

    class Config:
        orm_mode = True
