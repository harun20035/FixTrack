from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommentCreate(BaseModel):
    content: str

class CommentRead(BaseModel):
    id: int
    issue_id: int
    user_id: int
    content: str
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        orm_mode = True 