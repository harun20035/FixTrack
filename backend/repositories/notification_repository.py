from sqlmodel import Session, select
from models import Notification, Issue
from typing import List

def create_notification(session: Session, notification: Notification) -> Notification:
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification

def get_notifications_for_user(session: Session, user_id: int) -> List[Notification]:
    statement = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
    return list(session.exec(statement))

def mark_notification_as_read(session: Session, notification_id: int, user_id: int) -> Notification:
    notification = session.get(Notification, notification_id)
    if not notification or notification.user_id != user_id:
        return None
    notification.is_read = True
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification

def mark_all_notifications_as_read(session: Session, user_id: int):
    statement = select(Notification).where(Notification.user_id == user_id, Notification.is_read == False)
    notifications = list(session.exec(statement))
    for notification in notifications:
        notification.is_read = True
        session.add(notification)
    session.commit()
    return notifications 