from sqlmodel import Session, select
from models import Survey, User
from typing import List, Optional

def create_survey(session: Session, survey_data: dict) -> Survey:
    """Kreira novu survey prijavu"""
    survey = Survey(**survey_data)
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey

def get_surveys_by_tenant(session: Session, tenant_id: int) -> List[Survey]:
    """Dohvaća sve survey prijave za određenog stanara"""
    statement = select(Survey).where(Survey.tenant_id == tenant_id).order_by(Survey.created_at.desc())
    return session.exec(statement).all()

def get_all_surveys(session: Session, limit: int = 50) -> List[Survey]:
    """Dohvaća sve survey prijave (za admin/manager)"""
    statement = select(Survey).order_by(Survey.created_at.desc()).limit(limit)
    return session.exec(statement).all()

def get_survey_by_id(session: Session, survey_id: int) -> Optional[Survey]:
    """Dohvaća survey po ID-u"""
    return session.get(Survey, survey_id)

def get_survey_stats(session: Session) -> dict:
    """Dohvaća statistike survey prijava"""
    from sqlmodel import func
    
    # Ukupno prijava
    total_surveys = session.exec(select(func.count(Survey.id))).first() or 0
    
    # Po nivoima zadovoljstva
    satisfaction_stats = {}
    satisfaction_levels = ["vrlo_zadovoljan", "zadovoljan", "neutralan", "nezadovoljan", "vrlo_nezadovoljan"]
    
    for level in satisfaction_levels:
        count = session.exec(
            select(func.count(Survey.id)).where(Survey.satisfaction_level == level)
        ).first() or 0
        satisfaction_stats[level] = count
    
    # Po kategorijama
    category_stats = {}
    categories = ["voda", "struja", "grijanje", "lift", "sigurnost", "čistoća", "komunikacija", "ostalo"]
    
    for category in categories:
        count = session.exec(
            select(func.count(Survey.id)).where(Survey.issue_category == category)
        ).first() or 0
        category_stats[category] = count
    
    return {
        "total_surveys": total_surveys,
        "satisfaction_stats": satisfaction_stats,
        "category_stats": category_stats
    }
