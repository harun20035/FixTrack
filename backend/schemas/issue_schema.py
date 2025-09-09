from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

def to_camel(string: str) -> str:
    parts = string.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

class IssueImageRead(BaseModel):
    id: int
    issue_id: int
    image_url: str

class IssueCategoryRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class IssueCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    category_id: int

class IssueRead(BaseModel):
    id: int
    tenant_id: int
    category_id: int
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    status: str
    created_at: datetime
    images: List[IssueImageRead] = []
    category: Optional[IssueCategoryRead] = None

    class Config:
        from_attributes = True 

class IssueStatusUpdate(BaseModel):
    status: str

class IssueFilterParams(BaseModel):
    status: Optional[str] = None
    category: Optional[str] = None
    search: Optional[str] = None 

class HistoryIssue(BaseModel):
    id: int
    title: str
    description: str | None = None
    location: str | None = None
    status: str
    category: str
    createdAt: str
    completedAt: str | None = None
    assignedTo: str | None = None
    commentsCount: int
    rating: float | None = None

class HistoryStats(BaseModel):
    totalIssues: int
    completedIssues: int
    rejectedIssues: int
    inProgressIssues: int
    averageResolutionTime: float
    averageRating: float

    class Config:
        from_attributes = True

# Nova šema za upravnike koja uključuje relacije
class IssueForManager(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    status: str
    created_at: datetime
    tenant: Optional[dict] = None  # Koristimo dict umjesto UserRead
    category: Optional[IssueCategoryRead] = None
    images: List[IssueImageRead] = []

    class Config:
        from_attributes = True

class HistoryFilterParams(BaseModel):
    search: str | None = None
    category: str | None = None
    status: str | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None
    sort_by: str | None = None
    page: int = 1
    page_size: int = 10

class ContractorAssignmentRequest(BaseModel):
    contractor_id: int

class IssueNoteRequest(BaseModel):
    note: str 