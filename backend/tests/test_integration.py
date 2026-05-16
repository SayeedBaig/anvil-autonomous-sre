import uuid

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_operational_intelligence_endpoint(ac: AsyncClient):
    email = f"intel_{uuid.uuid4().hex[:10]}@example.com"
    signup = await ac.post(
        "/api/auth/signup",
        json={
            "email": email,
            "password": "securepass123",
            "full_name": "Intel Test",
            "role": "user",
        },
    )
    assert signup.status_code == 200, signup.text
    token = signup.json()["access_token"]

    response = await ac.post(
        "/api/operational-intelligence",
        json={"incident_description": "checkout-api timeout after deployment"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    assert "metadata" in data
    assert data["data"]["recommended_action"] == "rollback_deployment"
    assert data["metadata"]["confidence"] == 0.98


@pytest.mark.skip(reason="/api/webhooks/deploy is not implemented on this branch")
@pytest.mark.asyncio
async def test_autonomous_orchestration_deploy_webhook(ac: AsyncClient):
    payload = {"service": "order-engine", "version": "v2.1.4"}
    response = await ac.post("/api/webhooks/deploy", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "accepted"
