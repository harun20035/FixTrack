from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Assignment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    issue_id: int = Field(foreign_key="issue.id")
    contractor_id: int = Field(foreign_key="user.id")
    status: str = Field(default="Primljeno", max_length=50)
    estimated_cost: Optional[float] = None
    planned_date: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    issue: Optional["Issue"] = Relationship(back_populates="assignments")
    contractor: Optional["User"] = Relationship()
    images: List["AssignmentImage"] = Relationship(back_populates="assignment")
    documents: List["AssignmentDocument"] = Relationship(back_populates="assignment") 