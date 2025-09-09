from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class AssignmentNotification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    contractor_id: int = Field(foreign_key="user.id")
    assignment_id: int = Field(foreign_key="assignment.id")
    issue_id: int = Field(foreign_key="issue.id")
    notification_type: str = Field(max_length=50)  # "new_assignment", "assignment_update", "assignment_cancelled"
    assigned_by: str
    message: Optional[str] = None
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    contractor: Optional["User"] = Relationship()
    assignment: Optional["Assignment"] = Relationship()
    issue: Optional["Issue"] = Relationship()
