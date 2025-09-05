from sqlmodel import Session
from models.role_request_model import RoleRequest
from models.user_model import User
from models.role_model import Role
from repositories.role_request_repository import (
    create_role_request, get_role_requests, get_role_request_by_id,
    update_role_request_status, get_user_role_requests
)
from schemas.role_request_schema import RoleRequestCreate, RoleRequestUpdate, RoleRequestRead
from fastapi import HTTPException
from typing import List, Optional

def create_new_role_request(session: Session, user_id: int, data: RoleRequestCreate) -> RoleRequestRead:
    # Provjera da li korisnik postoji
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li tražena uloga postoji
    requested_role = session.get(Role, data.requested_role_id)
    if not requested_role:
        raise HTTPException(status_code=404, detail="Tražena uloga nije pronađena.")
    
    # Provjera da li korisnik već ima tu ulogu
    if user.role_id == data.requested_role_id:
        raise HTTPException(status_code=400, detail="Već imate tu ulogu.")
    
    # Provjera da li korisnik već ima pending zahtjev
    existing_requests = get_user_role_requests(session, user_id)
    for req in existing_requests:
        if req.status == "pending":
            raise HTTPException(status_code=400, detail="Već imate pending zahtjev za promjenu uloge.")
    
    # Kreiranje zahtjeva
    role_request = create_role_request(
        session, user_id, user.role_id, data.requested_role_id, data.motivation
    )
    
    # Dohvati podatke za response
    user = session.get(User, role_request.user_id)
    current_role = session.get(Role, role_request.current_role_id)
    requested_role = session.get(Role, role_request.requested_role_id)
    
    return RoleRequestRead(
        id=role_request.id,
        user_id=role_request.user_id,
        current_role_id=role_request.current_role_id,
        requested_role_id=role_request.requested_role_id,
        motivation=role_request.motivation,
        status=role_request.status,
        admin_notes=role_request.admin_notes,
        created_at=role_request.created_at,
        updated_at=role_request.updated_at,
        user_name=user.full_name,
        user_email=user.email,
        current_role_name=current_role.name,
        requested_role_name=requested_role.name
    )

def get_all_role_requests(session: Session, status: Optional[str] = None) -> List[RoleRequestRead]:
    requests = get_role_requests(session, status)
    result = []
    
    for req in requests:
        # Ručno dohvati role podatke
        current_role = session.get(Role, req.current_role_id)
        requested_role = session.get(Role, req.requested_role_id)
        
        result.append(RoleRequestRead(
            id=req.id,
            user_id=req.user_id,
            current_role_id=req.current_role_id,
            requested_role_id=req.requested_role_id,
            motivation=req.motivation,
            status=req.status,
            admin_notes=req.admin_notes,
            created_at=req.created_at,
            updated_at=req.updated_at,
            user_name=req.user.full_name,
            user_email=req.user.email,
            current_role_name=current_role.name if current_role else "Nepoznato",
            requested_role_name=requested_role.name if requested_role else "Nepoznato"
        ))
    
    return result

def update_role_request(session: Session, request_id: int, data: RoleRequestUpdate, admin_id: int) -> RoleRequestRead:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu odobravati zahtjeve.")
    
    # Provjera da li zahtjev postoji
    role_request = get_role_request_by_id(session, request_id)
    if not role_request:
        raise HTTPException(status_code=404, detail="Zahtjev nije pronađen.")
    
    # Provjera da li je zahtjev već obrađen
    if role_request.status != "pending":
        raise HTTPException(status_code=400, detail="Zahtjev je već obrađen.")
    
    # Ažuriranje statusa
    updated_request = update_role_request_status(session, request_id, data.status, data.admin_notes)
    
    # Ako je odobren, promijeni ulogu korisnika
    if data.status == "approved":
        user = session.get(User, role_request.user_id)
        if user:
            user.role_id = role_request.requested_role_id
            session.commit()
            session.refresh(user)
    
    # Dohvati podatke za response
    user = session.get(User, updated_request.user_id)
    current_role = session.get(Role, updated_request.current_role_id)
    requested_role = session.get(Role, updated_request.requested_role_id)
    
    return RoleRequestRead(
        id=updated_request.id,
        user_id=updated_request.user_id,
        current_role_id=updated_request.current_role_id,
        requested_role_id=updated_request.requested_role_id,
        motivation=updated_request.motivation,
        status=updated_request.status,
        admin_notes=updated_request.admin_notes,
        created_at=updated_request.created_at,
        updated_at=updated_request.updated_at,
        user_name=user.full_name,
        user_email=user.email,
        current_role_name=current_role.name,
        requested_role_name=requested_role.name
    )

def get_user_role_requests_service(session: Session, user_id: int) -> List[RoleRequestRead]:
    requests = get_user_role_requests(session, user_id)
    result = []
    
    for req in requests:
        # Ručno dohvati role podatke
        current_role = session.get(Role, req.current_role_id)
        requested_role = session.get(Role, req.requested_role_id)
        
        result.append(RoleRequestRead(
            id=req.id,
            user_id=req.user_id,
            current_role_id=req.current_role_id,
            requested_role_id=req.requested_role_id,
            motivation=req.motivation,
            status=req.status,
            admin_notes=req.admin_notes,
            created_at=req.created_at,
            updated_at=req.updated_at,
            user_name=req.user.full_name,
            user_email=req.user.email,
            current_role_name=current_role.name if current_role else "Nepoznato",
            requested_role_name=requested_role.name if requested_role else "Nepoznato"
        ))
    
    return result
