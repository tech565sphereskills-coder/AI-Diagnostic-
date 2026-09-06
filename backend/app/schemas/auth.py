from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.user import UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token: Optional[str] = None
    token_type: str = "bearer"
    user: UserResponse

class TokenPayload(BaseModel):
    sub: str
