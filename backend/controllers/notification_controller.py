from fastapi import APIRouter, Depends, status, Request, HTTPException
from sqlmodel import Session
from database import engine
from services import notification_service
from schemas.notification_schema import NotificationCreate, NotificationRead
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
        raise HTTPException(status_code=401, detail="Nedostaje token.")
    token = auth_header.split()[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Neispravan token.")

@router.get("/notifications", response_model=List[NotificationRead])
def get_notifications(request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return notification_service.get_user_notifications(session, user_id)

@router.patch("/notifications/{notification_id}/read", response_model=NotificationRead)
def mark_as_read(notification_id: int, request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return notification_service.mark_notification_read(session, notification_id, user_id)

@router.patch("/notifications/read-all", response_model=List[NotificationRead])
def mark_all_as_read(request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return notification_service.mark_all_read(session, user_id)

@router.post("/notifications", response_model=NotificationRead, status_code=status.HTTP_201_CREATED)
def create_notification(data: NotificationCreate, session: Session = Depends(get_session)):
    return notification_service.create_new_notification(session, data) 