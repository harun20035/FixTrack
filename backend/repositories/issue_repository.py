from sqlmodel import Session, select, delete, func
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
    all_issues = session.exec(select(Issue).where(Issue.tenant_id == user_id)).all()
    total_issues = len(all_issues)
    completed_issues = len([i for i in all_issues if i.status == "Završeno"])
    rejected_issues = len([i for i in all_issues if i.status == "Odbijeno"])
    in_progress_issues = len([i for i in all_issues if i.status == "U toku"])
    from models import Rating
    ratings = session.exec(select(Rating.score).join(Issue).where(Issue.tenant_id == user_id)).all()
    avg_rating = sum(ratings) / len(ratings) if ratings else None
    avg_resolution_time = None
    return HistoryStats(
        total_issues=total_issues,
        completed_issues=completed_issues,
        rejected_issues=rejected_issues,
        in_progress_issues=in_progress_issues,
        average_rating=avg_rating,
        average_resolution_time=avg_resolution_time,
    ) 