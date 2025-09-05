from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlmodel import Session
from database import engine
from services import admin_service, role_request_service, system_settings_service
from schemas.admin_schema import UserRead, UserUpdate, UserStats
from schemas.role_request_schema import RoleRequestCreate, RoleRequestUpdate, RoleRequestRead
from schemas.system_settings_schema import SystemSettingsUpdate, SystemSettingsRead
from models.role_model import Role
from typing import List, Optional
import jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"

def get_session():
    with Session(engine) as session:
        yield session

def get_current_user_id(request: Request) -> int:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Nedostaje token.")
    token = auth_header.split()[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Neispravan token.")

# ===== USER MANAGEMENT ENDPOINTS =====

@router.get("/api/admin/users", response_model=List[UserRead])
def get_all_users(
    request: Request,
    session: Session = Depends(get_session),
    search: Optional[str] = Query(None),
    role_id: Optional[int] = Query(None)
):
    """Dohvati sve korisnike (samo admin)"""
    try:
        user_id = get_current_user_id(request)
        users = admin_service.get_all_users_service(session, user_id, search, role_id)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/admin/users/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvati korisnika po ID (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        user = admin_service.get_user_by_id_service(session, user_id, admin_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/admin/users/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    request: Request,
    session: Session = Depends(get_session)
):
    """Ažuriraj korisnika (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        updated_user = admin_service.update_user_service(session, user_id, user_data, admin_id)
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/admin/users/{user_id}")
def delete_user(
    user_id: int,
    request: Request,
    session: Session = Depends(get_session)
):
    """Obriši korisnika (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        result = admin_service.delete_user_service(session, user_id, admin_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/admin/users/stats", response_model=UserStats)
def get_user_stats(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvati statistike korisnika (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        stats = admin_service.get_user_stats_service(session, admin_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== ROLE MANAGEMENT ENDPOINTS =====

@router.get("/api/admin/roles", response_model=List[Role])
def get_all_roles(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvati sve uloge (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        roles = admin_service.get_all_roles_service(session, admin_id)
        return roles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/admin/roles", response_model=Role)
def create_role(
    name: str,
    request: Request = None,
    session: Session = Depends(get_session)
):
    """Kreiraj novu ulogu (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        role = admin_service.create_role_service(session, name, admin_id)
        return role
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/admin/roles/{role_id}", response_model=Role)
def update_role(
    role_id: int,
    name: Optional[str] = None,
    request: Request = None,
    session: Session = Depends(get_session)
):
    """Ažuriraj ulogu (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        role = admin_service.update_role_service(session, role_id, name, admin_id)
        return role
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/admin/roles/{role_id}")
def delete_role(
    role_id: int,
    request: Request,
    session: Session = Depends(get_session)
):
    """Obriši ulogu (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        result = admin_service.delete_role_service(session, role_id, admin_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== ROLE REQUEST ENDPOINTS =====

@router.post("/api/role-requests", response_model=RoleRequestRead)
def create_role_request(
    request_data: RoleRequestCreate,
    request: Request,
    session: Session = Depends(get_session)
):
    """Kreiraj zahtjev za promjenu uloge"""
    try:
        user_id = get_current_user_id(request)
        role_request = role_request_service.create_new_role_request(session, user_id, request_data)
        return role_request
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/admin/role-requests", response_model=List[RoleRequestRead])
def get_all_role_requests(
    request: Request,
    session: Session = Depends(get_session),
    status: Optional[str] = Query(None)
):
    """Dohvati sve zahtjeve za promjenu uloge (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        requests = role_request_service.get_all_role_requests(session, status)
        return requests
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/admin/role-requests/{request_id}", response_model=RoleRequestRead)
def update_role_request(
    request_id: int,
    request_data: RoleRequestUpdate,
    request: Request,
    session: Session = Depends(get_session)
):
    """Ažuriraj status zahtjeva za promjenu uloge (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        updated_request = role_request_service.update_role_request(session, request_id, request_data, admin_id)
        return updated_request
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/role-requests/my", response_model=List[RoleRequestRead])
def get_my_role_requests(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvati moje zahtjeve za promjenu uloge"""
    try:
        user_id = get_current_user_id(request)
        requests = role_request_service.get_user_role_requests_service(session, user_id)
        return requests
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== SYSTEM SETTINGS ENDPOINTS =====

@router.get("/api/admin/settings", response_model=SystemSettingsRead)
def get_system_settings(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvati sistemske postavke (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        settings = system_settings_service.get_settings(session)
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/admin/settings", response_model=SystemSettingsRead)
def update_system_settings(
    settings_data: SystemSettingsUpdate,
    request: Request,
    session: Session = Depends(get_session)
):
    """Ažuriraj sistemske postavke (samo admin)"""
    try:
        admin_id = get_current_user_id(request)
        updated_settings = system_settings_service.update_settings(session, settings_data, admin_id)
        return updated_settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
