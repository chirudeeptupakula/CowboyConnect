from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app import schemas, models
from app.utils import get_user_from_header

router = APIRouter(prefix="/faculty", tags=["faculty"])

def debug_user(user: User):
    if user is None:
        print("❌ User is None — check username header")
    else:
        print(f"✅ Authenticated user: {user.username}, ID: {user.id}, Role: {user.role}")

@router.get("/students")
def get_all_students(db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    debug_user(user)
    if user.role != "faculty":
        raise HTTPException(status_code=403, detail="Access denied")
    students = db.query(User).filter(User.role == "student").all()
    return students

@router.post("/add-course")
def add_course(course: schemas.CourseCreate, db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    debug_user(user)
    new_course = models.Course(
        title=course.title,
        description=course.description,
        created_by=user.id
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return {"message": "Course added", "course": new_course}

@router.get("/my-courses")
def get_my_courses(db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    debug_user(user)
    return db.query(models.Course).filter(models.Course.created_by == user.id).all()

@router.delete("/delete-course/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    debug_user(user)
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.created_by == user.id
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}

@router.post("/add-event")
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    debug_user(user)
    new_event = models.Event(
        title=event.title,
        description=event.description,
        location=event.location,
        date=event.date,
        created_by=user.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return {"message": "Event created", "event": new_event}

@router.get("/my-events", response_model=list[schemas.EventOut])
def list_events(db: Session = Depends(get_db), user: User = Depends(get_user_from_header)):
    debug_user(user)
    return db.query(models.Event).filter(models.Event.created_by == user.id).all()
