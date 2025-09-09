from sqlmodel import Session
from models.assignment_notification_model import AssignmentNotification
from models.issue_model import Issue
from models.assignment_model import Assignment
from models.issue_category_model import IssueCategory
from repositories.assignment_notification_repository import (
    create_assignment_notification, get_assignment_notifications_for_contractor, 
    mark_assignment_notification_as_read, mark_all_assignment_notifications_as_read
)
from fastapi import HTTPException, status
from schemas.assignment_notification_schema import AssignmentNotificationCreate, AssignmentNotificationRead

def create_new_assignment_notification(session: Session, data: AssignmentNotificationCreate) -> AssignmentNotification:
    notification = AssignmentNotification(
        contractor_id=data.contractor_id,
        assignment_id=data.assignment_id,
        issue_id=data.issue_id,
        notification_type=data.notification_type,
        assigned_by=data.assigned_by,
        message=data.message,
    )
    return create_assignment_notification(session, notification)

def get_contractor_assignment_notifications(session: Session, contractor_id: int):
    notifications = get_assignment_notifications_for_contractor(session, contractor_id)
    result = []
    
    for n in notifications:
        # Dohvati issue podatke
        issue = session.get(Issue, n.issue_id)
        if not issue:
            continue
            
        # Dohvati kategoriju
        category = None
        if issue.category_id:
            category_obj = session.get(IssueCategory, issue.category_id)
            if category_obj:
                category = category_obj.name.lower()
        
        result.append(AssignmentNotificationRead(
            id=n.id,
            assignmentId=n.assignment_id,
            issueId=n.issue_id,
            issueTitle=issue.title,
            issueDescription=issue.description,
            issueLocation=issue.location,
            category=category,
            priority="srednji",  # Default priority
            assignedBy=n.assigned_by,
            assignedAt=n.created_at.isoformat(),
            isRead=n.is_read,
            type=n.notification_type,
            message=n.message
        ))
    
    return result

def mark_assignment_notification_read(session: Session, notification_id: int, contractor_id: int):
    notification = mark_assignment_notification_as_read(session, notification_id, contractor_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notifikacija nije pronađena ili nemate dozvolu.")
    return notification

def mark_all_assignment_notifications_read(session: Session, contractor_id: int):
    return mark_all_assignment_notifications_as_read(session, contractor_id)
