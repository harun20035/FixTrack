from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    issue_id: int = Field(foreign_key="issue.id")
    old_status: str
    new_status: str
    changed_by: str
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship()
    issue: Optional["Issue"] = Relationship() 