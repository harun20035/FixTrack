from sqlmodel import Session
from models import Notification, Issue
from repositories.notification_repository import (
    create_notification, get_notifications_for_user, mark_notification_as_read, mark_all_notifications_as_read
)
from fastapi import HTTPException, status
from schemas.notification_schema import NotificationCreate, NotificationRead

def create_new_notification(session: Session, data: NotificationCreate) -> Notification:
    notification = Notification(
        user_id=data.user_id,
        issue_id=data.issue_id,
        old_status=data.old_status,
        new_status=data.new_status,
        changed_by=data.changed_by,
    )
    return create_notification(session, notification)

def get_user_notifications(session: Session, user_id: int):
    notifications = get_notifications_for_user(session, user_id)
    result = []
    for n in notifications:
        issue = session.get(Issue, n.issue_id)
        result.append(NotificationRead(
            id=n.id,
            user_id=n.user_id,
            issue_id=n.issue_id,
            old_status=n.old_status,
            new_status=n.new_status,
            changed_by=n.changed_by,
            is_read=n.is_read,
            created_at=n.created_at,
            issue_title=issue.title if issue else None
        ))
    return result

def mark_notification_read(session: Session, notification_id: int, user_id: int):
    notification = mark_notification_as_read(session, notification_id, user_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notifikacija nije pronađena ili nemate dozvolu.")
    return notification

def mark_all_read(session: Session, user_id: int):
    return mark_all_notifications_as_read(session, user_id) 