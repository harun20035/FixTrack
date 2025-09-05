from sqlmodel import Session, select
from models.user_model import User
from models.role_model import Role
from repositories.admin_repository import (
    get_all_users, get_user_by_id, update_user, delete_user, get_user_stats,
    get_all_roles, create_role, update_role, delete_role
)
from schemas.admin_schema import UserRead, UserUpdate, UserStats
from fastapi import HTTPException
from typing import List, Optional

def get_all_users_service(session: Session, admin_id: int, search: Optional[str] = None, role_id: Optional[int] = None) -> List[UserRead]:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu pristupiti ovim podacima.")
    
    users = get_all_users(session, search, role_id)
    result = []
    
    for user in users:
        result.append(UserRead(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            address=user.address,
            role_id=user.role_id,
            role_name=user.role.name,
            created_at=user.created_at
        ))
    
    return result

def get_user_by_id_service(session: Session, user_id: int, admin_id: int) -> UserRead:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu pristupiti ovim podacima.")
    
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    return UserRead(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        address=user.address,
        role_id=user.role_id,
        role_name=user.role.name,
        created_at=user.created_at
    )

def update_user_service(session: Session, user_id: int, data: UserUpdate, admin_id: int) -> UserRead:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu mijenjati korisnike.")
    
    # Provjera da li korisnik postoji
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li nova uloga postoji
    if data.role_id:
        new_role = session.get(Role, data.role_id)
        if not new_role:
            raise HTTPException(status_code=404, detail="Uloga nije pronađena.")
    
    # Ažuriranje korisnika
    updated_user = update_user(session, user_id, **data.dict(exclude_unset=True))
    
    # Refresh user sa novom ulogom
    session.refresh(updated_user)
    
    return UserRead(
        id=updated_user.id,
        full_name=updated_user.full_name,
        email=updated_user.email,
        phone=updated_user.phone,
        address=updated_user.address,
        role_id=updated_user.role_id,
        role_name=updated_user.role.name,
        created_at=updated_user.created_at
    )

def delete_user_service(session: Session, user_id: int, admin_id: int) -> dict:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu brisati korisnike.")
    
    # Provjera da li korisnik postoji
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li admin pokušava obrisati sebe
    if user_id == admin_id:
        raise HTTPException(status_code=400, detail="Ne možete obrisati svoj nalog.")
    
    # Brisanje korisnika
    success = delete_user(session, user_id)
    if not success:
        raise HTTPException(status_code=500, detail="Greška pri brisanju korisnika.")
    
    return {"message": "Korisnik je uspješno obrisan."}

def get_user_stats_service(session: Session, admin_id: int) -> UserStats:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu pristupiti ovim podacima.")
    
    stats = get_user_stats(session)
    
    return UserStats(
        total_users=stats["total_users"],
        active_users=stats["total_users"],  # Za sada svi su aktivni
        users_by_role=stats["users_by_role"],
        recent_registrations=stats["recent_registrations"]
    )

def get_all_roles_service(session: Session, admin_id: int) -> List[Role]:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu pristupiti ovim podacima.")
    
    return get_all_roles(session)

def create_role_service(session: Session, name: str, admin_id: int) -> Role:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu kreirati uloge.")
    
    # Provjera da li uloga već postoji
    existing_role = session.exec(select(Role).where(Role.name == name)).first()
    if existing_role:
        raise HTTPException(status_code=400, detail="Uloga sa tim imenom već postoji.")
    
    return create_role(session, name)

def update_role_service(session: Session, role_id: int, name: Optional[str], admin_id: int) -> Role:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu mijenjati uloge.")
    
    # Provjera da li uloga postoji
    role = session.get(Role, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Uloga nije pronađena.")
    
    # Provjera da li novo ime već postoji
    if name and name != role.name:
        existing_role = session.exec(select(Role).where(Role.name == name)).first()
        if existing_role:
            raise HTTPException(status_code=400, detail="Uloga sa tim imenom već postoji.")
    
    return update_role(session, role_id, name)

def delete_role_service(session: Session, role_id: int, admin_id: int) -> dict:
    # Provjera da li je korisnik admin
    admin_user = session.get(User, admin_id)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin korisnik nije pronađen.")
    
    admin_role = session.get(Role, admin_user.role_id)
    if not admin_role or "admin" not in admin_role.name.lower():
        raise HTTPException(status_code=403, detail="Samo administratori mogu brisati uloge.")
    
    # Provjera da li uloga postoji
    role = session.get(Role, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Uloga nije pronađena.")
    
    # Provjera da li admin pokušava obrisati svoju ulogu
    if role_id == admin_user.role_id:
        raise HTTPException(status_code=400, detail="Ne možete obrisati svoju ulogu.")
    
    # Brisanje uloge
    success = delete_role(session, role_id)
    if not success:
        raise HTTPException(status_code=400, detail="Ne možete obrisati ulogu koja je dodijeljena korisnicima.")
    
    return {"message": "Uloga je uspješno obrisana."}
