from fastapi import APIRouter, Request, Depends, HTTPException
from sqlmodel import Session
from database import engine
from services.dashboard_service import (
    get_tenant_dashboard_data,
    get_manager_dashboard_data,
    get_contractor_dashboard_data
)
from schemas.dashboard_schema import (
    TenantDashboardResponse,
    ManagerDashboardResponse,
    ContractorDashboardResponse
)
from models import User, Role
import jwt
import os

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
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Neispravan token.")
        return int(user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token je istekao.")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Neispravan token.")

def check_user_role(session: Session, user_id: int, required_role: str) -> bool:
    """Proverava da li korisnik ima potrebnu ulogu"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Uloga korisnika nije pronađena.")
    
    return required_role.lower() in role.name.lower()

@router.get("/tenant/dashboard", response_model=TenantDashboardResponse)
def get_tenant_dashboard(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvaća podatke za tenant dashboard"""
    user_id = get_current_user_id(request)
    
    # Proverava da li je korisnik tenant ili izvođač (jer izvođač može biti i stanar)
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or ("stanar" not in role.name.lower() and "izvođač" not in role.name.lower()):
        raise HTTPException(status_code=403, detail="Samo stanari i izvođači mogu pristupiti tenant dashboard-u.")
    
    return get_tenant_dashboard_data(session, user_id)

@router.get("/manager/dashboard", response_model=ManagerDashboardResponse)
def get_manager_dashboard(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvaća podatke za manager dashboard"""
    user_id = get_current_user_id(request)
    
    # Proverava da li je korisnik manager
    if not check_user_role(session, user_id, "upravnik"):
        raise HTTPException(status_code=403, detail="Samo upravnici mogu pristupiti manager dashboard-u.")
    
    return get_manager_dashboard_data(session, user_id)

@router.get("/contractor/dashboard", response_model=ContractorDashboardResponse)
def get_contractor_dashboard(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvaća podatke za contractor dashboard"""
    user_id = get_current_user_id(request)
    
    # Proverava da li je korisnik contractor
    if not check_user_role(session, user_id, "izvođač"):
        raise HTTPException(status_code=403, detail="Samo izvođači mogu pristupiti contractor dashboard-u.")
    
    return get_contractor_dashboard_data(session, user_id)

@router.get("/contractor/tenant-dashboard", response_model=TenantDashboardResponse)
def get_contractor_tenant_dashboard(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvaća tenant podatke za contractor (jer contractor može biti i stanar)"""
    user_id = get_current_user_id(request)
    
    # Proverava da li je korisnik contractor
    if not check_user_role(session, user_id, "izvođač"):
        raise HTTPException(status_code=403, detail="Samo izvođači mogu pristupiti ovim podacima.")
    
    return get_tenant_dashboard_data(session, user_id)
