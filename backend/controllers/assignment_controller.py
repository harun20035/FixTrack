from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlmodel import Session
from database import engine
from services import assignment_service
from schemas.assignment_schema import AssignmentUpdate, AssignmentReject
from typing import List
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

@router.get("/api/contractor/assignments")
def get_contractor_assignments(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvati sve assignment-e za trenutnog izvođača"""
    try:
        # Dohvati user_id iz tokena
        user_id = get_current_user_id(request)
        
        assignments = assignment_service.get_contractor_assignments(session, user_id)
        return {"success": True, "data": assignments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/contractor/assignments/{assignment_id}/status")
def update_assignment_status(
    assignment_id: int,
    status_update: AssignmentUpdate,
    request: Request,
    session: Session = Depends(get_session)
):
    """Ažuriraj status assignment-a"""
    try:
        user_id = get_current_user_id(request)
        
        result = assignment_service.update_assignment_status_service(
            session, assignment_id, user_id, status_update.status, status_update.notes
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/contractor/assignments/{assignment_id}/reject")
def reject_assignment(
    assignment_id: int,
    rejection: AssignmentReject,
    request: Request,
    session: Session = Depends(get_session)
):
    """Odbij assignment"""
    try:
        user_id = get_current_user_id(request)
        
        result = assignment_service.reject_assignment_service(
            session, assignment_id, user_id, rejection.rejection_reason
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/contractor/assignments/{assignment_id}/cost")
def update_assignment_cost(
    assignment_id: int,
    actual_cost: float = Form(...),
    request: Request = None,
    session: Session = Depends(get_session)
):
    """Ažuriraj troškove assignment-a"""
    try:
        user_id = get_current_user_id(request)
        
        result = assignment_service.update_assignment_cost_service(
            session, assignment_id, user_id, actual_cost
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/contractor/assignments/{assignment_id}/images")
async def upload_assignment_image(
    assignment_id: int,
    file: UploadFile = File(...),
    request: Request = None,
    session: Session = Depends(get_session)
):
    """Upload slike za assignment"""
    try:
        user_id = get_current_user_id(request)
        
        result = assignment_service.upload_assignment_image(
            session, assignment_id, user_id, file
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/contractor/assignments/{assignment_id}/documents")
async def upload_assignment_document(
    assignment_id: int,
    file: UploadFile = File(...),
    document_type: str = Form(...),
    request: Request = None,
    session: Session = Depends(get_session)
):
    """Upload dokumenta za assignment"""
    try:
        user_id = get_current_user_id(request)
        
        result = assignment_service.upload_assignment_document(
            session, assignment_id, user_id, file, document_type
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 