from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class AssignmentCreate(BaseModel):
    issue_id: int
    contractor_id: int
    status: str = "Dodijeljeno"
    estimated_cost: Optional[float] = None
    planned_date: Optional[datetime] = None

class AssignmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    actual_cost: Optional[float] = None
    planned_date: Optional[datetime] = None

class AssignmentReject(BaseModel):
    rejection_reason: str

class AssignmentRead(BaseModel):
    id: int
    issue_id: int
    contractor_id: int
    status: str
    estimated_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    planned_date: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AssignmentWithIssue(BaseModel):
    id: int
    issue_id: int
    contractor_id: int
    status: str
    estimated_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    planned_date: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    issue: dict  # Issue details
    tenant: dict  # Tenant details

    class Config:
        from_attributes = True

class AssignmentImageCreate(BaseModel):
    assignment_id: int
    image_url: str

class AssignmentImageRead(BaseModel):
    id: int
    assignment_id: int
    image_url: str

    class Config:
        from_attributes = True

class AssignmentDocumentCreate(BaseModel):
    assignment_id: int
    document_url: str
    type: str

class AssignmentDocumentRead(BaseModel):
    id: int
    assignment_id: int
    document_url: str
    type: str

    class Config:
        from_attributes = True 