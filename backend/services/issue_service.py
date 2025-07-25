from sqlmodel import Session
from models import Issue, IssueImage, IssueCategory
from repositories.issue_repository import (
    create_issue, add_issue_image, get_issue_categories, get_issues_for_user, update_issue_status, update_issue as repo_update_issue, delete_issue as repo_delete_issue,
    get_user_issue_history as repo_get_user_issue_history,
    get_user_issue_history_stats as repo_get_user_issue_history_stats
)
from fastapi import HTTPException, status, UploadFile
from typing import List
import os
import shutil
from sqlalchemy import select, func
from services import notification_service
from schemas.notification_schema import NotificationCreate

def create_new_issue(session: Session, tenant_id: int, data, images: List[UploadFile]) -> Issue:
    issue = Issue(
        tenant_id=tenant_id,
        category_id=data.category_id,
        title=data.title,
        description=data.description,
        location=data.location,
    )
    issue = create_issue(session, issue)
    # Save images
    for img in images:
        filename = save_issue_image(img, issue.id)
        image_obj = IssueImage(issue_id=issue.id, image_url=filename)
        add_issue_image(session, image_obj)
    session.refresh(issue)
    return issue

def save_issue_image(upload_file: UploadFile, issue_id: int) -> str:
    upload_dir = os.path.join("media", "issues", str(issue_id))
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, upload_file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return file_path

def get_categories(session: Session):
    return get_issue_categories(session)

def get_user_issues(session: Session, user_id: int, filters) -> list[Issue]:
    return get_issues_for_user(session, user_id, filters)

def change_issue_status(session: Session, user_id: int, issue_id: int, new_status: str) -> Issue:
    issue = session.get(Issue, issue_id)
    if not issue or issue.tenant_id != user_id:
        raise HTTPException(status_code=404, detail="Prijava nije pronađena ili nemate dozvolu.")
    old_status = issue.status
    updated_issue = update_issue_status(session, issue_id, new_status)
    # Kreiraj notifikaciju za korisnika (stanara)
    notification_service.create_new_notification(session, NotificationCreate(
        user_id=issue.tenant_id,
        issue_id=issue.id,
        old_status=old_status,
        new_status=new_status,
        changed_by="Sistem"  # ili ime korisnika koji je promijenio status
    ))
    return updated_issue

def update_issue(session: Session, user_id: int, issue_id: int, data) -> Issue:
    issue = session.get(Issue, issue_id)
    if not issue or issue.tenant_id != user_id or issue.status != "Primljeno":
        raise HTTPException(status_code=403, detail="Nije dozvoljeno uređivanje ove prijave.")
    update_fields = {
        "title": data.title,
        "description": data.description,
        "location": data.location,
        "category_id": data.category_id,
    }
    return repo_update_issue(session, issue, **update_fields)

def delete_issue(session: Session, user_id: int, issue_id: int) -> None:
    issue = session.get(Issue, issue_id)
    if not issue or issue.tenant_id != user_id or issue.status != "Primljeno":
        raise HTTPException(status_code=403, detail="Nije dozvoljeno brisanje ove prijave.")
    return repo_delete_issue(session, issue)

def get_user_issue_history(session: Session, user_id: int, filters: dict, page: int = 1, page_size: int = 10):
    issues, total = repo_get_user_issue_history(session, user_id, filters, page, page_size)
    # For each issue, count comments and get rating for that user
    from models import Comment, Rating
    history_issues = []
    for issue in issues:
        comments = session.exec(select(Comment).where(Comment.issue_id == issue.id, Comment.user_id == user_id)).all()
        comments_count = len(comments)
        rating_obj = session.exec(select(Rating).where(Rating.issue_id == issue.id, Rating.tenant_id == user_id)).first()
        rating = rating_obj.score if rating_obj else None
        
        # Debug: print the created_at value
        print(f"Issue {issue.id} created_at: {issue.created_at}, type: {type(issue.created_at)}")
        
        history_issues.append({
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "location": issue.location,
            "status": issue.status,
            "category": issue.category.name if issue.category else None,
            "createdAt": issue.created_at.isoformat() if issue.created_at else None,
            "completedAt": None,
            "assignedTo": getattr(issue, 'assignedTo', None),
            "commentsCount": comments_count,
            "rating": rating,
        })
    return history_issues, total

def get_user_issue_history_stats(session: Session, user_id: int):
    return repo_get_user_issue_history_stats(session, user_id) 