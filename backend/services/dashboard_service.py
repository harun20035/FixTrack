from sqlmodel import Session
from repositories.dashboard_repository import (
    get_tenant_dashboard_stats,
    get_tenant_recent_issues,
    get_manager_dashboard_stats,
    get_manager_recent_issues,
    get_contractor_dashboard_stats,
    get_contractor_assigned_issues,
    get_contractor_recent_activities
)
from schemas.dashboard_schema import (
    TenantDashboardResponse,
    TenantStats,
    RecentIssue,
    ManagerDashboardResponse,
    ManagerStats,
    ManagerIssue,
    ContractorDashboardResponse,
    ContractorStats,
    ContractorIssue,
    ContractorActivity
)
from fastapi import HTTPException
from models import User, Role

def get_tenant_dashboard_data(session: Session, user_id: int) -> TenantDashboardResponse:
    """Dohvaća sve podatke za tenant dashboard"""
    
    # Provjera da li korisnik postoji
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li je korisnik tenant
    role = session.get(Role, user.role_id)
    if not role or "stanar" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo stanari mogu pristupiti tenant dashboard-u.")
    
    # Dohvati statistike
    stats_data = get_tenant_dashboard_stats(session, user_id)
    stats = TenantStats(**stats_data)
    
    # Dohvati nedavne prijave
    recent_issues_data = get_tenant_recent_issues(session, user_id)
    recent_issues = [RecentIssue(**issue) for issue in recent_issues_data]
    
    return TenantDashboardResponse(
        stats=stats,
        recent_issues=recent_issues
    )

def get_manager_dashboard_data(session: Session, user_id: int) -> ManagerDashboardResponse:
    """Dohvaća sve podatke za manager dashboard"""
    
    # Provjera da li korisnik postoji
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li je korisnik manager
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu pristupiti manager dashboard-u.")
    
    # Dohvati statistike
    stats_data = get_manager_dashboard_stats(session, user_id)
    stats = ManagerStats(**stats_data)
    
    # Dohvati nedavne prijave
    recent_issues_data = get_manager_recent_issues(session)
    recent_issues = [ManagerIssue(**issue) for issue in recent_issues_data]
    
    return ManagerDashboardResponse(
        stats=stats,
        recent_issues=recent_issues
    )

def get_contractor_dashboard_data(session: Session, user_id: int) -> ContractorDashboardResponse:
    """Dohvaća sve podatke za contractor dashboard"""
    
    # Provjera da li korisnik postoji
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li je korisnik contractor
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu pristupiti contractor dashboard-u.")
    
    # Dohvati statistike
    stats_data = get_contractor_dashboard_stats(session, user_id)
    stats = ContractorStats(**stats_data)
    
    # Dohvati dodijeljene prijave
    assigned_issues_data = get_contractor_assigned_issues(session, user_id)
    assigned_issues = [ContractorIssue(**issue) for issue in assigned_issues_data]
    
    # Dohvati nedavne aktivnosti
    recent_activities_data = get_contractor_recent_activities(session, user_id)
    recent_activities = [ContractorActivity(**activity) for activity in recent_activities_data]
    
    return ContractorDashboardResponse(
        stats=stats,
        assigned_issues=assigned_issues,
        recent_activities=recent_activities
    )
