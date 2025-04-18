# ✅ backend/app/models.py (Additions only)

from sqlalchemy import DateTime, ForeignKey
from datetime import datetime

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


# ✅ backend/app/schemas.py

from pydantic import BaseModel

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


# ✅ backend/app/routes/faculty.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.database import get_db
from backend.app.utils import get_current_user

router = APIRouter(prefix="/faculty", tags=["faculty"])

@router.post("/add-course")
def add_course(course: schemas.CourseCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    new_course = models.Course(
        title=course.title,
        description=course.description,
        created_by=user.id
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return {"message": "Course added", "course": new_course}


@router.get("/my-courses", response_model=list[schemas.CourseOut])
def get_my_courses(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Course).filter(models.Course.created_by == user.id).all()


@router.delete("/delete-course/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id, models.Course.created_by == user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}


# ✅ Add router in backend/main.py

from backend.app.routes import faculty
...
app.include_router(faculty.router)

# ✅ Run this to create tables
# models.Base.metadata.create_all(bind=engine)

# ✅ Next Step: Create `FacultyCourseManager.jsx` React component on the frontend
