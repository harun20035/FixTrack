from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Rating(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    issue_id: int = Field(foreign_key="issue.id")
    tenant_id: int = Field(foreign_key="user.id")
    score: int
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    issue: Optional["Issue"] = Relationship(back_populates="ratings")
    tenant: Optional["User"] = Relationship() 