from fastapi import APIRouter, Depends, status, Request, HTTPException
from sqlmodel import Session
from database import engine
from services.assignment_notification_service import (
    get_contractor_assignment_notifications, 
    mark_assignment_notification_read, 
    mark_all_assignment_notifications_read,
    create_new_assignment_notification
)
from schemas.assignment_notification_schema import AssignmentNotificationCreate, AssignmentNotificationRead
from typing import List
import jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"

def get_session():
    with Session(engine) as session:
        yield session

def get_current_user_id(request: Request) -> int:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Nedostaje token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Neispravan token")
        return int(user_id)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Neispravan token")

@router.get("/api/contractor/assignment-notifications", response_model=List[AssignmentNotificationRead])
def get_assignment_notifications(request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return get_contractor_assignment_notifications(session, user_id)

@router.patch("/api/contractor/assignment-notifications/{notification_id}/read", response_model=AssignmentNotificationRead)
def mark_assignment_notification_as_read(notification_id: int, request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return mark_assignment_notification_read(session, notification_id, user_id)

@router.patch("/api/contractor/assignment-notifications/read-all", response_model=List[AssignmentNotificationRead])
def mark_all_assignment_notifications_as_read(request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return mark_all_assignment_notifications_read(session, user_id)

@router.post("/api/contractor/assignment-notifications", response_model=AssignmentNotificationRead, status_code=status.HTTP_201_CREATED)
def create_assignment_notification(data: AssignmentNotificationCreate, session: Session = Depends(get_session)):
    return create_new_assignment_notification(session, data)
