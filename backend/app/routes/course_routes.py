from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_user

router = APIRouter(prefix="/courses", tags=["Courses"])

# ✅ Faculty creates a course
@router.post("/create")
def create_course(
        course: schemas.CourseCreate,
        db: Session = Depends(get_db),
        user: models.User = Depends(get_current_user)
):
    if user.role.value != "faculty":
        raise HTTPException(status_code=403, detail="Only faculty can create courses")

    new_course = models.Course(**course.dict(), created_by=user.id)
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

# ✅ Students view all available courses
@router.get("/available", response_model=list[schemas.CourseOut])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

# ✅ Student registers for a course
@router.post("/register/{course_id}")
def register_for_course(
        course_id: int,
        db: Session = Depends(get_db),
        user: models.User = Depends(get_current_user)
):
    if user.role.value != "student":
        raise HTTPException(status_code=403, detail="Only students can register for courses")

    existing = db.query(models.CourseRegistration).filter_by(
        student_id=user.id,
        course_id=course_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this course")

    registration = models.CourseRegistration(student_id=user.id, course_id=course_id)
    db.add(registration)
    db.commit()
    return {"message": "Successfully registered for the course"}
