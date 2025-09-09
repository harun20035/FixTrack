from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Issue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int = Field(foreign_key="user.id")
    category_id: int = Field(foreign_key="issuecategory.id")
    title: str = Field(max_length=255)
    description: Optional[str] = None
    location: Optional[str] = None
    status: str = Field(default="Primljeno", max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tenant: Optional["User"] = Relationship()
    category: Optional["IssueCategory"] = Relationship(back_populates="issues")
    images: List["IssueImage"] = Relationship(back_populates="issue")
    comments: List["Comment"] = Relationship(back_populates="issue")
    notes: List["Notes"] = Relationship(back_populates="issue")
    ratings: List["Rating"] = Relationship(back_populates="issue")
    assignments: List["Assignment"] = Relationship(back_populates="issue") 
    notifications: List["Notification"] = Relationship(back_populates="issue") 