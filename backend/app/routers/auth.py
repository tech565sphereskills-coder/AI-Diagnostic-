from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    """
    auth_service = AuthService(db)
    return auth_service.register(user_in)

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user credentials and return JWT bearer token.
    """
    auth_service = AuthService(db)
    return auth_service.authenticate(credentials.email, credentials.password)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user profile.
    """
    return current_user
