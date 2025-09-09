from sqlmodel import Session, select
from repositories.survey_repository import (
    create_survey,
    get_surveys_by_tenant,
    get_all_surveys,
    get_survey_by_id,
    get_survey_stats
)
from schemas.survey_schema import SurveyCreate, SurveyRead, SurveyResponse
from models import User, Role, Survey
from fastapi import HTTPException
from typing import List

def create_survey_service(session: Session, user_id: int, survey_data: SurveyCreate) -> SurveyResponse:
    """Kreira novu survey prijavu"""
    
    # Provjera da li korisnik postoji
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    # Provjera da li je korisnik stanar ili izvođač
    role = session.get(Role, user.role_id)
    if not role or ("stanar" not in role.name.lower() and "izvođač" not in role.name.lower()):
        raise HTTPException(status_code=403, detail="Samo stanari i izvođači mogu slati prijave nezadovoljstva.")
    
    # Kreiranje survey objekta
    survey_dict = {
        "tenant_id": user_id,  # tenant_id se koristi za sve korisnike (stanari i izvođači)
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

def get_all_surveys_service(session: Session, user_id: int) -> List[dict]:
    """Dohvaća sve survey prijave (samo za admin/manager)"""
    
    # Provjera da li je korisnik admin ili manager
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or ("admin" not in role.name.lower() and "upravnik" not in role.name.lower()):
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup ovim podacima.")
    
    # Dohvati survey-e sa tenant podacima
    statement = select(Survey, User).join(User, Survey.tenant_id == User.id).order_by(Survey.created_at.desc())
    results = session.exec(statement).all()
    
    surveys_with_tenant = []
    for survey, tenant in results:
        survey_dict = {
            "id": survey.id,
            "tenant_id": survey.tenant_id,
            "issue_id": survey.issue_id,
            "satisfaction_level": survey.satisfaction_level,
            "issue_category": survey.issue_category,
            "description": survey.description,
            "suggestions": survey.suggestions,
            "contact_preference": survey.contact_preference,
            "created_at": survey.created_at,
            "tenant": {
                "id": tenant.id,
                "full_name": tenant.full_name,
                "email": tenant.email
            }
        }
        surveys_with_tenant.append(survey_dict)
    
    return surveys_with_tenant

def get_survey_stats_service(session: Session, user_id: int) -> dict:
    """Dohvaća statistike survey prijava (samo za admin/manager)"""
    
    # Provjera da li je korisnik admin ili manager
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    role = session.get(Role, user.role_id)
    if not role or ("admin" not in role.name.lower() and "upravnik" not in role.name.lower()):
        raise HTTPException(status_code=403, detail="Nemate dozvolu za pristup ovim podacima.")
    
    stats = get_survey_stats(session)
    
    # Preimenuj satisfaction_stats u satisfaction_levels
    return {
        "total_surveys": stats["total_surveys"],
        "satisfaction_levels": stats["satisfaction_stats"],
        "categories": stats["category_stats"]
    }
