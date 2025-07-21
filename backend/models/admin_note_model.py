from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class AdminNote(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    admin_id: int = Field(foreign_key="user.id")
    tenant_id: int = Field(foreign_key="user.id")
    note: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    admin: Optional["User"] = Relationship()
    tenant: Optional["User"] = Relationship() 