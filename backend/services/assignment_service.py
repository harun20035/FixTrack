from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
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
    
    # Dohvati sve assignment-e za izvođača
    assignments = session.exec(
        select(Assignment).where(Assignment.contractor_id == contractor_id)
    ).all()
    
    result = []
    for assignment in assignments:
        # Dohvati issue sa svim relacijama
        issue_statement = select(Issue).where(Issue.id == assignment.issue_id).options(
            selectinload(Issue.category),
            selectinload(Issue.images)
        )
        issue = session.exec(issue_statement).first()
        
        if not issue:
            continue
            
        # Dohvati tenant
        tenant = session.get(User, issue.tenant_id) if issue and issue.tenant_id else None
        
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
                    "category": {
                        "id": issue.category.id,
                        "name": issue.category.name
                    } if issue.category else None,
                    "images": [
                        {"id": img.id, "image_url": img.image_url} 
                        for img in issue.images
                    ] if issue.images else [],
                    "tenant": {
                        "id": tenant.id,
                        "full_name": tenant.full_name,
                        "email": tenant.email,
                        "phone": tenant.phone,
                        "address": tenant.address
                    } if tenant else None
                } if issue else None
            }
            result.append(assignment_dict)
        except Exception as e:
            continue
    
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
    valid_statuses = ["Dodijeljeno", "Popravka u toku", "Čeka dijelove", "Završeno", "Odbijeno"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Nevažeći status.")
    
    # Ažuriraj status
    updated_assignment = update_assignment_status(session, assignment_id, status, notes)
    
    # Ažuriraj i issue status na osnovu assignment statusa
    issue = session.get(Issue, assignment.issue_id)
    if issue:
        if status == "Popravka u toku":
            issue.status = "Popravka u toku"
        elif status == "Čeka dijelove":
            issue.status = "Čeka dijelove"
        elif status == "Završeno":
            issue.status = "Završeno"
        elif status == "Odbijeno":
            issue.status = "Otkazano"
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

def update_issue_status_by_contractor_service(session: Session, assignment_id: int, contractor_id: int, new_status: str) -> dict:
    """Ažuriraj status issue-a od strane izvođača"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu mijenjati status issue-a.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Provjera da li issue postoji
    issue = session.get(Issue, assignment.issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue nije pronađen.")
    
    # Validacija statusa
    valid_statuses = ["Primljeno", "Dodijeljeno izvođaču", "Na lokaciji", "Popravka u toku", "Čeka dijelove", "Završeno", "Otkazano"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Nevažeći status.")
    
    # Ažuriraj status issue-a
    old_status = issue.status
    issue.status = new_status
    session.commit()
    session.refresh(issue)
    
    # Kreiraj notifikaciju za stanara
    from services import notification_service
    from schemas.notification_schema import NotificationCreate
    
    notification_service.create_new_notification(session, NotificationCreate(
        user_id=issue.tenant_id,
        issue_id=issue.id,
        old_status=old_status,
        new_status=new_status,
        changed_by="Izvođač"
    ))
    
    return {
        "message": "Status issue-a je uspješno promijenjen.",
        "issue_id": issue.id,
        "old_status": old_status,
        "new_status": new_status
    }

def update_planned_data_service(session: Session, assignment_id: int, contractor_id: int, planned_date: str, estimated_cost: float) -> dict:
    """Ažuriraj planirani datum i procjenu troškova"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu ažurirati planirane podatke.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Ažuriraj planirane podatke
    from datetime import datetime
    assignment.planned_date = datetime.fromisoformat(planned_date) if planned_date else None
    assignment.estimated_cost = estimated_cost
    session.commit()
    session.refresh(assignment)
    
    return {
        "message": "Planirani podaci su uspješno ažurirani.",
        "assignment_id": assignment_id,
        "planned_date": planned_date,
        "estimated_cost": estimated_cost
    }

def get_planned_data_service(session: Session, assignment_id: int, contractor_id: int) -> dict:
    """Dohvati planirani datum i procjenu troškova"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu pristupiti planiranim podacima.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    return {
        "planned_date": assignment.planned_date.isoformat() if assignment.planned_date else None,
        "estimated_cost": assignment.estimated_cost
    }

async def upload_completion_data_service(session: Session, assignment_id: int, contractor_id: int, notes: str, images: List[UploadFile], warranty_pdf: UploadFile = None) -> dict:
    """Upload završnih slika, bilješki i PDF-a za garanciju"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu upload-ovati završne podatke.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Kreiraj direktorij ako ne postoji
    upload_dir = f"media/assignments/{assignment_id}/completion"
    os.makedirs(upload_dir, exist_ok=True)
    
    uploaded_images = []
    warranty_document = None
    
    # Upload slika
    for image in images:
        if image.content_type and image.content_type.startswith("image/"):
            file_path = os.path.join(upload_dir, image.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            image_url = f"/media/assignments/{assignment_id}/completion/{image.filename}"
            uploaded_images.append(image_url)
    
    # Upload warranty PDF
    if warranty_pdf and warranty_pdf.content_type == "application/pdf":
        warranty_filename = f"warranty_{assignment_id}_{warranty_pdf.filename}"
        warranty_path = os.path.join(upload_dir, warranty_filename)
        with open(warranty_path, "wb") as buffer:
            shutil.copyfileobj(warranty_pdf.file, buffer)
        
        warranty_document = {
            "filename": warranty_filename,
            "file_url": f"/media/assignments/{assignment_id}/completion/{warranty_filename}"
        }
    
    # Ažuriraj notes u assignment
    assignment.notes = notes
    session.commit()
    
    return {
        "message": "Završni podaci su uspješno upload-ovani.",
        "assignment_id": assignment_id,
        "notes": notes,
        "images": uploaded_images,
        "warranty_document": warranty_document
    }

def get_completion_data_service(session: Session, assignment_id: int, contractor_id: int) -> dict:
    """Dohvati završne slike i bilješke"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu pristupiti završnim podacima.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Dohvati slike i warranty PDF iz direktorija
    completion_dir = f"media/assignments/{assignment_id}/completion"
    images = []
    warranty_document = None
    
    if os.path.exists(completion_dir):
        for filename in os.listdir(completion_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                images.append({
                    "image_url": f"/media/assignments/{assignment_id}/completion/{filename}",
                    "filename": filename
                })
            elif filename.lower().endswith('.pdf') and filename.startswith('warranty_'):
                warranty_document = {
                    "filename": filename,
                    "file_url": f"/media/assignments/{assignment_id}/completion/{filename}"
                }
    
    return {
        "notes": assignment.notes,
        "images": images,
        "documents": [],  # Za sada prazno, može se proširiti
        "warranty_document": warranty_document
    }

def update_cancellation_reason_service(session: Session, assignment_id: int, contractor_id: int, cancellation_reason: str) -> dict:
    """Ažuriraj razlog otkazivanja"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu ažurirati razlog otkazivanja.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    # Ažuriraj razlog otkazivanja
    assignment.rejection_reason = cancellation_reason
    session.commit()
    session.refresh(assignment)
    
    return {
        "message": "Razlog otkazivanja je uspješno ažuriran.",
        "assignment_id": assignment_id,
        "cancellation_reason": cancellation_reason
    }

def get_cancellation_reason_service(session: Session, assignment_id: int, contractor_id: int) -> dict:
    """Dohvati razlog otkazivanja"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu pristupiti razlogu otkazivanja.")
    
    # Provjera da li assignment pripada ovom izvođaču
    assignment = session.get(Assignment, assignment_id)
    if not assignment or assignment.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Assignment nije pronađen.")
    
    return {
        "cancellation_reason": assignment.rejection_reason
    }

def get_completed_issues_service(session: Session, contractor_id: int) -> list:
    """Dohvati sve završene issue-e za izvođača"""
    # Provjera da li je korisnik izvođač
    user = session.get(User, contractor_id)
    if not user or not hasattr(user, 'role_id'):
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or not hasattr(role, 'name') or "izvođač" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo izvođači mogu pristupiti završenim issue-ima.")
    
    # Dohvati sve assignments za ovog izvođača sa statusom "Završeno"
    assignments = session.query(Assignment).options(
        selectinload(Assignment.issue).selectinload(Issue.category),
        selectinload(Assignment.issue).selectinload(Issue.tenant)
    ).filter(
        Assignment.contractor_id == contractor_id
    ).all()
    
    completed_issues = []
    
    for assignment in assignments:
        if (assignment.issue and 
            hasattr(assignment.issue, 'status') and 
            assignment.issue.status == "Završeno"):
            # Dohvati slike iz direktorija
            assignment_id = getattr(assignment, 'id', None)
            if not assignment_id:
                continue
            completion_dir = f"media/assignments/{assignment_id}/completion"
            images = []
            warranty_document = None
            
            if os.path.exists(completion_dir):
                for filename in os.listdir(completion_dir):
                    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                        images.append(f"/media/assignments/{assignment_id}/completion/{filename}")
                    elif filename.lower().endswith('.pdf') and filename.startswith('warranty_'):
                        warranty_document = f"/media/assignments/{assignment_id}/completion/{filename}"
            
            # Dohvati tenant podatke
            tenant_data = None
            if assignment.issue.tenant and hasattr(assignment.issue.tenant, 'full_name'):
                tenant_data = {
                    "name": assignment.issue.tenant.full_name,
                    "apartment": assignment.issue.tenant.address or "Nepoznato",
                    "phone": assignment.issue.tenant.phone or "Nepoznato"
                }
            
            # Sigurno pristupanje kategoriji
            category_name = "ostalo"
            if assignment.issue.category and hasattr(assignment.issue.category, 'name'):
                category_name = assignment.issue.category.name.lower()
            
            completed_issue = {
                "id": str(assignment_id),
                "title": getattr(assignment.issue, 'title', 'Nepoznato'),
                "description": getattr(assignment.issue, 'description', ''),
                "category": category_name,
                "priority": "srednji",  # Default priority, može se dodati u Issue model
                "tenant": tenant_data,
                "location": getattr(assignment.issue, 'location', ''),
                "completed_at": getattr(assignment.issue, 'created_at', assignment.created_at).isoformat(),
                "notes": [assignment.notes] if getattr(assignment, 'notes', None) else [],
                "images": images,
                "warranty_pdf": warranty_document
            }
            
            completed_issues.append(completed_issue)
    
    # Sortiraj po datumu završetka (najnoviji prvi)
    completed_issues.sort(key=lambda x: x["completed_at"], reverse=True)
    
    return completed_issues 