import pytest

def test_admin_statistics(client, admin_headers):
    response = client.get("/api/admin/statistics", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "total_assessments" in data
    assert data["total_users"] >= 2

def test_admin_users_list(client, admin_headers):
    response = client.get("/api/admin/users", headers=admin_headers)
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 2

def test_admin_create_assessment_type(client, admin_headers):
    response = client.post("/api/admin/assessment-types", json={
        "id": "cat-custom-test",
        "name": "Custom Test Category",
        "description": "Category created during admin test suite execution.",
        "estimated_minutes": 5,
        "is_active": True
    }, headers=admin_headers)
    assert response.status_code == 201
    assert response.json()["id"] == "cat-custom-test"

def test_user_cannot_access_admin_portal(client, user_headers):
    response = client.get("/api/admin/statistics", headers=user_headers)
    assert response.status_code == 403
