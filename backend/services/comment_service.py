from sqlmodel import Session
from models import Comment, User
from repositories.comment_repository import create_comment, get_comments_for_issue
from schemas.comment_schema import CommentCreate, CommentRead

def create_new_comment(session: Session, user_id: int, issue_id: int, data: CommentCreate) -> Comment:
    comment = Comment(
        issue_id=issue_id,
        user_id=user_id,
        content=data.content,
    )
    return create_comment(session, comment)

def get_issue_comments(session: Session, issue_id: int):
    comments = get_comments_for_issue(session, issue_id)
    result = []
    for c in comments:
        user = session.get(User, c.user_id)
        result.append(CommentRead(
            id=c.id,
            issue_id=c.issue_id,
            user_id=c.user_id,
            content=c.content,
            created_at=c.created_at,
            user_name=user.full_name if user else None
        ))
    return result 