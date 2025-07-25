from sqlmodel import Session
from repositories.rating_repository import create_or_update_rating as repo_create_or_update_rating, get_rating_for_issue_and_user as repo_get_rating_for_issue_and_user
from schemas.rating_schema import RatingCreate, RatingRead

def create_or_update_rating(session: Session, issue_id: int, tenant_id: int, data: RatingCreate):
    rating = repo_create_or_update_rating(session, issue_id, tenant_id, data.score, data.comment)
    return RatingRead.from_orm(rating)

def get_rating_for_issue_and_user(session: Session, issue_id: int, tenant_id: int):
    rating = repo_get_rating_for_issue_and_user(session, issue_id, tenant_id)
    if rating:
        return RatingRead.from_orm(rating)
    return None 