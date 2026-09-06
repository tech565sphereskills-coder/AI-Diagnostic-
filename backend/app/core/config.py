import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Diagnostic & Recommendation System"
    API_V1_STR: str = "/api"
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./sqlite.db"
    
    # JWT Authentication Settings
    JWT_SECRET_KEY: str = "supersecret_jwt_key_aid_system_2026_change_in_prod"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # AI Service Settings
    AI_API_KEY: str = ""
    AI_MODEL: str = "gpt-4o-mini"
    AI_BASE_URL: str = "https://api.openai.com/v1"
    USE_MOCK_AI: bool = True
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
