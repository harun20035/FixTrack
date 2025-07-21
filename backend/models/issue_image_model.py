from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class IssueImage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    issue_id: int = Field(foreign_key="issue.id")
    image_url: str

    issue: Optional["Issue"] = Relationship(back_populates="images") 