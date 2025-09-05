from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SystemSettingsUpdate(BaseModel):
    allow_registration: Optional[bool] = None
    require_approval: Optional[bool] = None
    email_notifications: Optional[bool] = None
    maintenance_mode: Optional[bool] = None
    auto_assignment: Optional[bool] = None

class SystemSettingsRead(BaseModel):
    id: int
    allow_registration: bool
    require_approval: bool
    email_notifications: bool
    maintenance_mode: bool
    auto_assignment: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
