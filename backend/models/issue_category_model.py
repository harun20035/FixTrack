from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class IssueCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    issues: List["Issue"] = Relationship(back_populates="category") 