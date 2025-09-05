from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from models.role_request_model import RoleRequest
from models.user_model import User
from models.role_model import Role
from typing import List, Optional
from datetime import datetime

def create_role_request(session: Session, user_id: int, current_role_id: int, requested_role_id: int, motivation: str) -> RoleRequest:
    role_request = RoleRequest(
        user_id=user_id,
        current_role_id=current_role_id,
        requested_role_id=requested_role_id,
        motivation=motivation
    )
    session.add(role_request)
    session.commit()
    session.refresh(role_request)
    return role_request

def get_role_requests(session: Session, status: Optional[str] = None) -> List[RoleRequest]:
    statement = select(RoleRequest).options(
        selectinload(RoleRequest.user)
    )
    
    if status:
        statement = statement.where(RoleRequest.status == status)
    
    return session.exec(statement.order_by(RoleRequest.created_at.desc())).all()

def get_role_request_by_id(session: Session, request_id: int) -> Optional[RoleRequest]:
    return session.get(RoleRequest, request_id)

def update_role_request_status(session: Session, request_id: int, status: str, admin_notes: Optional[str] = None) -> Optional[RoleRequest]:
    role_request = session.get(RoleRequest, request_id)
    if role_request:
        role_request.status = status
        if admin_notes:
            role_request.admin_notes = admin_notes
        role_request.updated_at = datetime.utcnow()
        session.commit()
        session.refresh(role_request)
    return role_request

def get_user_role_requests(session: Session, user_id: int) -> List[RoleRequest]:
    statement = select(RoleRequest).where(RoleRequest.user_id == user_id).options(
        selectinload(RoleRequest.user)
    )
    return session.exec(statement.order_by(RoleRequest.created_at.desc())).all()
