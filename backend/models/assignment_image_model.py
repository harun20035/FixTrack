from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class AssignmentImage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assignment_id: int = Field(foreign_key="assignment.id")
    image_url: str

    assignment: Optional["Assignment"] = Relationship(back_populates="images") 