from passlib.context import CryptContext
from sqlmodel import Session
from models import User
from repositories.user_repository import get_user_by_email, create_user, get_user_by_id, update_user
from fastapi import HTTPException, status
import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(session: Session, full_name: str, email: str, password: str) -> User:
    if get_user_by_email(session, email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email je već zauzet.")
    hashed_password = pwd_context.hash(password)
    user = User(full_name=full_name, email=email, password_hash=hashed_password, role_id=1)
    return create_user(session, user)

def authenticate_user(session: Session, email: str, password: str) -> str:
    user = get_user_by_email(session, email)
    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Pogrešan email ili lozinka.")
    exp = int((datetime.utcnow() + timedelta(hours=1)).timestamp())
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role_id": user.role_id,
        "exp": exp
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return token

def get_profile(session: Session, user_id: int) -> User:
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Korisnik nije pronađen.")
    return user

def update_profile(session: Session, user_id: int, data) -> User:
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Korisnik nije pronađen.")
    # Provjera emaila ako se mijenja
    if data.email != user.email:
        if get_user_by_email(session, data.email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email je već zauzet.")
    update_fields = {
        "full_name": data.full_name,
        "email": data.email,
        "phone": data.phone,
        "address": data.address,
    }
    # Promjena lozinke
    if data.new_password:
        if not data.current_password or not pwd_context.verify(data.current_password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Trenutna lozinka nije ispravna.")
        if data.new_password != data.confirm_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nove lozinke se ne poklapaju.")
        update_fields["password_hash"] = pwd_context.hash(data.new_password)
    return update_user(session, user, **update_fields) 