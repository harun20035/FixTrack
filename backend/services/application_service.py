from sqlmodel import Session, select
from models.role_request_model import RoleRequest
from models.user_model import User
from models.role_model import Role
from schemas.application_schema import ContractorApplicationCreate, ManagerApplicationCreate, ApplicationResponse, ApplicationStatus
from schemas.role_request_schema import RoleRequestCreate
from services.role_request_service import create_new_role_request
from fastapi import HTTPException
from typing import Optional
import os
import shutil
from fastapi import UploadFile

def save_application_file(upload_file: UploadFile, user_id: int, application_type: str) -> str:
    """Spremi fajl aplikacije u media folder"""
    upload_dir = os.path.join("media", "applications", str(user_id))
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generiši ime fajla
    file_extension = upload_file.filename.split('.')[-1] if '.' in upload_file.filename else 'pdf'
    filename = f"{application_type}_application.{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    # Spremi fajl
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return f"applications/{user_id}/{filename}"

def check_existing_application(session: Session, user_id: int) -> Optional[RoleRequest]:
    """Provjeri da li korisnik već ima pending aplikaciju"""
    statement = select(RoleRequest).where(
        RoleRequest.user_id == user_id,
        RoleRequest.status == "pending"
    )
    return session.exec(statement).first()

def get_user_role_name(session: Session, role_id: int) -> str:
    """Dohvati ime role po ID-u"""
    role = session.get(Role, role_id)
    return role.name if role else "Unknown"

def submit_contractor_application(
    session: Session, 
    user_id: int, 
    data: ContractorApplicationCreate,
    experience_file: Optional[UploadFile] = None
) -> ApplicationResponse:
    """Pošalji aplikaciju za izvođača"""
    
    # Provjeri da li korisnik već ima pending aplikaciju
    existing_application = check_existing_application(session, user_id)
    if existing_application:
        raise HTTPException(
            status_code=400, 
            detail="Već imate pending aplikaciju. Molimo sačekajte da se trenutna aplikacija obradi."
        )
    
    # Provjeri da li korisnik već nije izvođač
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    user_role = session.get(Role, user.role_id)
    if user_role and "izvođač" in user_role.name.lower():
        raise HTTPException(
            status_code=400, 
            detail="Već ste izvođač. Ne možete poslati novu aplikaciju."
        )
    
    # Dohvati ID za izvođača rolu
    contractor_role = session.exec(select(Role).where(Role.name == "Izvođač")).first()
    if not contractor_role:
        raise HTTPException(status_code=500, detail="Izvođač rola nije pronađena.")
    
    # Spremi fajl ako je priložen
    file_url = None
    if experience_file:
        file_url = save_application_file(experience_file, user_id, "contractor")
    
    # Kreiraj motivation text koji kombinuje sve podatke
    motivation = f"""MOTIVACIONO PISMO:
{data.motivation_letter}

RAZLOG ZA POSTAJANJE IZVOĐAČA:
{data.reason_for_becoming_contractor}

CV/ISKUSTVO: {'Priložen' if file_url else 'Nije priložen'}
"""
    
    # Kreiraj role request
    role_request_data = RoleRequestCreate(
        requested_role_id=contractor_role.id,
        motivation=motivation
    )
    
    try:
        role_request = create_new_role_request(session, user_id, role_request_data, file_url)
        
        return ApplicationResponse(
            success=True,
            message="Vaša aplikacija za izvođača je uspješno poslana! Admin će pregledati vašu aplikaciju u roku od 3-5 radnih dana.",
            role_request_id=role_request.id,
            redirect_url="/dashboard"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri slanju aplikacije: {str(e)}")

def submit_manager_application(
    session: Session, 
    user_id: int, 
    data: ManagerApplicationCreate,
    experience_file: Optional[UploadFile] = None
) -> ApplicationResponse:
    """Pošalji aplikaciju za upravnika"""
    
    # Provjeri da li korisnik već ima pending aplikaciju
    existing_application = check_existing_application(session, user_id)
    if existing_application:
        raise HTTPException(
            status_code=400, 
            detail="Već imate pending aplikaciju. Molimo sačekajte da se trenutna aplikacija obradi."
        )
    
    # Provjeri da li korisnik već nije upravnik
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    user_role = session.get(Role, user.role_id)
    if user_role and "upravnik" in user_role.name.lower():
        raise HTTPException(
            status_code=400, 
            detail="Već ste upravnik. Ne možete poslati novu aplikaciju."
        )
    
    # Dohvati ID za upravnika rolu
    manager_role = session.exec(select(Role).where(Role.name == "Upravnik")).first()
    if not manager_role:
        raise HTTPException(status_code=500, detail="Upravnik rola nije pronađena.")
    
    # Spremi fajl ako je priložen
    file_url = None
    if experience_file:
        file_url = save_application_file(experience_file, user_id, "manager")
    
    # Kreiraj motivation text koji kombinuje sve podatke
    motivation = f"""MOTIVACIONO PISMO:
{data.motivation_letter}

ISKUSTVO U UPRAVLJANJU:
{data.management_experience}

PLANOVI ZA UPRAVLJANJE ZGRADAMA:
{data.building_management_plans}

CV/ISKUSTVO: {'Priložen' if file_url else 'Nije priložen'}

POTVRDA PROMJENE ULOGE: {'Prihvaćeno' if data.accept_role_change else 'Nije prihvaćeno'}
"""
    
    # Kreiraj role request
    role_request_data = RoleRequestCreate(
        requested_role_id=manager_role.id,
        motivation=motivation
    )
    
    try:
        role_request = create_new_role_request(session, user_id, role_request_data, file_url)
        
        return ApplicationResponse(
            success=True,
            message="Vaša aplikacija za upravnika je uspješno poslana! Admin će pregledati vašu aplikaciju u roku od 3-5 radnih dana.",
            role_request_id=role_request.id,
            redirect_url="/dashboard"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri slanju aplikacije: {str(e)}")

def get_application_status(session: Session, user_id: int) -> ApplicationStatus:
    """Dohvati status aplikacije korisnika"""
    
    try:
        # Provjeri da li korisnik ima pending aplikaciju
        pending_application = check_existing_application(session, user_id)
        if pending_application:
            # Odredi tip aplikacije na osnovu requested role
            requested_role = session.get(Role, pending_application.requested_role_id)
            application_type = None
            if requested_role:
                if "izvođač" in requested_role.name.lower():
                    application_type = "contractor"
                elif "upravnik" in requested_role.name.lower():
                    application_type = "manager"
            
            return ApplicationStatus(
                has_pending_application=True,
                application_type=application_type,
                status=pending_application.status,
                submitted_at=pending_application.created_at
            )
        
        # Provjeri da li korisnik ima odobrenu aplikaciju
        user = session.get(User, user_id)
        if user:
            user_role = session.get(Role, user.role_id)
            if user_role:
                if "izvođač" in user_role.name.lower():
                    return ApplicationStatus(
                        has_pending_application=False,
                        application_type="contractor",
                        status="approved"
                    )
                elif "upravnik" in user_role.name.lower():
                    return ApplicationStatus(
                        has_pending_application=False,
                        application_type="manager", 
                        status="approved"
                    )
        
        return ApplicationStatus(
            has_pending_application=False,
            application_type=None,
            status=None
        )
    except Exception as e:
        print(f"Error in get_application_status: {e}")
        # Vrati default status ako dođe do greške
        return ApplicationStatus(
            has_pending_application=False,
            application_type=None,
            status=None
        )
