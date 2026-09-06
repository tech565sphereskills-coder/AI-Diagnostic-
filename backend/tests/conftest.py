import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.database import Base, get_db
from app.database.seed import seed_initial_data
from app.core.security import create_access_token

# In-memory SQLite DB engine for isolated testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    with TestingSessionLocal() as db:
        seed_initial_data(db)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session() -> Generator:
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()

@pytest.fixture
def client(db_session) -> Generator:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def user_headers(db_session) -> dict:
    from app.models.user import User
    user = db_session.query(User).filter(User.email == "user@example.com").first()
    token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers(db_session) -> dict:
    from app.models.user import User
    admin = db_session.query(User).filter(User.email == "admin@aidiagnostic.ng").first()
    token = create_access_token(subject=admin.id)
    return {"Authorization": f"Bearer {token}"}
