"""
SENTINEL_ONE — Backend Integration Tests
Tests authentication, infrastructure management, and incident flows.
"""
import uuid

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.database import Base, get_db
from main import app

# ── In-memory SQLite test database ──────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test_sentinel.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True, scope="session")
def setup_db():
    """Create and seed test DB once per session."""
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


# ── Health ────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_root(client):
    r = await client.get("/")
    assert r.status_code == 200
    assert "Sentinel" in r.json()["status"]


# ── Authentication ───────────────────────────────────────────────

@pytest.mark.asyncio
async def test_signup_creates_user(client):
    r = await client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "securepass123",
        "full_name": "Test User",
        "role": "user"
    })
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "user"


@pytest.mark.asyncio
async def test_signup_duplicate_email_fails(client):
    await client.post("/api/auth/signup", json={
        "email": "dupe@example.com",
        "password": "securepass123",
        "full_name": "Dupe User",
        "role": "user"
    })
    r = await client.post("/api/auth/signup", json={
        "email": "dupe@example.com",
        "password": "securepass123",
        "full_name": "Dupe User 2",
        "role": "user"
    })
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_login_success(client):
    # Signup first
    await client.post("/api/auth/signup", json={
        "email": "login_test@example.com",
        "password": "securepass123",
        "full_name": "Login User",
        "role": "user"
    })
    r = await client.post("/api/auth/login", json={
        "email": "login_test@example.com",
        "password": "securepass123"
    })
    assert r.status_code == 200
    assert "access_token" in r.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    await client.post("/api/auth/signup", json={
        "email": "wrongpass@example.com",
        "password": "correct123",
        "full_name": "Wrong Pass",
        "role": "user"
    })
    r = await client.post("/api/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "wrongpassword"
    })
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_me_returns_user(client):
    signup = await client.post("/api/auth/signup", json={
        "email": "me_test@example.com",
        "password": "securepass123",
        "full_name": "Me User",
        "role": "user"
    })
    token = signup.json()["access_token"]
    r = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "me_test@example.com"


@pytest.mark.asyncio
async def test_me_without_token_fails(client):
    r = await client.get("/api/auth/me")
    assert r.status_code == 401


# ── Infrastructure ───────────────────────────────────────────────

@pytest.fixture
async def auth_token(client):
    """Returns a user JWT token for use in tests."""
    email = f"infra_{uuid.uuid4().hex[:12]}@example.com"
    r = await client.post("/api/auth/signup", json={
        "email": email,
        "password": "securepass123",
        "full_name": "Infra User",
        "role": "user"
    })
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.mark.asyncio
async def test_connect_service(client, auth_token):
    r = await client.post("/api/infrastructure/connect",
        json={"name": "Checkout API", "url": "https://api.example.com", "environment": "production"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert r.status_code == 200
    assert r.json()["name"] == "Checkout API"


@pytest.mark.asyncio
async def test_list_services_only_own(client, auth_token):
    r = await client.get("/api/infrastructure/services",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert r.status_code == 200
    assert isinstance(r.json(), list)


@pytest.mark.asyncio
async def test_delete_service(client, auth_token):
    # Create service
    create = await client.post("/api/infrastructure/connect",
        json={"name": "DeleteMe API", "url": "https://delete.example.com", "environment": "staging"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    service_id = create.json()["id"]

    # Delete it
    r = await client.delete(f"/api/infrastructure/services/{service_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert r.status_code == 200

    # Verify gone
    services = await client.get("/api/infrastructure/services",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    ids = [s["id"] for s in services.json()]
    assert service_id not in ids


@pytest.mark.asyncio
async def test_delete_other_users_service_fails(client):
    """A user cannot delete another user's service."""
    # User A
    user_a = await client.post("/api/auth/signup", json={
        "email": "user_a@example.com", "password": "pass1234", "full_name": "User A", "role": "user"
    })
    token_a = user_a.json()["access_token"]

    # User B
    user_b = await client.post("/api/auth/signup", json={
        "email": "user_b@example.com", "password": "pass1234", "full_name": "User B", "role": "user"
    })
    token_b = user_b.json()["access_token"]

    # A creates a service
    create = await client.post("/api/infrastructure/connect",
        json={"name": "User A Service", "url": "https://a.example.com", "environment": "production"},
        headers={"Authorization": f"Bearer {token_a}"}
    )
    service_id = create.json()["id"]

    # B tries to delete A's service
    r = await client.delete(f"/api/infrastructure/services/{service_id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert r.status_code == 403


# ── Memory Search ────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_memory_search_requires_auth(client):
    r = await client.get("/api/memory/search?query=latency")
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_memory_search_returns_results(client, auth_token):
    r = await client.get("/api/memory/search?query=latency",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert r.status_code == 200
    data = r.json()
    assert "matches" in data
    assert isinstance(data["matches"], list)
