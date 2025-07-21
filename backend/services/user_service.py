from passlib.context import CryptContext
from sqlmodel import Session
from models import User
from repositories.user_repository import UserRepository
from fastapi import HTTPException, status
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(session: Session, full_name: str, email: str, password: str) -> User:
    if UserRepository.get_by_email(session, email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email je već zauzet.")
    hashed_password = pwd_context.hash(password)
    user = User(full_name=full_name, email=email, password_hash=hashed_password, role_id=1)
    return UserRepository.create_user(session, user)

def authenticate_user(session: Session, email: str, password: str) -> str:
    user = UserRepository.get_by_email(session, email)
    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Pogrešan email ili lozinka.")
    token_data = {"sub": str(user.id), "email": user.email, "role_id": user.role_id}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return token 