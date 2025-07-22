from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role_id: int

    class Config:
        from_attributes = True

class RoleRead(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class UserProfileRead(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    created_at: datetime
    role: RoleRead

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    current_password: str | None = None
    new_password: str | None = None
    confirm_password: str | None = None 