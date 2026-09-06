import pytest

def test_login_success(client):
    response = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token" in data
    assert data["user"]["email"] == "user@example.com"

def test_login_invalid_credentials(client):
    response = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_register_new_user(client):
    email = "newuser@example.com"
    response = client.post("/api/auth/register", json={
        "name": "New User",
        "email": email,
        "password": "password123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["role"] == "user"

def test_register_duplicate_email(client):
    response = client.post("/api/auth/register", json={
        "name": "Duplicate User",
        "email": "user@example.com",
        "password": "password123"
    })
    assert response.status_code == 422 or response.status_code == 400

def test_get_me(client, user_headers):
    response = client.get("/api/auth/me", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user@example.com"

def test_get_me_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
