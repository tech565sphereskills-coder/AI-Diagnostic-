import pytest

def test_get_assessment_types(client):
    response = client.get("/api/assessment-types")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    type_ids = [t["id"] for t in data]
    assert "cat-academic" in type_ids
    assert "cat-career" in type_ids

def test_get_questions_for_academic(client):
    response = client.get("/api/assessment-types/cat-academic/questions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    q_ids = [q["id"] for q in data]
    assert "q-symptoms" in q_ids or "q-acad-1" in q_ids

def test_full_assessment_lifecycle(client, user_headers):
    # 1. Create new assessment
    create_res = client.post("/api/assessments", json={"assessment_type_id": "cat-academic"}, headers=user_headers)
    assert create_res.status_code == 201
    asm_data = create_res.json()
    asm_id = asm_data["id"]
    assert asm_data["status"] == "draft"

    # 2. Get single assessment details
    get_res = client.get(f"/api/assessments/{asm_id}", headers=user_headers)
    assert get_res.status_code == 200
    assert get_res.json()["progress"]["answered_questions"] == 0

    # 3. Submit incomplete answers & validate
    first_q_id = "q-symptoms"
    client.post(f"/api/assessments/{asm_id}/answers", json={
        "answers": [
            {"question_id": first_q_id, "answer_text": "High fever and headache"}
        ]
    }, headers=user_headers)

    val_res1 = client.post(f"/api/assessments/{asm_id}/validate", headers=user_headers)
    assert val_res1.status_code == 200

    # 4. Complete required answers
    client.post(f"/api/assessments/{asm_id}/answers", json={
        "answers": [
            {"question_id": "q-age", "answer_text": "28"},
            {"question_id": "q-sex", "answer_text": "Female"},
            {"question_id": "q-symptoms", "answer_text": "High fever, chills, severe headache"},
            {"question_id": "q-duration", "answer_text": "1 to 3 days"},
            {"question_id": "q-severity", "answer_text": "8"},
            {"question_id": "q-vitals-additional", "answer_text": "Temp 38.5C, BP 120/80"}
        ]
    }, headers=user_headers)

    val_res2 = client.post(f"/api/assessments/{asm_id}/validate", headers=user_headers)
    assert val_res2.status_code == 200

    # 5. Execute AI analysis
    analyze_res = client.post(f"/api/assessments/{asm_id}/analyze", headers=user_headers)
    assert analyze_res.status_code == 200
    res_data = analyze_res.json()
    assert res_data["status"] == "completed"
    assert "result" in res_data
    assert res_data["result"]["result_title"] != ""

    # 6. Fetch result by assessment
    result_fetch = client.get(f"/api/assessments/{asm_id}/result", headers=user_headers)
    assert result_fetch.status_code == 200
    assert result_fetch.json()["assessment_id"] == asm_id
