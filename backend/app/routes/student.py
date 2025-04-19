from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app import models, schemas
from app.database import get_db
from app.models import User, ClubVolunteer, StudentTimesheet
from app.utils import get_user_from_header



router = APIRouter(prefix="/student", tags=["Student"])
#router = APIRouter(prefix="/volunteer", tags=["volunteer"])


# ✅ Public route: List all available courses
@router.get("/courses", response_model=list[schemas.CourseOut])
def list_all_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

# ✅ Protected route: Register for a course
@router.post("/register-course/{course_id}")
def register_for_course(course_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_user_from_header)):
    existing = db.query(models.StudentCourse).filter_by(student_id=user.id, course_id=course_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this course")

    new_registration = models.StudentCourse(student_id=user.id, course_id=course_id)
    db.add(new_registration)
    db.commit()
    return {"message": "Successfully registered for course"}

# ✅ View registered courses for current student
@router.get("/my-courses", response_model=list[schemas.CourseOut])
def get_my_courses(db: Session = Depends(get_db), user: models.User = Depends(get_user_from_header)):
    course_ids = db.query(models.StudentCourse.course_id).filter_by(student_id=user.id).all()
    course_ids = [cid[0] for cid in course_ids]
    return db.query(models.Course).filter(models.Course.id.in_(course_ids)).all()

# ✅ Clubs: List all clubs
@router.get("/clubs", response_model=list[schemas.ClubOut])
def get_all_clubs(db: Session = Depends(get_db)):
    return db.query(models.Club).all()

# ✅ Join a club
@router.post("/join-club")
def join_club(data: schemas.ClubJoin, db: Session = Depends(get_db), user: models.User = Depends(get_user_from_header)):
    existing = db.query(models.StudentClubMembership).filter_by(student_id=user.id, club_id=data.club_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already joined this club.")
    membership = models.StudentClubMembership(student_id=user.id, club_id=data.club_id)
    db.add(membership)
    db.commit()
    return {"message": "Joined club successfully."}

# ✅ View joined clubs
@router.get("/my-clubs", response_model=list[schemas.ClubOut])
def get_joined_clubs(db: Session = Depends(get_db), user: models.User = Depends(get_user_from_header)):
    memberships = db.query(models.StudentClubMembership).filter_by(student_id=user.id).all()
    club_ids = [m.club_id for m in memberships]
    return db.query(models.Club).filter(models.Club.id.in_(club_ids)).all()

# ✅ Log volunteer hours
@router.post("/log-hours")
def log_timesheet(entry: schemas.TimesheetLog, db: Session = Depends(get_db), user: models.User = Depends(get_user_from_header)):
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
def get_my_hours(db: Session = Depends(get_db), user: models.User = Depends(get_user_from_header)):
    return db.query(models.StudentTimesheet).filter_by(student_id=user.id).all()

# ✅ Test endpoint
@router.get("/data")
def get_student_data():
    return {"message": "Hello from Student Route"}

@router.post("/clubs/{club_id}/volunteer")
def register_as_volunteer(club_id: int, current_user: User = Depends(get_user_from_header), db: Session = Depends(get_db)):
    existing = db.query(ClubVolunteer).filter_by(student_id=current_user.id, club_id=club_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a volunteer")
    volunteer = ClubVolunteer(student_id=current_user.id, club_id=club_id)
    db.add(volunteer)
    db.commit()
    return {"message": "Registered as volunteer"}
@router.post("/volunteer/clockin")
def clock_in(club_id: int, description: str = "", current_user: User = Depends(get_user_from_header), db: Session = Depends(get_db)):
    sheet = StudentTimesheet(
        student_id=current_user.id,
        club_id=club_id,
        date=datetime.utcnow(),
        hours=0,
        description=description
    )
    db.add(sheet)
    db.commit()  # ✅ this must not be missing
    db.refresh(sheet)
    return {"timesheet_id": sheet.id, "clock_in": sheet.date}



@router.post("/volunteer/clockout")
def clock_out(timesheet_id: int, db: Session = Depends(get_db)):
    sheet = db.query(StudentTimesheet).get(timesheet_id)
    if not sheet:
        raise HTTPException(status_code=404, detail="Timesheet not found")
    if sheet.hours > 0:
        raise HTTPException(status_code=400, detail="Already clocked out")

    now = datetime.utcnow()
    sheet.hours = round((now - sheet.date).total_seconds() / 3600, 2)
    db.commit()

    return {
        "clock_out": now.isoformat(),  # ✅ Optional formatting
        "total_hours": sheet.hours     # ✅ Make sure this key exists
    }



@router.get("/check")
def check_volunteer(club_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_user_from_header)):
    exists = db.query(models.ClubVolunteer).filter_by(
        student_id=current_user.id,
        club_id=club_id
    ).first()
    return {"is_volunteer": bool(exists)}

@router.post("/clockin")
def clock_in(data: schemas.TimesheetClockIn, db: Session = Depends(get_db), current_user: models.User = Depends(get_user_from_header)):
    log = models.StudentTimesheet(
        student_id=current_user.id,
        club_id=data.club_id,
        date=datetime.utcnow(),
        hours=0.0,
        description=data.description
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"timesheet_id": log.id, "clock_in": log.date}

@router.post("/clockout")
def clock_out(data: schemas.TimesheetClockOut, db: Session = Depends(get_db), current_user: models.User = Depends(get_user_from_header)):
    log = db.query(models.StudentTimesheet).filter_by(id=data.timesheet_id, student_id=current_user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Timesheet not found.")
    if log.hours > 0:
        raise HTTPException(status_code=400, detail="Already clocked out.")

    now = datetime.utcnow()
    log.hours = round((now - log.date).total_seconds() / 3600, 2)
    db.commit()
    return {"clock_out": now, "total_hours": log.hours}


