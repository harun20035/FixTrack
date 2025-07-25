from sqlmodel import Session, select
from models import Comment, User
from typing import List

def create_comment(session: Session, comment: Comment) -> Comment:
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

def get_comments_for_issue(session: Session, issue_id: int) -> List[Comment]:
    statement = select(Comment).where(Comment.issue_id == issue_id).order_by(Comment.created_at.asc())
    return list(session.exec(statement)) 