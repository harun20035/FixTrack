from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssignmentNotificationCreate(BaseModel):
    contractor_id: int
    assignment_id: int
    issue_id: int
    notification_type: str
    assigned_by: str
    message: Optional[str] = None

class AssignmentNotificationRead(BaseModel):
    id: int
    assignmentId: int
    issueId: int
    issueTitle: str
    issueDescription: Optional[str] = None
    issueLocation: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    assignedBy: str
    assignedAt: str
    isRead: bool
    type: str
    message: Optional[str] = None

    class Config:
        from_attributes = True
