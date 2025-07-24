from sqlmodel import Session, select
from models import Issue, IssueImage, IssueCategory
from typing import List, Optional

def create_issue(session: Session, issue: Issue) -> Issue:
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return issue

def add_issue_image(session: Session, image: IssueImage) -> IssueImage:
    session.add(image)
    session.commit()
    session.refresh(image)
    return image

def get_issue_categories(session: Session) -> List[IssueCategory]:
    statement = select(IssueCategory)
    return list(session.exec(statement)) 