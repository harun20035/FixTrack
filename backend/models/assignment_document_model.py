from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class AssignmentDocument(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assignment_id: int = Field(foreign_key="assignment.id")
    document_url: str
    type: Optional[str] = Field(default=None, max_length=50)

    assignment: Optional["Assignment"] = Relationship(back_populates="documents") 