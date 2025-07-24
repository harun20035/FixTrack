from fastapi import APIRouter, Depends, status, UploadFile, File, Form, Request, HTTPException
from sqlmodel import Session
from database import engine
from services import issue_service
from schemas.issue_schema import IssueCreate, IssueRead, IssueCategoryRead
import jwt
import os
from typing import List

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