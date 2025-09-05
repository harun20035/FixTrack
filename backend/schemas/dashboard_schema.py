from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Tenant Dashboard Schemas
class TenantStats(BaseModel):
    total_issues: int
    in_progress: int
    completed: int
    urgent: int
    monthly_goal_progress: float
    average_resolution_time: float
    satisfaction_rating: float

class RecentIssue(BaseModel):
    id: int
    title: str
    status: str
    date: str
    priority: str
    assignee: Optional[str] = None

class TenantDashboardResponse(BaseModel):
    stats: TenantStats
    recent_issues: List[RecentIssue]

# Manager Dashboard Schemas
class ManagerStats(BaseModel):
    total_issues: int
    pending_assignment: int
    in_progress: int
    completed_this_month: int
    average_resolution_time: float
    success_rate: float

class ManagerIssue(BaseModel):
    id: int
    title: str
    description: str
    location: str
    status: str
    category: str
    tenant: str
    assigned_to: Optional[str] = None
    created_at: str
    priority: str

class ManagerDashboardResponse(BaseModel):
    stats: ManagerStats
    recent_issues: List[ManagerIssue]

# Contractor Dashboard Schemas
class ContractorStats(BaseModel):
    assigned_issues: int
    on_location: int
    in_progress: int
    completed_this_month: int
    average_resolution_time: float
    monthly_earnings: float

class ContractorIssue(BaseModel):
    id: int
    title: str
    description: str
    location: str
    status: str
    category: str
    assigned_at: str
    estimated_cost: Optional[float] = None
    planned_date: Optional[str] = None
    priority: str

class ContractorActivity(BaseModel):
    id: int
    type: str
    title: str
    description: str
    timestamp: str
    status: Optional[str] = None
    amount: Optional[float] = None

class ContractorDashboardResponse(BaseModel):
    stats: ContractorStats
    assigned_issues: List[ContractorIssue]
    recent_activities: List[ContractorActivity]
