from sqlmodel import Session, select
from models.assignment_notification_model import AssignmentNotification
from typing import List

def create_assignment_notification(session: Session, notification: AssignmentNotification) -> AssignmentNotification:
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification

def get_assignment_notifications_for_contractor(session: Session, contractor_id: int) -> List[AssignmentNotification]:
    statement = select(AssignmentNotification).where(AssignmentNotification.contractor_id == contractor_id).order_by(AssignmentNotification.created_at.desc())
    return session.exec(statement).all()

def mark_assignment_notification_as_read(session: Session, notification_id: int, contractor_id: int) -> AssignmentNotification:
    statement = select(AssignmentNotification).where(
        AssignmentNotification.id == notification_id,
        AssignmentNotification.contractor_id == contractor_id
    )
    notification = session.exec(statement).first()
    if notification:
        notification.is_read = True
        session.add(notification)
        session.commit()
        session.refresh(notification)
    return notification

def mark_all_assignment_notifications_as_read(session: Session, contractor_id: int) -> List[AssignmentNotification]:
    statement = select(AssignmentNotification).where(
        AssignmentNotification.contractor_id == contractor_id,
        AssignmentNotification.is_read == False
    )
    notifications = session.exec(statement).all()
    for notification in notifications:
        notification.is_read = True
        session.add(notification)
    session.commit()
    for notification in notifications:
        session.refresh(notification)
    return notifications
