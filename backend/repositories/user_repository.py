from sqlmodel import Session, select
from models import User
from typing import Optional

class UserRepository:
    @staticmethod
    def get_by_email(session: Session, email: str) -> Optional[User]:
        statement = select(User).where(User.email == email)
        return session.exec(statement).first()

    @staticmethod
    def create_user(session: Session, user: User) -> User:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user 