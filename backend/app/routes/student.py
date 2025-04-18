from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.database import get_db
from backend.app.utils import get_current_user

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
