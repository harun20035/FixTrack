from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Survey(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int = Field(foreign_key="user.id")
    issue_id: int = Field(foreign_key="issue.id")
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tenant: Optional["User"] = Relationship()
    issue: Optional["Issue"] = Relationship() 