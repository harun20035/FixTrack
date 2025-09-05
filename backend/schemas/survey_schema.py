from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SurveyCreate(BaseModel):
    satisfaction_level: str
    issue_category: str
    description: str
    suggestions: Optional[str] = None
    contact_preference: str = "no"

class SurveyRead(BaseModel):
    id: int
    tenant_id: int
    issue_id: Optional[int] = None
    satisfaction_level: str
    issue_category: str
    description: str
    suggestions: Optional[str] = None
    contact_preference: str
    created_at: datetime

class SurveyResponse(BaseModel):
    message: str
    survey_id: int
