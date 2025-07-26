from sqlmodel import Session, select, delete, func
from sqlalchemy.orm import selectinload
from models import Issue, IssueImage, IssueCategory, Comment, Rating, Assignment, Survey, AssignmentImage, AssignmentDocument
from typing import List, Optional, Dict
from schemas.issue_schema import HistoryStats

def create_issue(session: Session, issue: Issue) -> Issue:
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return issue

def add_issue_image(session: Session, image: IssueImage) -> IssueImage:
    session.add(image)
    session.commit()
    session.refresh(image)
    return image

def get_issue_categories(session: Session) -> List[IssueCategory]:
    statement = select(IssueCategory)
    return list(session.exec(statement))

def get_issues_for_user(session: Session, user_id: int, filters: Dict = {}) -> List[Issue]:
    statement = select(Issue).where(Issue.tenant_id == user_id)
    if filters.get("status"):
        statement = statement.where(Issue.status == filters["status"])
    if filters.get("category"):
        statement = statement.join(Issue.category).where(IssueCategory.name == filters["category"])
    if filters.get("search"):
        search = f"%{filters['search']}%"
        statement = statement.where(
            (Issue.title.ilike(search)) |
            (Issue.description.ilike(search)) |
            (Issue.location.ilike(search))
        )
    return list(session.exec(statement))

def update_issue_status(session: Session, issue_id: int, new_status: str) -> Issue:
    issue = session.get(Issue, issue_id)
    if not issue:
        return None
    issue.status = new_status
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return issue

def update_issue(session: Session, issue: Issue, **kwargs) -> Issue:
    for key, value in kwargs.items():
        setattr(issue, key, value)
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return issue

def delete_issue(session: Session, issue: Issue) -> None:
    # Delete related images
    session.exec(delete(IssueImage).where(IssueImage.issue_id == issue.id))
    # Delete related comments
    session.exec(delete(Comment).where(Comment.issue_id == issue.id))
    # Delete related ratings
    session.exec(delete(Rating).where(Rating.issue_id == issue.id))
    # Delete related surveys
    session.exec(delete(Survey).where(Survey.issue_id == issue.id))
    # Delete related assignments and their images/documents
    assignments = list(session.exec(select(Assignment).where(Assignment.issue_id == issue.id)))
    for assignment in assignments:
        session.exec(delete(AssignmentImage).where(AssignmentImage.assignment_id == assignment.id))
        session.exec(delete(AssignmentDocument).where(AssignmentDocument.assignment_id == assignment.id))
        session.delete(assignment)
    session.delete(issue)
    session.commit()

def get_user_issue_history(
    session: Session,
    user_id: int,
    filters: dict,
    page: int = 1,
    page_size: int = 10
):
    statement = select(Issue).where(Issue.tenant_id == user_id)
    if filters.get("search"):
        search = f"%{filters['search']}%"
        statement = statement.where(
            (Issue.title.ilike(search)) |
            (Issue.description.ilike(search)) |
            (Issue.location.ilike(search))
        )
    if filters.get("category"):
        statement = statement.join(Issue.category).where(IssueCategory.name == filters["category"])
    if filters.get("status"):
        statement = statement.where(Issue.status == filters["status"])
    if filters.get("date_from"):
        statement = statement.where(Issue.created_at >= filters["date_from"])
    if filters.get("date_to"):
        statement = statement.where(Issue.created_at <= filters["date_to"])
    # Sorting
    sort_by = filters.get("sort_by", "created_at_desc")
    if sort_by == "created_at_asc":
        statement = statement.order_by(Issue.created_at.asc())
    elif sort_by == "created_at_desc":
        statement = statement.order_by(Issue.created_at.desc())
    # Get all issues for total count
    all_issues = session.exec(statement).all()
    total = len(all_issues)
    # Pagination
    issues = all_issues[(page-1)*page_size:page*page_size]
    return issues, total

def get_user_issue_history_stats(session: Session, user_id: int):
    # Broj ukupnih prijava
    total_issues = session.exec(select(func.count(Issue.id)).where(Issue.tenant_id == user_id)).first()
    
    # Broj prijava po statusu
    status_counts = session.exec(
        select(Issue.status, func.count(Issue.id))
        .where(Issue.tenant_id == user_id)
        .group_by(Issue.status)
    ).all()
    
    # Prosječno vrijeme rješavanja (dani)
    resolved_issues = session.exec(
        select(Issue)
        .where(Issue.tenant_id == user_id, Issue.status == "Završeno")
    ).all()
    
    avg_resolution_time = 0
    if resolved_issues:
        total_days = 0
        for issue in resolved_issues:
            # Ovdje bi trebalo dodati logiku za računanje vremena rješavanja
            # Za sada koristimo fiksnu vrijednost
            total_days += 3  # Pretpostavljam prosječno 3 dana
        avg_resolution_time = total_days / len(resolved_issues)
    
    return {
        "total_issues": total_issues or 0,
        "status_counts": dict(status_counts),
        "avg_resolution_time": round(avg_resolution_time, 1)
    }

def get_issues_for_manager(session: Session, filters: dict, page: int = 1, page_size: int = 10):
    # Prvo dohvati issue IDs
    statement = select(Issue.id).where(Issue.status == "Primljeno")
    
    # Dodaj filtere
    if filters.get("search"):
        search = f"%{filters['search']}%"
        statement = statement.where(
            (Issue.title.ilike(search)) |
            (Issue.description.ilike(search)) |
            (Issue.location.ilike(search))
        )
    
    if filters.get("category"):
        statement = statement.join(Issue.category).where(IssueCategory.name == filters["category"])
    
    if filters.get("date_from"):
        statement = statement.where(Issue.created_at >= filters["date_from"])
    
    if filters.get("date_to"):
        statement = statement.where(Issue.created_at <= filters["date_to"])
    
    # Sorting
    sort_by = filters.get("sort_by", "created_at_desc")
    if sort_by == "created_at_asc":
        statement = statement.order_by(Issue.created_at.asc())
    elif sort_by == "created_at_desc":
        statement = statement.order_by(Issue.created_at.desc())
    elif sort_by == "title_asc":
        statement = statement.order_by(Issue.title.asc())
    elif sort_by == "title_desc":
        statement = statement.order_by(Issue.title.desc())
    
    # Pagination
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)
    
    # Dohvati samo ID-eve
    issue_ids = session.exec(statement).all()
    
    if not issue_ids:
        return []
    
    # Sada dohvati kompletne podatke sa relacijama
    full_statement = select(Issue).where(Issue.id.in_(issue_ids))
    full_statement = full_statement.options(
        selectinload(Issue.tenant),
        selectinload(Issue.category),
        selectinload(Issue.images)
    )
    
    # Zadrži isti sort order
    if sort_by == "created_at_asc":
        full_statement = full_statement.order_by(Issue.created_at.asc())
    elif sort_by == "created_at_desc":
        full_statement = full_statement.order_by(Issue.created_at.desc())
    elif sort_by == "title_asc":
        full_statement = full_statement.order_by(Issue.title.asc())
    elif sort_by == "title_desc":
        full_statement = full_statement.order_by(Issue.title.desc())
    
    issues = list(session.exec(full_statement))
    
    return issues 

def get_issues_for_manager_simple(session: Session, filters: dict, page: int = 1, page_size: int = 10):
    """Jednostavnija verzija koja direktno dohvata sve podatke"""
    statement = select(Issue).where(Issue.status == "Primljeno")
    
    # Dodaj relacije
    statement = statement.options(
        selectinload(Issue.tenant),
        selectinload(Issue.category),
        selectinload(Issue.images)
    )
    
    # Dodaj filtere
    if filters.get("search"):
        search = f"%{filters['search']}%"
        statement = statement.where(
            (Issue.title.ilike(search)) |
            (Issue.description.ilike(search)) |
            (Issue.location.ilike(search))
        )
    
    if filters.get("category"):
        statement = statement.join(Issue.category).where(IssueCategory.name == filters["category"])
    
    if filters.get("date_from"):
        statement = statement.where(Issue.created_at >= filters["date_from"])
    
    if filters.get("date_to"):
        statement = statement.where(Issue.created_at <= filters["date_to"])
    
    # Sorting
    sort_by = filters.get("sort_by", "created_at_desc")
    if sort_by == "created_at_asc":
        statement = statement.order_by(Issue.created_at.asc())
    elif sort_by == "created_at_desc":
        statement = statement.order_by(Issue.created_at.desc())
    elif sort_by == "title_asc":
        statement = statement.order_by(Issue.title.asc())
    elif sort_by == "title_desc":
        statement = statement.order_by(Issue.title.desc())
    
    # Pagination
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)
    
    issues = list(session.exec(statement))
    
    return issues 