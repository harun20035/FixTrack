from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: int
    issue_id: Optional[int] = None
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    changed_by: str

class NotificationRead(BaseModel):
    id: int
    user_id: int
    issue_id: Optional[int] = None
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    changed_by: str
    is_read: bool
    created_at: datetime
    issue_title: Optional[str] = None

    class Config:
        orm_mode = True 