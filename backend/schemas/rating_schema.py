from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RatingCreate(BaseModel):
    score: int
    comment: Optional[str] = None

class RatingRead(BaseModel):
    id: int
    issue_id: int
    tenant_id: int
    score: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True 