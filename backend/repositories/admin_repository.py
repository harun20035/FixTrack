from sqlmodel import Session, select, func
from sqlalchemy.orm import selectinload
from models.user_model import User
from models.role_model import Role
from typing import List, Optional, Dict
from datetime import datetime, timedelta

def get_all_users(session: Session, search: Optional[str] = None, role_id: Optional[int] = None) -> List[User]:
    statement = select(User).options(selectinload(User.role))
    
    if search:
        statement = statement.where(
            User.full_name.ilike(f"%{search}%") | 
            User.email.ilike(f"%{search}%")
        )
    
    if role_id:
        statement = statement.where(User.role_id == role_id)
    
    return session.exec(statement.order_by(User.created_at.desc())).all()

def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)

def update_user(session: Session, user_id: int, **kwargs) -> Optional[User]:
    user = session.get(User, user_id)
    if user:
        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        session.commit()
        session.refresh(user)
    return user

def delete_user(session: Session, user_id: int) -> bool:
    user = session.get(User, user_id)
    if user:
        session.delete(user)
        session.commit()
        return True
    return False

def get_user_stats(session: Session) -> Dict:
    # Total users
    total_users = session.exec(select(func.count(User.id))).first()
    
    # Users by role
    users_by_role = {}
    roles = session.exec(select(Role)).all()
    for role in roles:
        count = session.exec(select(func.count(User.id)).where(User.role_id == role.id)).first()
        users_by_role[role.name] = count
    
    # Recent registrations (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_registrations = session.exec(
        select(func.count(User.id)).where(User.created_at >= thirty_days_ago)
    ).first()
    
    return {
        "total_users": total_users,
        "users_by_role": users_by_role,
        "recent_registrations": recent_registrations
    }

def get_all_roles(session: Session) -> List[Role]:
    return session.exec(select(Role).order_by(Role.name)).all()

def create_role(session: Session, name: str) -> Role:
    role = Role(name=name)
    session.add(role)
    session.commit()
    session.refresh(role)
    return role

def update_role(session: Session, role_id: int, name: Optional[str] = None) -> Optional[Role]:
    role = session.get(Role, role_id)
    if role:
        if name is not None:
            role.name = name
        session.commit()
        session.refresh(role)
    return role

def delete_role(session: Session, role_id: int) -> bool:
    role = session.get(Role, role_id)
    if role:
        # Check if any users have this role
        user_count = session.exec(select(func.count(User.id)).where(User.role_id == role_id)).first()
        if user_count > 0:
            return False  # Cannot delete role that is assigned to users
        session.delete(role)
        session.commit()
        return True
    return False
