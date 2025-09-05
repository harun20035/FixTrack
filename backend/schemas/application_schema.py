from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from fastapi import UploadFile

class ContractorApplicationCreate(BaseModel):
    motivation_letter: str
    reason_for_becoming_contractor: str
    accept_terms: bool

class ManagerApplicationCreate(BaseModel):
    motivation_letter: str
    management_experience: str
    building_management_plans: str
    accept_terms: bool
    accept_role_change: bool

class ApplicationResponse(BaseModel):
    success: bool
    message: str
    role_request_id: Optional[int] = None
    redirect_url: Optional[str] = None

class ApplicationStatus(BaseModel):
    has_pending_application: bool
    application_type: Optional[str] = None  # "contractor" or "manager"
    status: Optional[str] = None  # "pending", "approved", "rejected"
    submitted_at: Optional[datetime] = None
