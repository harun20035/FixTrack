from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: int
    issue_id: int
    old_status: str
    new_status: str
    changed_by: str

class NotificationRead(BaseModel):
    id: int
    user_id: int
    issue_id: int
    old_status: str
    new_status: str
    changed_by: str
    is_read: bool
    created_at: datetime
    issue_title: Optional[str] = None

    class Config:
        orm_mode = True 