from sqlmodel import Session, select
from models import Rating
from typing import Optional

def create_or_update_rating(session: Session, issue_id: int, tenant_id: int, score: int, comment: Optional[str] = None) -> Rating:
    statement = select(Rating).where(Rating.issue_id == issue_id, Rating.tenant_id == tenant_id)
    rating = session.exec(statement).first()
    if rating:
        rating.score = score
        rating.comment = comment
    else:
        rating = Rating(issue_id=issue_id, tenant_id=tenant_id, score=score, comment=comment)
        session.add(rating)
    session.commit()
    session.refresh(rating)
    return rating

def get_rating_for_issue_and_user(session: Session, issue_id: int, tenant_id: int) -> Optional[Rating]:
    statement = select(Rating).where(Rating.issue_id == issue_id, Rating.tenant_id == tenant_id)
    return session.exec(statement).first() 