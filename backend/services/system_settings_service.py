from sqlmodel import Session
from models.system_settings_model import SystemSettings
from repositories.system_settings_repository import get_system_settings, create_system_settings, update_system_settings
from schemas.system_settings_schema import SystemSettingsUpdate, SystemSettingsRead
from fastapi import HTTPException
from typing import Optional

def get_settings(session: Session) -> SystemSettingsRead:
    settings = get_system_settings(session)
    if not settings:
        # Kreiraj default postavke ako ne postoje
        settings = create_system_settings(session)
    
    return SystemSettingsRead(
        id=settings.id,
        allow_registration=settings.allow_registration,
        require_approval=settings.require_approval,
        email_notifications=settings.email_notifications,
        maintenance_mode=settings.maintenance_mode,
        auto_assignment=settings.auto_assignment,
        created_at=settings.created_at,
        updated_at=settings.updated_at
    )

def update_settings(session: Session, data: SystemSettingsUpdate, admin_id: int) -> SystemSettingsRead:
    # Provjera da li je korisnik admin
    from models.user_model import User
    from models.role_model import Role
    
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu mijenjati sistemske postavke.")
    
    # Ažuriranje postavki
    updated_settings = update_system_settings(
        session,
        allow_registration=data.allow_registration,
        require_approval=data.require_approval,
        email_notifications=data.email_notifications,
        maintenance_mode=data.maintenance_mode,
        auto_assignment=data.auto_assignment
    )
    
    return SystemSettingsRead(
        id=updated_settings.id,
        allow_registration=updated_settings.allow_registration,
        require_approval=updated_settings.require_approval,
        email_notifications=updated_settings.email_notifications,
        maintenance_mode=updated_settings.maintenance_mode,
        auto_assignment=updated_settings.auto_assignment,
        created_at=updated_settings.created_at,
        updated_at=updated_settings.updated_at
    )
