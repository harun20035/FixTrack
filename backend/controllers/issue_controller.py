from fastapi import APIRouter, Depends, status, UploadFile, File, Form, Request, HTTPException, Query, Body
from sqlmodel import Session
from database import engine
from services import issue_service
from schemas.issue_schema import IssueCreate, IssueRead, IssueCategoryRead, IssueStatusUpdate, HistoryIssue, HistoryStats, HistoryFilterParams
import jwt
import os
from typing import List
from services import comment_service
from schemas.comment_schema import CommentCreate, CommentRead
from services import rating_service
from schemas.rating_schema import RatingCreate, RatingRead

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

@router.post("/issues", response_model=IssueRead, status_code=status.HTTP_201_CREATED)
def create_issue(
    request: Request,
    session: Session = Depends(get_session),
    title: str = Form(...),
    description: str = Form(None),
    location: str = Form(None),
    category_id: int = Form(...),
    images: List[UploadFile] = File([]),
):
    tenant_id = get_current_user_id(request)
    data = IssueCreate(title=title, description=description, location=location, category_id=category_id)
    issue = issue_service.create_new_issue(session, tenant_id, data, images)
    return issue

@router.get("/issue-categories", response_model=List[IssueCategoryRead])
def get_categories(session: Session = Depends(get_session)):
    return issue_service.get_categories(session)

@router.get("/my-issues", response_model=List[IssueRead])
def get_my_issues(
    request: Request,
    session: Session = Depends(get_session),
    status: str = Query(None),
    category: str = Query(None),
    search: str = Query(None),
):
    user_id = get_current_user_id(request)
    filters = {"status": status, "category": category, "search": search}
    issues = issue_service.get_user_issues(session, user_id, filters)
    return issues

@router.patch("/issues/{issue_id}/status", response_model=IssueRead)
def update_issue_status(
    issue_id: int,
    data: IssueStatusUpdate,
    request: Request,
    session: Session = Depends(get_session),
):
    user_id = get_current_user_id(request)
    issue = issue_service.change_issue_status(session, user_id, issue_id, data.status)
    return issue

@router.delete("/issues/{issue_id}", response_model=None, status_code=204)
def delete_issue(
    issue_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    user_id = get_current_user_id(request)
    issue_service.delete_issue(session, user_id, issue_id)
    return

@router.put("/issues/{issue_id}", response_model=IssueRead)
def update_issue(
    issue_id: int,
    data: IssueCreate = Body(...),
    request: Request = None,
    session: Session = Depends(get_session),
):
    user_id = get_current_user_id(request)
    return issue_service.update_issue(session, user_id, issue_id, data)

@router.get("/issue-history", response_model=dict)
def get_issue_history(
    request: Request,
    session: Session = Depends(get_session),
    search: str = Query(None),
    category: str = Query(None),
    status: str = Query(None),
    date_from: str = Query(None),
    date_to: str = Query(None),
    sort_by: str = Query("created_at_desc"),
    page: int = Query(1),
    page_size: int = Query(10),
):
    user_id = get_current_user_id(request)
    filters = {"search": search, "category": category, "status": status, "date_from": date_from, "date_to": date_to, "sort_by": sort_by}
    issues, total = issue_service.get_user_issue_history(session, user_id, filters, page, page_size)
    return {"issues": issues, "total": total}

@router.get("/issue-history/stats", response_model=HistoryStats, response_model_by_alias=True)
def get_issue_history_stats(
    request: Request,
    session: Session = Depends(get_session),
):
    user_id = get_current_user_id(request)
    return issue_service.get_user_issue_history_stats(session, user_id)

@router.get("/issues/{issue_id}/comments", response_model=List[CommentRead])
def get_issue_comments(issue_id: int, session: Session = Depends(get_session)):
    return comment_service.get_issue_comments(session, issue_id)

@router.post("/issues/{issue_id}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def add_issue_comment(issue_id: int, data: CommentCreate, request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return comment_service.create_new_comment(session, user_id, issue_id, data)

@router.get("/issues/{issue_id}/rating", response_model=RatingRead | None)
def get_issue_rating(issue_id: int, request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return rating_service.get_rating_for_issue_and_user(session, issue_id, user_id)

@router.post("/issues/{issue_id}/rating", response_model=RatingRead)
def add_or_update_issue_rating(issue_id: int, data: RatingCreate, request: Request, session: Session = Depends(get_session)):
    user_id = get_current_user_id(request)
    return rating_service.create_or_update_rating(session, issue_id, user_id, data) 