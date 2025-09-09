from sqlmodel import Session
from models import Issue, IssueImage, IssueCategory, User, Role
from models.admin_note_model import AdminNote
from models.assignment_model import Assignment
from repositories.issue_repository import (
    create_issue, add_issue_image, get_issue_categories, get_issues_for_user, update_issue_status, update_issue as repo_update_issue, delete_issue as repo_delete_issue,
    get_user_issue_history as repo_get_user_issue_history,
    get_user_issue_history_stats as repo_get_user_issue_history_stats,
    get_issues_for_manager, get_issues_for_manager_simple, get_issues_for_manager_complete
)
from fastapi import HTTPException, status, UploadFile
from typing import List
import os
import shutil
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from services import notification_service
from services.assignment_notification_service import create_new_assignment_notification
from schemas.notification_schema import NotificationCreate
from schemas.assignment_notification_schema import AssignmentNotificationCreate

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
    print(f"DEBUG SERVICE: Getting issue history for user {user_id}, page {page}, page_size {page_size}")
    print(f"DEBUG SERVICE: Filters: {filters}")
    
    issues, total = repo_get_user_issue_history(session, user_id, filters, page, page_size)
    print(f"DEBUG SERVICE: Repository returned {len(issues)} issues, total {total}")
    
    # For each issue, count comments and get rating for that user
    from models import Comment, Rating
    history_issues = []
    for issue in issues:
        comments = session.exec(select(Comment).where(Comment.issue_id == issue.id, Comment.user_id == user_id)).all()
        comments_count = len(comments)
        try:
            rating_obj = session.exec(select(Rating).where(Rating.issue_id == issue.id, Rating.tenant_id == user_id)).first()
            print(f"DEBUG: Issue {issue.id} rating_obj: {rating_obj}, type: {type(rating_obj)}")
            
            # Handle both direct Rating object and Row tuple
            if rating_obj:
                if hasattr(rating_obj, 'score'):
                    # Direct Rating object
                    rating = rating_obj.score
                elif hasattr(rating_obj, '__getitem__') and len(rating_obj) > 0:
                    # Row tuple - extract the Rating object from the tuple
                    rating_instance = rating_obj[0]
                    if hasattr(rating_instance, 'score'):
                        rating = rating_instance.score
                    else:
                        rating = None
                else:
                    rating = None
            else:
                rating = None
                
            print(f"DEBUG: Issue {issue.id} rating: {rating}")
        except Exception as e:
            print(f"DEBUG: Error getting rating for issue {issue.id}: {e}")
            rating = None
        
        # Debug: print the created_at value
        print(f"Issue {issue.id} created_at: {issue.created_at}, type: {type(issue.created_at)}")
        
        # Dohvati assignedTo iz assignments relacije
        assigned_to = None
        if issue.assignments:
            # Uzmi prvi assignment (možda treba logika za najnoviji)
            assignment = issue.assignments[0]
            if assignment.contractor:
                assigned_to = {
                    "id": assignment.contractor.id,
                    "full_name": assignment.contractor.full_name
                }
        
        history_issues.append({
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "location": issue.location,
            "status": issue.status,
            "category": {
                "id": issue.category.id,
                "name": issue.category.name
            } if issue.category else None,
            "createdAt": issue.created_at.isoformat() if issue.created_at else None,
            "completedAt": None,
            "assignedTo": assigned_to,
            "commentsCount": comments_count,
            "rating": rating,
        })
    
    print(f"DEBUG SERVICE: Returning {len(history_issues)} processed issues")
    
    # Debug za "Završeno" issue-e
    completed_processed = [issue for issue in history_issues if issue.get("status") == "Završeno"]
    print(f"DEBUG SERVICE: Processed completed issues: {len(completed_processed)}")
    for issue in completed_processed:
        print(f"DEBUG SERVICE: Processed completed - ID: {issue['id']}, Title: {issue['title']}, Status: {issue['status']}")
    
    return history_issues, total

def get_user_issue_history_stats(session: Session, user_id: int):
    return repo_get_user_issue_history_stats(session, user_id) 

# Funkcije za upravnike
def get_all_issues_for_manager(session: Session, user_id: int, filters: dict, page: int = 1, page_size: int = 10):
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Debug: ispiši role_id korisnika
    print(f"User {user.full_name} has role_id: {user.role_id}")
    
    # Provjeri da li je korisnik upravnik (možemo provjeriti po imenu role-a)
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup. Potrebna je uloga upravnika.")
    
    issues = get_issues_for_manager_simple(session, filters, page, page_size)
    
    return issues

def get_all_issues_for_manager_dict(session: Session, user_id: int, filters: dict, page: int = 1, page_size: int = 10):
    """Vraća podatke kao dictionary umjesto ORM objekata"""
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjeri da li je korisnik upravnik (možemo provjeriti po imenu role-a)
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup. Potrebna je uloga upravnika.")
    
    issues = get_issues_for_manager_simple(session, filters, page, page_size)
    
    # Konvertuj u dictionary format
    result = []
    for issue in issues:
        issue_dict = {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "location": issue.location,
            "status": issue.status,
            "created_at": issue.created_at,
            "tenant": {
                "id": issue.tenant.id,
                "full_name": issue.tenant.full_name,
                "email": issue.tenant.email,
                "phone": issue.tenant.phone,
                "address": issue.tenant.address
            } if issue.tenant else None,
            "category": {
                "id": issue.category.id,
                "name": issue.category.name
            } if issue.category else None,
            "images": [
                {
                    "id": img.id,
                    "image_url": img.image_url
                } for img in issue.images
            ] if issue.images else []
        }
        result.append(issue_dict)
    
    return result

def get_available_contractors(session, user_id):
    contractor_role = session.execute(
        select(Role).where(Role.name.ilike("%izvođač%"))
    ).first()
    if contractor_role:
        contractor_role = contractor_role[0]  # Pristupi Role objektu
        contractors = session.execute(
            select(User).where(User.role_id == contractor_role.id)
        ).scalars().all()
        # Pretvori svaki User u dict
        contractor_dicts = []
        for contractor in contractors:
            # Provjeri koliko aktivnih zadataka ima izvođač
            active_assignments = session.execute(
                select(Assignment).where(
                    Assignment.contractor_id == contractor.id,
                    Assignment.status.in_(["Primljeno", "Na lokaciji", "Popravka u toku"])
                )
            ).scalars().all()
            
            contractor_dicts.append({
                "id": contractor.id,
                "full_name": contractor.full_name,
                "email": contractor.email,
                "phone": contractor.phone,
                "address": contractor.address,
                "role_id": contractor.role_id,
                "created_at": contractor.created_at,
                "active_assignments_count": len(active_assignments),
                "is_available": len(active_assignments) < 5  # Izvođač je slobodan ako ima manje od 5 aktivnih zadataka
            })
        return contractor_dicts
    return []

def assign_contractor_to_issue(session: Session, user_id: int, issue_id: int, contractor_id: int):
    print(f"DEBUG: assign_contractor_to_issue called with issue_id={issue_id}, contractor_id={contractor_id}")
    
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        print(f"DEBUG: User {user_id} not found")
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        print(f"DEBUG: User {user_id} is not manager, role: {role.name if role else 'None'}")
        raise HTTPException(status_code=403, detail="Samo upravnici mogu dodijeliti izvođače.")
    
    # Provjera da li issue postoji i da li je u statusu "Primljeno"
    issue = session.get(Issue, issue_id)
    if not issue:
        print(f"DEBUG: Issue {issue_id} not found")
        raise HTTPException(status_code=404, detail="Prijava nije pronađena.")
    
    print(f"DEBUG: Issue {issue_id} status: {issue.status}")
    if issue.status != "Primljeno":
        print(f"DEBUG: Issue {issue_id} has wrong status: {issue.status}, expected: Primljeno")
        raise HTTPException(status_code=400, detail="Samo prijave sa statusom 'Primljeno' mogu biti dodijeljene izvođaču.")
    
    # Provjera da li izvođač postoji
    contractor = session.get(User, contractor_id)
    if not contractor:
        raise HTTPException(status_code=404, detail="Izvođač nije pronađen.")
    
    contractor_role = session.get(Role, contractor.role_id)
    if not contractor_role or "izvođač" not in contractor_role.name.lower():
        raise HTTPException(status_code=400, detail="Odabrani korisnik nije izvođač.")
    
    # Kreiraj assignment
    assignment = Assignment(
        issue_id=issue_id, 
        contractor_id=contractor_id, 
        status="Dodijeljeno"
    )
    session.add(assignment)
    issue.status = "Dodijeljeno izvođaču"
    session.commit()
    session.refresh(assignment)
    session.refresh(issue)
    
    # Kreiraj notifikaciju za izvođača
    notification_service.create_new_notification(session, NotificationCreate(
        user_id=contractor_id,
        issue_id=issue_id,
        old_status="Primljeno",
        new_status="Dodijeljeno izvođaču",
        changed_by="Upravnik"
    ))
    
    # Kreiraj assignment notifikaciju za izvođača
    create_new_assignment_notification(session, AssignmentNotificationCreate(
        contractor_id=contractor_id,
        assignment_id=assignment.id,
        issue_id=issue_id,
        notification_type="new_assignment",
        assigned_by=user.full_name,
        message=f"Dobili ste novi zadatak: {issue.title}"
    ))
    
    return {"message": "Izvođač je uspješno dodijeljen prijavi.", "assignment_id": assignment.id, "issue_id": issue_id, "contractor_id": contractor_id}

def update_issue_status_manager(session: Session, user_id: int, issue_id: int, new_status: str):
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu mijenjati status prijava.")
    
    # Provjera da li issue postoji
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Prijava nije pronađena.")
    
    # Provjera da li je novi status validan
    valid_statuses = ["Primljeno", "Dodijeljeno izvođaču", "Na lokaciji", "Popravka u toku", "Čeka dijelove", "Završeno", "Otkazano"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Neispravan status.")
    
    old_status = issue.status
    issue.status = new_status
    session.commit()
    session.refresh(issue)
    
    # Kreiraj notifikaciju za stanara
    notification_service.create_new_notification(session, NotificationCreate(
        user_id=issue.tenant_id,
        issue_id=issue_id,
        old_status=old_status,
        new_status=new_status,
        changed_by="Upravnik"
    ))
    
    return {
        "message": "Status prijave je uspješno promijenjen.",
        "issue_id": issue_id,
        "old_status": old_status,
        "new_status": new_status
    }

def get_all_issues_for_manager_complete(session: Session, user_id: int, filters: dict, page: int = 1, page_size: int = 10):
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu pristupiti ovim podacima.")
    
    # Dohvati sve issue-e (bez filtriranja po statusu "Primljeno")
    issues = get_issues_for_manager_complete(session, filters, page, page_size)
    
    result = []
    for issue in issues:
        issue_dict = {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "location": issue.location,
            "status": issue.status,
            "created_at": issue.created_at,
            "tenant": {
                "id": issue.tenant.id,
                "full_name": issue.tenant.full_name,
                "email": issue.tenant.email,
                "phone": issue.tenant.phone,
                "address": issue.tenant.address
            } if issue.tenant else None,
            "category": {
                "id": issue.category.id,
                "name": issue.category.name
            } if issue.category else None,
            "images": [
                {
                    "id": img.id,
                    "image_url": img.image_url
                } for img in issue.images
            ] if issue.images else []
        }
        result.append(issue_dict)
    
    return result

def get_all_tenants_for_manager(session: Session, user_id: int):
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu pristupiti ovim podacima.")
    
    # Dohvati sve korisnike koristeći select sa svim poljima
    statement = select(User.id, User.full_name, User.email, User.phone, User.address, User.role_id, User.created_at)
    user_rows = session.exec(statement).all()
    
    result = []
    for user_row in user_rows:
        user_dict = {
            "id": user_row.id,
            "full_name": user_row.full_name,
            "email": user_row.email,
            "phone": user_row.phone,
            "address": user_row.address,
            "role_id": user_row.role_id,
            "created_at": user_row.created_at
        }
        result.append(user_dict)
    
    return result

def create_admin_note(session: Session, user_id: int, tenant_id: int, note: str):
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu slati napomene.")
    
    # Provjera da li stanar postoji
    tenant = session.get(User, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Stanar nije pronađen.")
    
    tenant_role = session.get(Role, tenant.role_id)
    if not tenant_role:
        raise HTTPException(status_code=400, detail="Stanar nema validnu ulogu.")
    
    if "stanar" not in tenant_role.name.lower():
        raise HTTPException(status_code=400, detail="Odabrani korisnik nije stanar.")
    
    # Kreiraj napomenu
    admin_note = AdminNote(
        admin_id=user_id,
        tenant_id=tenant_id,
        note=note
    )
    session.add(admin_note)
    session.commit()
    session.refresh(admin_note)
    
    # Kreiraj notifikaciju za stanara
    notification_service.create_new_notification(session, NotificationCreate(
        user_id=tenant_id,
        issue_id=None,  # Nema vezane prijave
        old_status=None,
        new_status=None,
        changed_by="Upravnik"
    ))
    
    return {
        "message": "Napomena je uspješno poslana.",
        "note_id": admin_note.id,
        "tenant_id": tenant_id,
        "admin_id": user_id
    }

def create_issue_note(session: Session, user_id: int, issue_id: int, note: str):
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu slati napomene.")
    
    # Provjera da li issue postoji
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Prijava nije pronađena.")
    
    # Kreiraj napomenu za stanara koji je prijavio issue
    admin_note = AdminNote(
        admin_id=user_id,
        tenant_id=issue.tenant_id,
        note=note
    )
    
    session.add(admin_note)
    session.commit()
    session.refresh(admin_note)
    
    return {
        "message": "Napomena je uspješno poslana.",
        "note_id": admin_note.id,
        "issue_id": issue_id,
        "tenant_id": issue.tenant_id,
        "admin_id": user_id
    }

def get_issue_notes(session: Session, user_id: int, issue_id: int):
    """Dohvata sve napomene za određeni issue"""
    
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu pristupiti napomenama.")
    
    # Provjera da li issue postoji
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Prijava nije pronađena.")
    
    # Dohvati sve napomene za specifičan issue
    from sqlalchemy.orm import selectinload
    from sqlmodel import select
    from models.notes_model import Notes
    
    statement = select(Notes).options(
        selectinload(Notes.user)
    ).where(
        Notes.issue_id == issue_id
    ).order_by(Notes.created_at.desc())
    
    notes = list(session.exec(statement))
    
    result = []
    for note in notes:
        result.append({
            "id": note.id,
            "note": note.note,
            "created_at": note.created_at.isoformat(),
            "admin": {
                "id": note.user.id if note.user else None,
                "full_name": note.user.full_name if note.user else "Nepoznato"
            } if note.user else None
        })
    
    return result

def create_issue_note(session: Session, user_id: int, issue_id: int, note: str):
    """Kreira novu napomenu za issue"""
    
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu slati napomene.")
    
    # Provjera da li issue postoji
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Prijava nije pronađena.")
    
    # Kreiraj napomenu
    from models.notes_model import Notes
    
    new_note = Notes(
        issue_id=issue_id,
        user_id=user_id,
        note=note
    )
    
    session.add(new_note)
    session.commit()
    session.refresh(new_note)
    
    return {
        "message": "Napomena je uspješno dodana.",
        "note_id": new_note.id,
        "issue_id": issue_id,
        "user_id": user_id
    }

def get_other_issues_for_manager(session: Session, user_id: int, filters: dict, page: int = 1, page_size: int = 10):
    """Dohvaća sve issue-e koji NISU 'Primljeno' za upravnike"""
    
    # Provjera da li je korisnik upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or "upravnik" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo upravnici mogu pristupiti ovim podacima.")
    
    # Dohvati sve issue-e koji NISU 'Primljeno'
    issues = get_issues_for_manager_complete(session, filters, page, page_size)

    result = []
    for issue in issues:
        issue_dict = {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "location": issue.location,
            "status": issue.status,
            "created_at": issue.created_at,
            "tenant": {
                "id": issue.tenant.id if issue.tenant else None,
                "full_name": issue.tenant.full_name if issue.tenant else None,
                "email": issue.tenant.email if issue.tenant else None,
                "phone": issue.tenant.phone if issue.tenant else None,
                "address": issue.tenant.address if issue.tenant else None
            } if issue.tenant else None,
            "category": {
                "id": issue.category.id if issue.category else None,
                "name": issue.category.name if issue.category else None
            } if issue.category else None,
            "images": [
                {
                    "id": img.id,
                    "image_url": img.image_url
                } for img in issue.images
            ] if issue.images else []
        }
        result.append(issue_dict)

    return result

def get_issue_completion_data_for_tenant(session: Session, user_id: int, issue_id: int):
    """Dohvati completion podatke za završeni issue (za stanare)"""
    
    # Provjera da li issue postoji i da li pripada korisniku
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Prijava nije pronađena.")
    
    if issue.tenant_id != user_id:
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup ovim podacima.")
    
    if issue.status != "Završeno":
        raise HTTPException(status_code=400, detail="Podaci o završetku su dostupni samo za završene prijave.")
    
    # Dohvati assignment za ovaj issue
    assignment = session.exec(
        select(Assignment).where(Assignment.issue_id == issue_id)
    ).first()
    
    if not assignment:
        return {
            "notes": [],
            "images": [],
            "warranty_pdf": None
        }
    
    # Ako je assignment Row objekt, ekstraktuj podatke
    if hasattr(assignment, '_mapping'):
        # Row sadrži Assignment objekt pod ključem 'Assignment'
        assignment_obj = assignment._mapping['Assignment']
        assignment_id = assignment_obj.id
        assignment_notes = assignment_obj.notes
    else:
        # SQLModel objekt
        assignment_id = assignment.id
        assignment_notes = assignment.notes
    
    if not assignment_id:
        return {
            "notes": [],
            "images": [],
            "warranty_pdf": None
        }
    
    completion_dir = f"media/assignments/{assignment_id}/completion"
    
    notes = []
    images = []
    warranty_pdf = None
    
    # Dohvati bilješke iz assignment-a
    if assignment_notes:
        notes.append(assignment_notes)
    
    # Dohvati slike i PDF iz filesystem-a
    if os.path.exists(completion_dir):
        for filename in os.listdir(completion_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                image_path = f"/media/assignments/{assignment_id}/completion/{filename}"
                images.append(image_path)
            elif filename.lower().endswith('.pdf') and filename.startswith('warranty_'):
                pdf_path = f"/media/assignments/{assignment_id}/completion/{filename}"
                warranty_pdf = pdf_path
    
    return {
        "notes": notes,
        "images": images,
        "warranty_pdf": warranty_pdf
    }

def get_issue_rejection_reason_for_tenant(session: Session, user_id: int, issue_id: int):
    """Dohvati razlog za odbijanje issue-a (za stanare)"""
    
    # Provjera da li issue postoji i da li pripada korisniku
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Prijava nije pronađena.")
    
    if issue.tenant_id != user_id:
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup ovim podacima.")
    
    if issue.status != "Odbijeno":
        raise HTTPException(status_code=400, detail="Razlog za odbijanje je dostupan samo za odbijene prijave.")
    
    # Dohvati assignment za ovaj issue
    assignment = session.exec(
        select(Assignment).where(Assignment.issue_id == issue_id)
    ).first()
    
    if not assignment:
        return {
            "rejection_reason": None
        }
    
    # Ako je assignment Row objekt, ekstraktuj podatke
    if hasattr(assignment, '_mapping'):
        # Row sadrži Assignment objekt pod ključem 'Assignment'
        assignment_obj = assignment._mapping['Assignment']
        rejection_reason = assignment_obj.rejection_reason
    else:
        # SQLModel objekt
        rejection_reason = assignment.rejection_reason
    
    return {
        "rejection_reason": rejection_reason
    }
