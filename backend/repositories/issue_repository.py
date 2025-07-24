from sqlmodel import Session, select, delete
from models import Issue, IssueImage, IssueCategory, Comment, Rating, Assignment, Survey, AssignmentImage, AssignmentDocument
from typing import List, Optional, Dict

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