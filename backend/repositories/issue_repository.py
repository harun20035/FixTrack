from sqlmodel import Session, select, delete, func
from sqlalchemy.orm import selectinload
from models import Issue, IssueImage, IssueCategory, Comment, Rating, Assignment, Survey, AssignmentImage, AssignmentDocument, User
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
    from sqlalchemy.orm import selectinload
    
    statement = select(Issue).options(
        selectinload(Issue.category),
        selectinload(Issue.assignments).selectinload(Assignment.contractor)
    ).where(Issue.tenant_id == user_id)
    
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
    elif sort_by == "status_created_desc":
        # Sortiraj po statusu (Završeno prvi), pa po datumu
        statement = statement.order_by(
            Issue.status.desc(),  # Završeno će biti prvi
            Issue.created_at.desc()
        )
    else:
        # Default sortiranje
        statement = statement.order_by(Issue.created_at.desc())
    # Get all issues for total count
    all_issues = session.exec(statement).all()
    total = len(all_issues)
    
    # Debug logging
    print(f"DEBUG REPO: User {user_id} has {total} total issues")
    print(f"DEBUG REPO: Page {page}, page_size {page_size}")
    print(f"DEBUG REPO: Issues IDs: {[issue.id for issue in all_issues]}")
    print(f"DEBUG REPO: Issues statuses: {[issue.status for issue in all_issues]}")
    print(f"DEBUG REPO: Filters applied: {filters}")
    
    # Specifičan debug za "Završeno" status
    completed_issues = [issue for issue in all_issues if issue.status == "Završeno"]
    print(f"DEBUG REPO: Found {len(completed_issues)} issues with 'Završeno' status")
    for issue in completed_issues:
        print(f"DEBUG REPO: Completed issue - ID: {issue.id}, Title: {issue.title}, Status: {issue.status}")
    
    # Pagination
    issues = all_issues[(page-1)*page_size:page*page_size]
    print(f"DEBUG REPO: Returning {len(issues)} issues for this page")
    print(f"DEBUG REPO: Returning issues statuses: {[issue.status for issue in issues]}")
    
    # Provjeri da li su "Završeno" issue-i u paginaciji
    completed_in_page = [issue for issue in issues if issue.status == "Završeno"]
    print(f"DEBUG REPO: Completed issues in current page: {len(completed_in_page)}")
    
    return issues, total

def get_user_issue_history_stats(session: Session, user_id: int):
    from models import Rating
    from sqlalchemy import func
    
    # Broj ukupnih prijava
    total_issues = session.exec(select(func.count(Issue.id)).where(Issue.tenant_id == user_id)).first() or 0
    
    # Broj prijava po statusu
    completed_issues = session.exec(
        select(func.count(Issue.id)).where(Issue.tenant_id == user_id, Issue.status == "Završeno")
    ).first() or 0
    
    rejected_issues = session.exec(
        select(func.count(Issue.id)).where(Issue.tenant_id == user_id, Issue.status == "Otkazano")
    ).first() or 0
    
    in_progress_issues = session.exec(
        select(func.count(Issue.id)).where(
            Issue.tenant_id == user_id, 
            Issue.status.in_(["Dodijeljeno izvođaču", "Na lokaciji", "Popravka u toku", "Čeka dijelove"])
        )
    ).first() or 0
    
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
    
    # Prosječna ocjena
    avg_rating = session.exec(
        select(func.avg(Rating.score))
        .where(Rating.tenant_id == user_id)
    ).first() or 0
    
    return {
        "totalIssues": total_issues,
        "completedIssues": completed_issues,
        "rejectedIssues": rejected_issues,
        "inProgressIssues": in_progress_issues,
        "averageResolutionTime": round(avg_resolution_time, 1),
        "averageRating": round(avg_rating, 2) if avg_rating else 0
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

def get_issues_for_manager_complete(session: Session, filters: dict, page: int = 1, page_size: int = 10):
    """Dohvata sve issue-e koji NISU statusa 'Primljeno'"""
    print(f"DEBUG: get_issues_for_manager_complete called with filters: {filters}, page: {page}, page_size: {page_size}")

    statement = select(Issue)

    # Dodaj relacije
    statement = statement.options(
        selectinload(Issue.tenant),
        selectinload(Issue.category),
        selectinload(Issue.images)
    )

    # Dodaj filtere
    # Isključi 'Primljeno' bez obzira na ostale filtere
    statement = statement.where(Issue.status != "Primljeno")

    if filters.get("status") and filters["status"] != "all":
        statement = statement.where(Issue.status == filters["status"])

    if filters.get("search"):
        search = f"%{filters['search']}%"
        statement = statement.where(
            (Issue.title.ilike(search)) |
            (Issue.description.ilike(search)) |
            (Issue.location.ilike(search))
        )

    if filters.get("address"):
        address = f"%{filters['address']}%"
        statement = statement.join(Issue.tenant).where(User.address.ilike(address))

    if filters.get("contractor"):
        contractor = f"%{filters['contractor']}%"
        # Koristi LEFT JOIN da uključi issue-e bez assignments
        statement = statement.outerjoin(Issue.assignments).outerjoin(Assignment.contractor).where(User.full_name.ilike(contractor))

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
    print(f"DEBUG: SQL offset: {offset}, limit: {page_size}")

    print(f"DEBUG: Final SQL statement: {statement}")

    issues = list(session.exec(statement))
    print(f"DEBUG: Repository returned {len(issues)} issues")

    # Debug: ispiši prvih nekoliko issue-a
    for i, issue in enumerate(issues[:3]):
        print(f"DEBUG: Repository Issue {i+1}: ID={issue.id}, Status={issue.status}, Title={issue.title}")

    return issues