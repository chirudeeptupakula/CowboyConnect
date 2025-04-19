from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from app.routes.auth import get_current_user

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("/available")
def get_all_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

@router.post("/register/{event_id}")
def register_for_event(event_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role.value != "student":
        raise HTTPException(status_code=403, detail="Only students can register for events")

    existing = db.query(models.EventParticipant).filter_by(student_id=user.id, event_id=event_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")

    new_registration = models.EventParticipant(event_id=event_id, student_id=user.id)
    db.add(new_registration)
    db.commit()
    return {"message": "Successfully joined the event!"}

@router.get("/my-joined")
def get_joined_events(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role.value != "student":
        raise HTTPException(status_code=403, detail="Only students can access their events")

    # Join with Event table to return full event info
    joined_event_ids = db.query(models.EventParticipant.event_id).filter_by(student_id=user.id).subquery()
    events = db.query(models.Event).filter(models.Event.id.in_(joined_event_ids)).all()
    return events
