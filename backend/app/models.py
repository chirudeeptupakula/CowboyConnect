from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Float, Enum as SqlEnum
)
from sqlalchemy.orm import relationship
from app.database import Base
import enum

# -----------------------
# 📌 Enum Definitions
# -----------------------

class UserRole(enum.Enum):
    student = "student"
    faculty = "faculty"
    admin = "admin"

# -----------------------
# 👤 User Table
# -----------------------

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password = Column(String, nullable=False)  # hashed
    role = Column(SqlEnum(UserRole), nullable=False)
    department = Column(String, nullable=False)

    # Relationships
    created_courses = relationship("Course", back_populates="faculty", cascade="all, delete")
    registered_courses = relationship("CourseRegistration", back_populates="student", cascade="all, delete")
    joined_events = relationship("EventParticipant", back_populates="student", cascade="all, delete")
    club_memberships = relationship("StudentClubMembership", back_populates="student", cascade="all, delete")
    timesheets = relationship("StudentTimesheet", back_populates="student", cascade="all, delete")

# -----------------------
# 📘 Courses & Enrollment
# -----------------------

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    faculty = relationship("User", back_populates="created_courses")
    registrations = relationship("CourseRegistration", back_populates="course", cascade="all, delete")

class CourseRegistration(Base):
    __tablename__ = 'course_registrations'

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    registered_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="registered_courses")
    course = relationship("Course", back_populates="registrations")

# -----------------------
# 📅 Events & Participation
# -----------------------

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

    student = relationship("User", back_populates="joined_events")

# -----------------------
# 🏛️ Clubs & Membership
# -----------------------

class Club(Base):
    __tablename__ = 'clubs'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)

class StudentClubMembership(Base):
    __tablename__ = 'student_club_membership'

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    club_id = Column(Integer, ForeignKey("clubs.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="club_memberships")

# -----------------------
# ⏱️ Timesheet
# -----------------------

class StudentTimesheet(Base):
    __tablename__ = 'student_timesheet'

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    club_id = Column(Integer, ForeignKey("clubs.id"))
    date = Column(DateTime, default=datetime.utcnow)
    hours = Column(Float, nullable=False)
    description = Column(String)

    student = relationship("User", back_populates="timesheets")

class ClubVolunteer(Base):
    __tablename__ = 'club_volunteers'

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    club_id = Column(Integer, ForeignKey("clubs.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", backref="volunteer_clubs")



