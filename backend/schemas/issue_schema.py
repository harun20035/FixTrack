from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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