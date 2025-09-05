from sqlmodel import Session
from repositories.survey_repository import (
    create_survey,
    get_surveys_by_tenant,
    get_all_surveys,
    get_survey_by_id,
    get_survey_stats
)
from schemas.survey_schema import SurveyCreate, SurveyRead, SurveyResponse
from models import User, Role
from fastapi import HTTPException
from typing import List

def create_survey_service(session: Session, user_id: int, survey_data: SurveyCreate) -> SurveyResponse:
    """Kreira novu survey prijavu"""
    
    # Provjera da li korisnik postoji
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li je korisnik stanar
    role = session.get(Role, user.role_id)
    if not role or "stanar" not in role.name.lower():
        raise HTTPException(status_code=403, detail="Samo stanari mogu slati prijave nezadovoljstva.")
    
    # Kreiranje survey objekta
    survey_dict = {
        "tenant_id": user_id,
        "satisfaction_level": survey_data.satisfaction_level,
        "issue_category": survey_data.issue_category,
        "description": survey_data.description,
        "suggestions": survey_data.suggestions,
        "contact_preference": survey_data.contact_preference
    }
    
    survey = create_survey(session, survey_dict)
    
    return SurveyResponse(
        message="Vaša prijava nezadovoljstva je uspješno poslana.",
        survey_id=survey.id
    )

def get_user_surveys_service(session: Session, user_id: int) -> List[SurveyRead]:
    """Dohvaća sve survey prijave korisnika"""
    
    # Provjera da li korisnik postoji
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    surveys = get_surveys_by_tenant(session, user_id)
    
    return [
        SurveyRead(
            id=survey.id,
            tenant_id=survey.tenant_id,
            issue_id=survey.issue_id,
            satisfaction_level=survey.satisfaction_level,
            issue_category=survey.issue_category,
            description=survey.description,
            suggestions=survey.suggestions,
            contact_preference=survey.contact_preference,
            created_at=survey.created_at
        )
        for survey in surveys
    ]

def get_all_surveys_service(session: Session, user_id: int) -> List[SurveyRead]:
    """Dohvaća sve survey prijave (samo za admin/manager)"""
    
    # Provjera da li je korisnik admin ili manager
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or ("admin" not in role.name.lower() and "upravnik" not in role.name.lower()):
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup ovim podacima.")
    
    surveys = get_all_surveys(session)
    
    return [
        SurveyRead(
            id=survey.id,
            tenant_id=survey.tenant_id,
            issue_id=survey.issue_id,
            satisfaction_level=survey.satisfaction_level,
            issue_category=survey.issue_category,
            description=survey.description,
            suggestions=survey.suggestions,
            contact_preference=survey.contact_preference,
            created_at=survey.created_at
        )
        for survey in surveys
    ]

def get_survey_stats_service(session: Session, user_id: int) -> dict:
    """Dohvaća statistike survey prijava (samo za admin/manager)"""
    
    # Provjera da li je korisnik admin ili manager
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or ("admin" not in role.name.lower() and "upravnik" not in role.name.lower()):
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup ovim podacima.")
    
    return get_survey_stats(session)
