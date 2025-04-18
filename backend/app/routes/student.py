from app import models, schemas
from app.utils import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Club, StudentClubMembership, StudentTimesheet, User
from app.schemas import ClubJoin, ClubOut, TimesheetLog, TimesheetOut
from app.utils import get_user_from_header
router = APIRouter(prefix="/student", tags=["student"])

# ✅ 1. Public route: List all available courses
@router.get("/courses", response_model=list[schemas.CourseOut])
def list_all_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

# ✅ 2. Protected route: Register for a course
@router.post("/register-course/{course_id}")
def register_for_course(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Check if already registered
    existing = db.query(models.StudentCourse).filter_by(student_id=current_user.id, course_id=course_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this course")

    new_registration = models.StudentCourse(student_id=current_user.id, course_id=course_id)
    db.add(new_registration)
    db.commit()
    return {"message": "Successfully registered for course"}

# ✅ 3. Optional: View registered courses for current student
@router.get("/my-courses", response_model=list[schemas.CourseOut])
def get_my_courses(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Find course_ids the student is registered for
    course_ids = db.query(models.StudentCourse.course_id).filter_by(student_id=current_user.id).all()
    course_ids = [cid[0] for cid in course_ids]

    return db.query(models.Course).filter(models.Course.id.in_(course_ids)).all()

# ✅ 4. Base test route
@router.get("/data")
def get_student_data():
    return {"message": "Hello from Student Route"}

router = APIRouter(prefix="/student", tags=["student"])

@router.get("/clubs", response_model=list[ClubOut])
def get_all_clubs(db: Session = Depends(get_db)):
    return db.query(Club).all()

@router.post("/join-club")
def join_club(data: ClubJoin, db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    existing = db.query(StudentClubMembership).filter_by(student_id=user.id, club_id=data.club_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already joined this club.")
    membership = StudentClubMembership(student_id=user.id, club_id=data.club_id)
    db.add(membership)
    db.commit()
    return {"message": "Joined club successfully."}

@router.get("/my-clubs", response_model=list[ClubOut])
def get_joined_clubs(db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    memberships = db.query(StudentClubMembership).filter_by(student_id=user.id).all()
    club_ids = [m.club_id for m in memberships]
    clubs = db.query(Club).filter(Club.id.in_(club_ids)).all()
    return clubs

@router.post("/log-hours")
def log_timesheet(entry: TimesheetLog, db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    log = StudentTimesheet(
        student_id=user.id,
        club_id=entry.club_id,
        hours=entry.hours,
        description=entry.description
    )
    db.add(log)
    db.commit()
    return {"message": "Hours logged successfully."}

@router.get("/my-hours", response_model=list[TimesheetOut])
def get_my_hours(db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    return db.query(StudentTimesheet).filter_by(student_id=user.id).all()