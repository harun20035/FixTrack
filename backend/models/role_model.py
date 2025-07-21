from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Role(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True, max_length=50)

    users: List["User"] = Relationship(back_populates="role") 