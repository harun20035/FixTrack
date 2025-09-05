from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class SystemSettings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    allow_registration: bool = Field(default=True)
    require_approval: bool = Field(default=True)
    email_notifications: bool = Field(default=True)
    maintenance_mode: bool = Field(default=False)
    auto_assignment: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
