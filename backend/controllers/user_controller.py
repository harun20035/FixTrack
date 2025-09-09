from fastapi import APIRouter, Depends, status, Request, HTTPException
from sqlmodel import Session
from database import engine
from schemas.user_schema import UserRegister, UserLogin, UserRead, UserProfileRead, UserProfileUpdate
from services import user_service
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

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, session: Session = Depends(get_session)):
    user = user_service.register_user(session, user_data.full_name, user_data.email, user_data.password)
    # Generiraj token nakon registracije
    token = user_service.authenticate_user(session, user_data.email, user_data.password)
    return {"auth_token": token, "token_type": "bearer", "user": user}

@router.post("/login")
def login(user_data: UserLogin, session: Session = Depends(get_session)):
    token = user_service.authenticate_user(session, user_data.email, user_data.password)
    return {"auth_token": token, "token_type": "bearer"}

@router.get("/profile", response_model=UserProfileRead)
def get_profile(request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    user = user_service.get_profile(session, user_id)
    return user

@router.put("/profile", response_model=UserProfileRead)
def update_profile(data: UserProfileUpdate, request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    user = user_service.update_profile(session, user_id, data)
    return user 