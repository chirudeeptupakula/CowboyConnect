from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_user  # ✅ Updated import

router = APIRouter(prefix="/student", tags=["Student"])

# ✅ Public route: List all available courses
@router.get("/courses", response_model=list[schemas.CourseOut])
def list_all_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

# ✅ Protected route: Register for a course
@router.post("/register-course/{course_id}")
def register_for_course(course_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    existing = db.query(models.StudentCourse).filter_by(student_id=user.id, course_id=course_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this course")

    new_registration = models.StudentCourse(student_id=user.id, course_id=course_id)
    db.add(new_registration)
    db.commit()
    return {"message": "Successfully registered for course"}

# ✅ View registered courses for current student
@router.get("/my-courses", response_model=list[schemas.CourseOut])
def get_my_courses(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    course_ids = db.query(models.StudentCourse.course_id).filter_by(student_id=user.id).all()
    course_ids = [cid[0] for cid in course_ids]
    return db.query(models.Course).filter(models.Course.id.in_(course_ids)).all()

# ✅ Clubs: List all clubs
@router.get("/clubs", response_model=list[schemas.ClubOut])
def get_all_clubs(db: Session = Depends(get_db)):
    return db.query(models.Club).all()

# ✅ Join a club
@router.post("/join-club")
def join_club(data: schemas.ClubJoin, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    existing = db.query(models.StudentClubMembership).filter_by(student_id=user.id, club_id=data.club_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already joined this club.")
    membership = models.StudentClubMembership(student_id=user.id, club_id=data.club_id)
    db.add(membership)
    db.commit()
    return {"message": "Joined club successfully."}

# ✅ View joined clubs
@router.get("/my-clubs", response_model=list[schemas.ClubOut])
def get_joined_clubs(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    memberships = db.query(models.StudentClubMembership).filter_by(student_id=user.id).all()
    club_ids = [m.club_id for m in memberships]
    return db.query(models.Club).filter(models.Club.id.in_(club_ids)).all()

# ✅ Log volunteer hours
@router.post("/log-hours")
def log_timesheet(entry: schemas.TimesheetLog, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    log = models.StudentTimesheet(
        student_id=user.id,
        club_id=entry.club_id,
        hours=entry.hours,
        description=entry.description
    )
    db.add(log)
    db.commit()
    return {"message": "Hours logged successfully."}

# ✅ View logged hours
@router.get("/my-hours", response_model=list[schemas.TimesheetOut])
def get_my_hours(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.StudentTimesheet).filter_by(student_id=user.id).all()

# ✅ Test endpoint
@router.get("/data")
def get_student_data():
    return {"message": "Hello from Student Route"}
