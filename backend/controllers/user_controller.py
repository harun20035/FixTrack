from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from database import get_session
from schemas.user_schema import UserRegister, UserLogin, UserRead
from services import user_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, session: Session = Depends(get_session)):
    user = user_service.register_user(session, user_data.full_name, user_data.email, user_data.password)
    return user

@router.post("/login")
def login(user_data: UserLogin, session: Session = Depends(get_session)):
    token = user_service.authenticate_user(session, user_data.email, user_data.password)
    return {"access_token": token, "token_type": "bearer"} 