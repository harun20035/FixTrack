from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class RoleRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    current_role_id: int = Field(foreign_key="role.id")
    requested_role_id: int = Field(foreign_key="role.id")
    motivation: str
    status: str = Field(default="pending", max_length=20)  # pending, approved, rejected
    admin_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship()
    current_role: Optional["Role"] = Relationship(
        back_populates=None,
        sa_relationship_kwargs={"foreign_keys": "[RoleRequest.current_role_id]"}
    )
    requested_role: Optional["Role"] = Relationship(
        back_populates=None,
        sa_relationship_kwargs={"foreign_keys": "[RoleRequest.requested_role_id]"}
    )
