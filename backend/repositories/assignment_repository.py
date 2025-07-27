from sqlmodel import Session, select
from models.assignment_model import Assignment
from models.assignment_image_model import AssignmentImage
from models.assignment_document_model import AssignmentDocument
from models.issue_model import Issue
from models.user_model import User
from typing import List, Optional
from datetime import datetime

def create_assignment(session: Session, assignment: Assignment) -> Assignment:
    session.add(assignment)
    session.commit()
    session.refresh(assignment)
    return assignment

def get_assignments_for_contractor(session: Session, contractor_id: int) -> List[Assignment]:
    statement = select(Assignment).where(Assignment.contractor_id == contractor_id)
    return list(session.exec(statement))

def get_assignment_by_id(session: Session, assignment_id: int) -> Optional[Assignment]:
    return session.get(Assignment, assignment_id)

def update_assignment_status(session: Session, assignment_id: int, status: str, notes: Optional[str] = None) -> Optional[Assignment]:
    assignment = session.get(Assignment, assignment_id)
    if assignment:
        assignment.status = status
        if notes:
            assignment.notes = notes
        assignment.updated_at = datetime.utcnow()
        session.commit()
        session.refresh(assignment)
    return assignment

def update_assignment_cost(session: Session, assignment_id: int, actual_cost: float) -> Optional[Assignment]:
    assignment = session.get(Assignment, assignment_id)
    if assignment:
        assignment.actual_cost = actual_cost
        assignment.updated_at = datetime.utcnow()
        session.commit()
        session.refresh(assignment)
    return assignment

def reject_assignment(session: Session, assignment_id: int, rejection_reason: str) -> Optional[Assignment]:
    assignment = session.get(Assignment, assignment_id)
    if assignment:
        assignment.status = "Odbijeno"
        assignment.rejection_reason = rejection_reason
        assignment.updated_at = datetime.utcnow()
        session.commit()
        session.refresh(assignment)
    return assignment

def add_assignment_image(session: Session, assignment_id: int, image_url: str) -> AssignmentImage:
    image = AssignmentImage(assignment_id=assignment_id, image_url=image_url)
    session.add(image)
    session.commit()
    session.refresh(image)
    return image

def add_assignment_document(session: Session, assignment_id: int, document_url: str, document_type: str) -> AssignmentDocument:
    document = AssignmentDocument(
        assignment_id=assignment_id, 
        document_url=document_url, 
        type=document_type
    )
    session.add(document)
    session.commit()
    session.refresh(document)
    return document

def get_assignment_images(session: Session, assignment_id: int) -> List[AssignmentImage]:
    statement = select(AssignmentImage).where(AssignmentImage.assignment_id == assignment_id)
    return list(session.exec(statement))

def get_assignment_documents(session: Session, assignment_id: int) -> List[AssignmentDocument]:
    statement = select(AssignmentDocument).where(AssignmentDocument.assignment_id == assignment_id)
    return list(session.exec(statement))

def get_assignments_by_status(session: Session, contractor_id: int, status: str) -> List[Assignment]:
    statement = select(Assignment).where(
        Assignment.contractor_id == contractor_id,
        Assignment.status == status
    )
    return list(session.exec(statement)) 