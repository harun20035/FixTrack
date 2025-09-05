from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RoleRequestCreate(BaseModel):
    requested_role_id: int
    motivation: str

class RoleRequestUpdate(BaseModel):
    status: str  # approved, rejected
    admin_notes: Optional[str] = None

class RoleRequestRead(BaseModel):
    id: int
    user_id: int
    current_role_id: int
    requested_role_id: int
    motivation: str
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # User info
    user_name: str
    user_email: str
    
    # Role info
    current_role_name: str
    requested_role_name: str

    class Config:
        from_attributes = True
