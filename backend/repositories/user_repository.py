from sqlmodel import Session, select
from models import User
from typing import Optional

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def create_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).first()

def update_user(session: Session, user: User, **kwargs) -> User:
    for key, value in kwargs.items():
        setattr(user, key, value)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user 