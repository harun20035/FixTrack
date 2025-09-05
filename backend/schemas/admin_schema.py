from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserRead(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    role_id: int
    role_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    role_id: Optional[int] = None

class UserStats(BaseModel):
    total_users: int
    active_users: int
    users_by_role: dict
    recent_registrations: int
