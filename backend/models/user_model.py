from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role_id: int = Field(foreign_key="role.id")
    full_name: str = Field(max_length=100)
    email: str = Field(index=True, unique=True, max_length=100)
    password_hash: str
    phone: Optional[str] = Field(default=None, max_length=20)
    address: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    role: Optional["Role"] = Relationship(back_populates="users")
    # Ostale relacije (npr. issues, comments...) dodajemo kasnije 