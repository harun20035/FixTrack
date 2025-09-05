from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Survey(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int = Field(foreign_key="user.id")
    issue_id: Optional[int] = Field(default=None, foreign_key="issue.id")  # Optional jer može biti generalna prijava
    satisfaction_level: str = Field(max_length=50)  # vrlo_zadovoljan, zadovoljan, neutralan, nezadovoljan, vrlo_nezadovoljan
    issue_category: str = Field(max_length=50)  # voda, struja, grijanje, lift, sigurnost, čistoća, komunikacija, ostalo
    description: str
    suggestions: Optional[str] = None
    contact_preference: str = Field(default="no", max_length=10)  # yes, no
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tenant: Optional["User"] = Relationship()
    issue: Optional["Issue"] = Relationship() 