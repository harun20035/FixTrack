from contextlib import asynccontextmanager
from typing import Annotated
from fastapi.staticfiles import StaticFiles
from database import engine
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from starlette.middleware.cors import CORSMiddleware
from controllers import user_controller, issue_controller, notification_controller, assignment_controller, assignment_notification_controller, admin_controller, application_controller, dashboard_controller, survey_controller
# Import all models to ensure they are registered with SQLModel
from models import *


def create_db_and_tables():
  SQLModel.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
  create_db_and_tables()
  yield
  print("Gašenje aplikacije")


def start_application():
  app = FastAPI(lifespan=lifespan)

  origins = ["*"]

  app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods= ["*"],
    allow_headers=["*"]
    )
  
  return app


app = start_application()

app.mount("/media", StaticFiles(directory="media"), name="media")

app.include_router(user_controller.router, prefix="/auth", tags=["auth"])
app.include_router(issue_controller.router, prefix="/api", tags=["issues"])
app.include_router(notification_controller.router, prefix="/api", tags=["notifications"])
app.include_router(assignment_controller.router, tags=["assignments"])
app.include_router(assignment_notification_controller.router, tags=["assignment-notifications"])
app.include_router(admin_controller.router, tags=["admin"])
app.include_router(application_controller.router, tags=["applications"])
app.include_router(dashboard_controller.router, prefix="/api", tags=["dashboard"])
app.include_router(survey_controller.router, prefix="/api", tags=["surveys"])