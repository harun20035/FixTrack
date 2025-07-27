from sqlmodel import Session, select
from models.assignment_model import Assignment
from models.assignment_image_model import AssignmentImage
from models.assignment_document_model import AssignmentDocument
from models.issue_model import Issue
from models.user_model import User
from models.role_model import Role
from repositories.assignment_repository import (
    create_assignment, get_assignments_for_contractor, get_assignment_by_id,
    update_assignment_status, update_assignment_cost, reject_assignment,
    add_assignment_image, add_assignment_document, get_assignment_images,
    get_assignment_documents, get_assignments_by_status
)
from fastapi import HTTPException, UploadFile
from typing import List, Optional
import os
import shutil
from datetime import datetime

def get_contractor_assignments(session: Session, contractor_id: int) -> List[dict]:
    """Dohvati sve assignment-e za određenog izvođača"""
    print(f"DEBUG: Getting assignments for contractor_id: {contractor_id}")
    
    # Dohvati sve assignment-e za izvođača
    assignments = session.exec(
        select(Assignment).where(Assignment.contractor_id == contractor_id)
    ).all()
    
    print(f"DEBUG: Found {len(assignments)} assignments")
    
    result = []
    for assignment in assignments:
        print(f"DEBUG: Processing assignment_id: {assignment.id}, issue_id: {assignment.issue_id}")
        
        # Dohvati issue sa svim relacijama
        issue_statement = select(Issue).where(Issue.id == assignment.issue_id).options(
            selectinload(Issue.category),
            selectinload(Issue.images)
        )
        issue = session.exec(issue_statement).first()
        print(f"DEBUG: Issue found: {issue is not None}")
        
        if not issue:
            print(f"DEBUG: Skipping assignment {assignment.id} - issue not found")
            continue
            
        # Dohvati tenant
        tenant = session.get(User, issue.tenant_id) if issue and issue.tenant_id else None
        print(f"DEBUG: Tenant found: {tenant is not None}")
        
        try:
            assignment_dict = {
                "id": assignment.id,
                "issue_id": assignment.issue_id,
                "contractor_id": assignment.contractor_id,
                "status": assignment.status,
                "estimated_cost": assignment.estimated_cost,
                "actual_cost": assignment.actual_cost,
                "planned_date": assignment.planned_date,
                "rejection_reason": assignment.rejection_reason,
                "notes": assignment.notes,
                "created_at": assignment.created_at,
                "updated_at": assignment.updated_at,
                "issue": {
                    "id": issue.id,
                    "title": issue.title,
                    "description": issue.description,
                    "location": issue.location,
                    "status": issue.status,
                    "created_at": issue.created_at,
                    "updated_at": issue.updated_at,
                    "category": {
                        "id": issue.category.id,
                        "name": issue.category.name
                    } if issue.category else None,
                    "images": [
                        {"id": img.id, "image_url": img.image_url} 
                        for img in issue.images
                    ] if issue.images else []
                } if issue else None,
                "tenant": {
                    "id": tenant.id,
                    "full_name": tenant.full_name,
                    "email": tenant.email,
                    "phone": tenant.phone,
                    "address": tenant.address
                } if tenant else None
            }
            result.append(assignment_dict)
            print(f"DEBUG: Successfully processed assignment {assignment.id}")
        except Exception as e:
            print(f"DEBUG: Error processing assignment {assignment.id}: {str(e)}")
            continue
    
    print(f"DEBUG: Returning {len(result)} processed assignments")
    return result

def update_assignment_status_service(session: Session, assignment_id: int, contractor_id: int, status: str, notes: Optional[str] = None) -> dict:
    """Ažuriraj status assignment-a"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu mijenjati status.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Validacija statusa
    valid_statuses = ["Dodijeljeno", "U toku", "Čeka dijelove", "Završeno", "Odbijeno"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Nevažeći status.")
    
    # Ažuriraj status
    updated_assignment = update_assignment_status(session, assignment_id, status, notes)
    
    # Ako je status završeno, ažuriraj i issue status
    if status == "Završeno":
        issue = session.get(Issue, assignment.issue_id)
        if issue:
            issue.status = "Završeno"
            session.commit()
    
    return {
        "message": "Status je uspješno ažuriran.",
        "assignment_id": assignment_id,
        "new_status": status
    }

def reject_assignment_service(session: Session, assignment_id: int, contractor_id: int, rejection_reason: str) -> dict:
    """Odbij assignment"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu odbijati assignment-e.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Odbij assignment
    updated_assignment = reject_assignment(session, assignment_id, rejection_reason)
    
    return {
        "message": "Assignment je uspješno odbijen.",
        "assignment_id": assignment_id,
        "rejection_reason": rejection_reason
    }

def update_assignment_cost_service(session: Session, assignment_id: int, contractor_id: int, actual_cost: float) -> dict:
    """Ažuriraj troškove assignment-a"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu ažurirati troškove.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Ažuriraj troškove
    updated_assignment = update_assignment_cost(session, assignment_id, actual_cost)
    
    return {
        "message": "Troškovi su uspješno ažurirani.",
        "assignment_id": assignment_id,
        "actual_cost": actual_cost
    }

def upload_assignment_image(session: Session, assignment_id: int, contractor_id: int, file: UploadFile) -> dict:
    """Upload slike za assignment"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu upload-ovati slike.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Kreiraj direktorij ako ne postoji
    upload_dir = f"media/assignments/{assignment_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Sačuvaj fajl
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Sačuvaj u bazu
    image_url = f"/media/assignments/{assignment_id}/{file.filename}"
    image = add_assignment_image(session, assignment_id, image_url)
    
    return {
        "message": "Slika je uspješno upload-ovana.",
        "image_id": image.id,
        "image_url": image_url
    }

def upload_assignment_document(session: Session, assignment_id: int, contractor_id: int, file: UploadFile, document_type: str) -> dict:
    """Upload dokumenta za assignment"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu upload-ovati dokumente.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Kreiraj direktorij ako ne postoji
    upload_dir = f"media/assignments/{assignment_id}/documents"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Sačuvaj fajl
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Sačuvaj u bazu
    document_url = f"/media/assignments/{assignment_id}/documents/{file.filename}"
    document = add_assignment_document(session, assignment_id, document_url, document_type)
    
    return {
        "message": "Dokument je uspješno upload-ovan.",
        "document_id": document.id,
        "document_url": document_url,
        "document_type": document_type
    } 