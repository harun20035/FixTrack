from fastapi import APIRouter, Request, Depends, HTTPException
from sqlmodel import Session
from database import engine
from services.survey_service import (
    create_survey_service,
    get_user_surveys_service,
    get_all_surveys_service,
    get_survey_stats_service
)
from schemas.survey_schema import SurveyCreate, SurveyRead, SurveyResponse
from typing import List
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

@router.post("/surveys", response_model=SurveyResponse, status_code=201)
def create_survey_endpoint(
    survey_data: SurveyCreate,
    request: Request,
    session: Session = Depends(get_session)
):
    """Kreira novu survey prijavu"""
    user_id = get_current_user_id(request)
    return create_survey_service(session, user_id, survey_data)

@router.get("/surveys/my", response_model=List[SurveyRead])
def get_my_surveys(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvaća sve survey prijave trenutnog korisnika"""
    user_id = get_current_user_id(request)
    return get_user_surveys_service(session, user_id)

@router.get("/surveys/all", response_model=List[SurveyRead])
def get_all_surveys_endpoint(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvaća sve survey prijave (samo za admin/manager)"""
    user_id = get_current_user_id(request)
    return get_all_surveys_service(session, user_id)

@router.get("/surveys/stats")
def get_survey_stats_endpoint(
    request: Request,
    session: Session = Depends(get_session)
):
    """Dohvaća statistike survey prijava (samo za admin/manager)"""
    user_id = get_current_user_id(request)
    return get_survey_stats_service(session, user_id)
