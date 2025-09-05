from sqlmodel import Session, select
from models.system_settings_model import SystemSettings
from typing import Optional

def get_system_settings(session: Session) -> Optional[SystemSettings]:
    statement = select(SystemSettings).limit(1)
    return session.exec(statement).first()

def create_system_settings(session: Session) -> SystemSettings:
    settings = SystemSettings()
    session.add(settings)
    session.commit()
    session.refresh(settings)
    return settings

def update_system_settings(session: Session, **kwargs) -> Optional[SystemSettings]:
    settings = get_system_settings(session)
    if not settings:
        settings = create_system_settings(session)
    
    for key, value in kwargs.items():
        if hasattr(settings, key) and value is not None:
            setattr(settings, key, value)
    
    session.commit()
    session.refresh(settings)
    return settings
