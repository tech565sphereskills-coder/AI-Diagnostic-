import pytest

def test_legacy_clinical_login(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "doctor@aidiagnostic.ng",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data

def test_legacy_get_patients(client):
    response = client.get("/api/v1/patients")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] >= 3

def test_legacy_system_info(client):
    response = client.get("/api/v1/system/info")
    assert response.status_code == 200
    data = response.json()
    assert data["application"] == "AI Diagnostic Support System"
    assert "accuracy" in data

def test_legacy_audit_logs(client):
    response = client.get("/api/v1/audit-logs")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 1
