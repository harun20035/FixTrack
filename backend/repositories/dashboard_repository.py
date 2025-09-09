from sqlmodel import Session, select, func, and_, or_, alias
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from models import Issue, User, Assignment, Rating, Role, IssueCategory

def get_tenant_dashboard_stats(session: Session, user_id: int) -> Dict:
    """Dohvaća statistike za tenant dashboard"""
    
    # Ukupno prijava korisnika
    total_issues = session.exec(
        select(func.count(Issue.id)).where(Issue.tenant_id == user_id)
    ).first() or 0
    
    # Prijave u toku (sve osim završenih i odbačenih)
    in_progress = session.exec(
        select(func.count(Issue.id)).where(
            and_(
                Issue.tenant_id == user_id,
                or_(
                    Issue.status == "Primljeno",
                    Issue.status == "Dodijeljeno", 
                    Issue.status == "U toku",
                    Issue.status == "Na lokaciji",
                    Issue.status == "Čeka dijelove"
                )
            )
        )
    ).first() or 0
    
    # Završene prijave
    completed = session.exec(
        select(func.count(Issue.id)).where(
            and_(
                Issue.tenant_id == user_id,
                Issue.status == "Završeno"
            )
        )
    ).first() or 0
    
    # Hitne prijave (visok prioritet)
    urgent = session.exec(
        select(func.count(Issue.id)).where(
            and_(
                Issue.tenant_id == user_id,
                Issue.status == "Završeno"  # Fallback jer Issue model nema priority polje
            )
        )
    ).first() or 0
    
    # Mjesečni cilj (završene prijave ovaj mjesec)
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_completed = session.exec(
        select(func.count(Issue.id)).where(
            and_(
                Issue.tenant_id == user_id,
                Issue.status == "Završeno",
                Issue.created_at >= current_month
            )
        )
    ).first() or 0
    
    # Mjesečni cilj je 10 prijava (može se konfigurirati)
    monthly_goal = 10
    monthly_goal_progress = (monthly_completed / monthly_goal * 100) if monthly_goal > 0 else 0
    
    # Prosječno vrijeme rješavanja (u danima)
    avg_resolution_time = 0
    if completed > 0:
        # Dohvati sve završene prijave sa vremenom rješavanja
        completed_issues = session.exec(
            select(Issue).where(
                and_(
                    Issue.tenant_id == user_id,
                    Issue.status == "Završeno",
                    Issue.created_at.isnot(None)
                )
            )
        ).all()
        
        if completed_issues:
            total_days = 0
            for issue in completed_issues:
                if issue.created_at:
                    days = (datetime.utcnow() - issue.created_at).days
                    total_days += days
            avg_resolution_time = total_days / len(completed_issues)
    
    # Prosječna ocjena zadovoljstva
    satisfaction_rating = 0
    ratings = session.exec(
        select(Rating).where(Rating.tenant_id == user_id)
    ).all()
    
    if ratings:
        total_rating = sum(rating.score for rating in ratings)
        satisfaction_rating = total_rating / len(ratings)
    
    return {
        "total_issues": total_issues,
        "in_progress": in_progress,
        "completed": completed,
        "urgent": urgent,
        "monthly_goal_progress": round(monthly_goal_progress, 1),
        "average_resolution_time": round(avg_resolution_time, 1),
        "satisfaction_rating": round(satisfaction_rating, 1)
    }

def get_tenant_recent_issues(session: Session, user_id: int, limit: int = 3) -> List[Dict]:
    """Dohvaća nedavne prijave za tenant dashboard"""
    
    issues = session.exec(
        select(Issue, Assignment, User)
        .outerjoin(Assignment, Assignment.issue_id == Issue.id)
        .outerjoin(User, User.id == Assignment.contractor_id)
        .where(Issue.tenant_id == user_id)
        .order_by(Issue.created_at.desc())
        .limit(limit)
    ).all()
    
    recent_issues = []
    for issue, assignment, contractor in issues:
        recent_issues.append({
            "id": issue.id,
            "title": issue.title,
            "status": issue.status,
            "date": issue.created_at.strftime("%d.%m.%Y"),
            "priority": "Srednji",  # Fallback jer Issue model nema priority polje
            "assignee": contractor.full_name if contractor else None
        })
    
    return recent_issues

def get_manager_dashboard_stats(session: Session, user_id: int) -> Dict:
    """Dohvaća statistike za manager dashboard"""
    
    # Ukupno prijava ovaj mjesec
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    total_issues = session.exec(
        select(func.count(Issue.id)).where(Issue.created_at >= current_month)
    ).first() or 0
    
    # Prijave koje čekaju dodjelu
    pending_assignment = session.exec(
        select(func.count(Issue.id)).where(Issue.status == "Primljeno")
    ).first() or 0
    
    # Prijave u toku
    in_progress = session.exec(
        select(func.count(Issue.id)).where(
            or_(
                Issue.status == "Dodijeljeno izvođaču",
                Issue.status == "Na lokaciji",
                Issue.status == "Popravka u toku",
                Issue.status == "Čeka dijelove"
            )
        )
    ).first() or 0
    
    # Završene prijave ovaj mjesec
    completed_this_month = session.exec(
        select(func.count(Issue.id)).where(
            and_(
                Issue.status == "Završeno",
                Issue.created_at >= current_month
            )
        )
    ).first() or 0
    
    # Prosječno vrijeme rješavanja
    avg_resolution_time = 0
    completed_issues = session.exec(
        select(Issue).where(
            and_(
                Issue.status == "Završeno",
                Issue.created_at.isnot(None),
                Issue.created_at >= current_month
            )
        )
    ).all()
    
    if completed_issues:
        total_days = 0
        for issue in completed_issues:
            if issue.created_at:
                days = (datetime.utcnow() - issue.created_at).days
                total_days += days
        avg_resolution_time = total_days / len(completed_issues)
    
    # Stopa uspješnosti (završene vs ukupne prijave ovaj mjesec)
    success_rate = 0
    if total_issues > 0:
        success_rate = (completed_this_month / total_issues) * 100
    
    return {
        "total_issues": total_issues,
        "pending_assignment": pending_assignment,
        "in_progress": in_progress,
        "completed_this_month": completed_this_month,
        "average_resolution_time": round(avg_resolution_time, 1),
        "success_rate": round(success_rate, 1)
    }

def get_manager_recent_issues(session: Session, limit: int = 4) -> List[Dict]:
    """Dohvaća nedavne prijave za manager dashboard"""
    
    # Pojednostavljen pristup - dohvati samo Issue objekte sa relationships
    issues = session.exec(
        select(Issue)
        .order_by(Issue.created_at.desc())
        .limit(limit)
    ).all()
    
    recent_issues = []
    for issue in issues:
        # Dohvati tenant informacije
        tenant = session.get(User, issue.tenant_id)
        
        # Dohvati category informacije
        category = session.get(IssueCategory, issue.category_id)
        
        # Dohvati assignment informacije
        assignment = session.exec(
            select(Assignment).where(Assignment.issue_id == issue.id)
        ).first()
        
        # Dohvati contractor informacije ako postoji assignment
        contractor = None
        if assignment:
            contractor = session.get(User, assignment.contractor_id)
        
        recent_issues.append({
            "id": issue.id,
            "title": issue.title,
            "description": issue.description or "",
            "location": issue.location or "",
            "status": issue.status,
            "category": category.name if category else "Nepoznato",
            "tenant": tenant.full_name if tenant else "Nepoznato",
            "assigned_to": contractor.full_name if contractor else None,
            "created_at": issue.created_at.isoformat(),
            "priority": "N/A"  # Issue model nema priority polje
        })
    
    return recent_issues

def get_contractor_dashboard_stats(session: Session, user_id: int) -> Dict:
    """Dohvaća statistike za contractor dashboard"""
    
    # Dodijeljene prijave
    assigned_issues = session.exec(
        select(func.count(Assignment.id)).where(Assignment.contractor_id == user_id)
    ).first() or 0
    
    # Prijave na lokaciji
    on_location = session.exec(
        select(func.count(Assignment.id))
        .join(Issue, Issue.id == Assignment.issue_id)
        .where(
            and_(
                Assignment.contractor_id == user_id,
                Issue.status == "Na lokaciji"
            )
        )
    ).first() or 0
    
    # Prijave u toku
    in_progress = session.exec(
        select(func.count(Assignment.id))
        .join(Issue, Issue.id == Assignment.issue_id)
        .where(
            and_(
                Assignment.contractor_id == user_id,
                or_(
                    Issue.status == "U toku",
                    Issue.status == "Čeka dijelove"
                )
            )
        )
    ).first() or 0
    
    # Završene prijave ovaj mjesec
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    completed_this_month = session.exec(
        select(func.count(Assignment.id))
        .join(Issue, Issue.id == Assignment.issue_id)
        .where(
            and_(
                Assignment.contractor_id == user_id,
                Issue.status == "Završeno",
                Issue.created_at >= current_month
            )
        )
    ).first() or 0
    
    # Prosječno vrijeme rješavanja
    avg_resolution_time = 0
    completed_assignments = session.exec(
        select(Assignment, Issue)
        .join(Issue, Issue.id == Assignment.issue_id)
        .where(
            and_(
                Assignment.contractor_id == user_id,
                Issue.status == "Završeno",
                Issue.created_at >= current_month
            )
        )
    ).all()
    
    if completed_assignments:
        total_days = 0
        for assignment, issue in completed_assignments:
            if issue.created_at and assignment.created_at:
                days = (datetime.utcnow() - assignment.created_at).days
                total_days += days
        avg_resolution_time = total_days / len(completed_assignments)
    
    # Mjesečna zarada (pretpostavka: 100 KM po završenoj prijavi)
    monthly_earnings = completed_this_month * 100
    
    return {
        "assigned_issues": assigned_issues,
        "on_location": on_location,
        "in_progress": in_progress,
        "completed_this_month": completed_this_month,
        "average_resolution_time": round(avg_resolution_time, 1),
        "monthly_earnings": monthly_earnings
    }

def get_contractor_assigned_issues(session: Session, user_id: int, limit: int = 3) -> List[Dict]:
    """Dohvaća dodijeljene prijave za contractor dashboard"""
    
    assignments = session.exec(
        select(Assignment, Issue, User)
        .join(Issue, Issue.id == Assignment.issue_id)
        .join(User, User.id == Issue.tenant_id)
        .where(Assignment.contractor_id == user_id)
        .order_by(Assignment.created_at.desc())
        .limit(limit)
    ).all()
    
    assigned_issues = []
    for assignment, issue, tenant in assignments:
        assigned_issues.append({
            "id": issue.id,
            "title": issue.title,
            "description": issue.description or "",
            "location": issue.location or "",
            "status": issue.status,
            "category": issue.category.name if issue.category else "Nepoznato",
            "assigned_at": assignment.created_at.isoformat(),
            "estimated_cost": assignment.estimated_cost,
            "planned_date": assignment.planned_date.isoformat() if assignment.planned_date else None,
            "priority": "Srednji"  # Fallback jer Issue model nema priority polje
        })
    
    return assigned_issues

def get_contractor_recent_activities(session: Session, user_id: int, limit: int = 5) -> List[Dict]:
    """Dohvaća nedavne aktivnosti za contractor dashboard"""
    
    # Dohvati nedavne promjene statusa izvođača
    assignments = session.exec(
        select(Assignment, Issue)
        .join(Issue, Issue.id == Assignment.issue_id)
        .where(Assignment.contractor_id == user_id)
        .order_by(Assignment.updated_at.desc())
        .limit(limit)
    ).all()
    
    activities = []
    for assignment, issue in assignments:
        # Kreiraj aktivnost na osnovu statusa
        if issue.status == "Završeno":
            activities.append({
                "id": issue.id,
                "type": "completed",
                "title": f"Popravka završena - {issue.title}",
                "description": f"Uspješno završena popravka u {issue.location or 'lokaciji'}",
                "timestamp": issue.created_at.isoformat() if issue.created_at else assignment.updated_at.isoformat(),
                "status": "Završeno",
                "amount": assignment.estimated_cost or 100
            })
        elif issue.status == "U toku":
            activities.append({
                "id": issue.id,
                "type": "started",
                "title": f"Početa popravka - {issue.title}",
                "description": f"Započeta popravka u {issue.location or 'lokaciji'}",
                "timestamp": assignment.updated_at.isoformat(),
                "status": "U toku"
            })
        elif issue.status == "Na lokaciji":
            activities.append({
                "id": issue.id,
                "type": "arrived",
                "title": f"Stigao na lokaciju - {issue.title}",
                "description": f"Stigao na adresu za popravku u {issue.location or 'lokaciji'}",
                "timestamp": assignment.updated_at.isoformat(),
                "status": "Na lokaciji"
            })
    
    return activities
