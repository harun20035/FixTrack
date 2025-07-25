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

    admin_notes: List["AdminNote"] = Relationship(
        back_populates="admin",
        sa_relationship_kwargs={"foreign_keys": "[AdminNote.admin_id]"}
    )
    tenant_notes: List["AdminNote"] = Relationship(
        back_populates="tenant",
        sa_relationship_kwargs={"foreign_keys": "[AdminNote.tenant_id]"}
    )
    notifications: List["Notification"] = Relationship(back_populates="user")