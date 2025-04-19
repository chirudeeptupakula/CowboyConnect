from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_user

router = APIRouter(prefix="/events", tags=["Events"])

# ✅ Faculty creates an event
@router.post("/create")
def create_event(
        event: schemas.EventCreate,
        db: Session = Depends(get_db),
        user: models.User = Depends(get_current_user)
):
    if user.role.value != "faculty":
        raise HTTPException(status_code=403, detail="Only faculty can create events")

    new_event = models.Event(**event.dict(), created_by=user.id)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

# ✅ Students (or anyone) can view all available events
@router.get("/available", response_model=list[schemas.EventOut])
def get_all_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

# ✅ Student registers for an event
@router.post("/register/{event_id}")
def register_for_event(
        event_id: int,
        db: Session = Depends(get_db),
        user: models.User = Depends(get_current_user)
):
    if user.role.value != "student":
        raise HTTPException(status_code=403, detail="Only students can register for events")

    existing = db.query(models.EventParticipant).filter_by(
        student_id=user.id,
        event_id=event_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")

    new_registration = models.EventParticipant(event_id=event_id, student_id=user.id)
    db.add(new_registration)
    db.commit()
    return {"message": "Successfully joined the event!"}

# ✅ Student views their joined events
@router.get("/my-joined", response_model=list[schemas.EventOut])
def get_joined_events(
        db: Session = Depends(get_db),
        user: models.User = Depends(get_current_user)
):
    if user.role.value != "student":
        raise HTTPException(status_code=403, detail="Only students can access their events")

    joined_event_ids = db.query(models.EventParticipant.event_id).filter_by(student_id=user.id).subquery()
    events = db.query(models.Event).filter(models.Event.id.in_(joined_event_ids)).all()
    return events
