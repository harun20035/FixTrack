from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    issue_id: int = Field(foreign_key="issue.id")
    user_id: int = Field(foreign_key="user.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    issue: Optional["Issue"] = Relationship(back_populates="comments")
    user: Optional["User"] = Relationship() 