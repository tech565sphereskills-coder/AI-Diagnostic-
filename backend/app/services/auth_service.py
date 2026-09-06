from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.repositories.user_repository import UserRepository
from app.utils.exceptions import InvalidCredentialsException, ValidationFailedException

class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def register(self, user_in: UserCreate) -> User:
        if self.user_repo.get_by_email(user_in.email):
            raise ValidationFailedException(detail="Email is already registered")

        hashed_password = get_password_hash(user_in.password)
        new_user = User(
            name=user_in.name,
            email=user_in.email,
            password_hash=hashed_password,
            role="user",
            is_active=True
        )
        return self.user_repo.create(new_user)

    def authenticate(self, email: str, password: str) -> dict:
        user = self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise InvalidCredentialsException()

        if not user.is_active:
            raise ValidationFailedException(detail="Account is inactive")

        token = create_access_token(subject=user.id)
        return {
            "access_token": token,
            "token": token,
            "token_type": "bearer",
            "user": user
        }
