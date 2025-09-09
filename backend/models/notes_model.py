from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Notes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    issue_id: int = Field(foreign_key="issue.id")
    user_id: int = Field(foreign_key="user.id")
    note: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    issue: Optional["Issue"] = Relationship(back_populates="notes")
    user: Optional["User"] = Relationship(back_populates="notes")
