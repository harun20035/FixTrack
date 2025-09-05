from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, File, Form
from sqlmodel import Session
from database import engine
from services.application_service import (
    submit_contractor_application, 
    submit_manager_application, 
    get_application_status
)
from schemas.application_schema import (
    ContractorApplicationCreate, 
    ManagerApplicationCreate, 
    ApplicationResponse, 
    ApplicationStatus
)
import json

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

def get_current_user_id(request: Request) -> int:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Nedostaje token.")
    
    token = auth_header.split(" ")[1]
    try:
        import jwt
        import os
        SECRET_KEY = os.getenv("SECRET_KEY", "secret")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token je istekao.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Neispravan token.")

@router.post("/api/contractor-application", response_model=ApplicationResponse)
async def submit_contractor_application_endpoint(
    request: Request,
    session: Session = Depends(get_session),
    motivation_letter: str = Form(...),
    reason_for_becoming_contractor: str = Form(...),
    accept_terms: str = Form(...),
    experience_file: UploadFile = File(None)
):
    """Pošalji aplikaciju za izvođača"""
    try:
        user_id = get_current_user_id(request)
        
        # Konvertuj accept_terms string u boolean
        accept_terms_bool = accept_terms.lower() == "true"
        
        # Kreiraj data objekt
        data = ContractorApplicationCreate(
            motivation_letter=motivation_letter,
            reason_for_becoming_contractor=reason_for_becoming_contractor,
            accept_terms=accept_terms_bool
        )
        
        # Validacija
        if not data.accept_terms:
            raise HTTPException(status_code=400, detail="Morate prihvatiti uslove korišćenja.")
        
        if len(data.motivation_letter.strip()) < 50:
            raise HTTPException(status_code=400, detail="Motivaciono pismo mora imati najmanje 50 karaktera.")
        
        if len(data.reason_for_becoming_contractor.strip()) < 20:
            raise HTTPException(status_code=400, detail="Razlog mora imati najmanje 20 karaktera.")
        
        # Validacija fajla ako je priložen
        if experience_file:
            if experience_file.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail="Dozvoljen je samo PDF format.")
            if experience_file.size > 10 * 1024 * 1024:  # 10MB
                raise HTTPException(status_code=400, detail="Fajl ne može biti veći od 10MB.")
        
        result = submit_contractor_application(session, user_id, data, experience_file)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri slanju aplikacije: {str(e)}")

@router.post("/api/manager-application", response_model=ApplicationResponse)
async def submit_manager_application_endpoint(
    request: Request,
    session: Session = Depends(get_session),
    motivation_letter: str = Form(...),
    management_experience: str = Form(...),
    building_management_plans: str = Form(...),
    accept_terms: str = Form(...),
    accept_role_change: str = Form(...),
    experience_file: UploadFile = File(None)
):
    """Pošalji aplikaciju za upravnika"""
    try:
        user_id = get_current_user_id(request)
        
        # Konvertuj stringove u boolean
        accept_terms_bool = accept_terms.lower() == "true"
        accept_role_change_bool = accept_role_change.lower() == "true"
        
        # Kreiraj data objekt
        data = ManagerApplicationCreate(
            motivation_letter=motivation_letter,
            management_experience=management_experience,
            building_management_plans=building_management_plans,
            accept_terms=accept_terms_bool,
            accept_role_change=accept_role_change_bool
        )
        
        # Validacija
        if not data.accept_terms:
            raise HTTPException(status_code=400, detail="Morate prihvatiti uslove korišćenja.")
        
        if not data.accept_role_change:
            raise HTTPException(status_code=400, detail="Morate potvrditi da prihvatate promjenu uloge.")
        
        if len(data.motivation_letter.strip()) < 50:
            raise HTTPException(status_code=400, detail="Motivaciono pismo mora imati najmanje 50 karaktera.")
        
        if len(data.management_experience.strip()) < 50:
            raise HTTPException(status_code=400, detail="Iskustvo u upravljanju mora imati najmanje 50 karaktera.")
        
        if len(data.building_management_plans.strip()) < 50:
            raise HTTPException(status_code=400, detail="Planovi za upravljanje zgradama moraju imati najmanje 50 karaktera.")
        
        # Validacija fajla ako je priložen
        if experience_file:
            if experience_file.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail="Dozvoljen je samo PDF format.")
            if experience_file.size > 10 * 1024 * 1024:  # 10MB
                raise HTTPException(status_code=400, detail="Fajl ne može biti veći od 10MB.")
        
        result = submit_manager_application(session, user_id, data, experience_file)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri slanju aplikacije: {str(e)}")

@router.get("/api/application-status", response_model=ApplicationStatus)
def get_application_status_endpoint(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvati status aplikacije korisnika"""
    try:
        user_id = get_current_user_id(request)
        print(f"Getting application status for user_id: {user_id}")
        status = get_application_status(session, user_id)
        print(f"Application status: {status}")
        return status
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_application_status_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Greška pri dohvatanju statusa: {str(e)}")
