from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Enum
from backend.app.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from datetime import datetime


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

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))  # faculty user_id
    created_at = Column(DateTime, default=datetime.utcnow)

class StudentCourse(Base):
    __tablename__ = 'student_courses'

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    registered_at = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    location = Column(String)
    date = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class EventParticipant(Base):
    __tablename__ = 'event_participants'

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)


