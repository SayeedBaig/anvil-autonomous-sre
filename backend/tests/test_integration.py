import pytest
from httpx import AsyncClient
import asyncio

@pytest.mark.asyncio
async def test_operational_intelligence_endpoint(ac: AsyncClient):
    # Test the standalone intelligence layer
    payload = {"incident": "checkout-api timeout after deployment"}
    response = await ac.post("/operational-intelligence", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    assert "metadata" in data
    assert data["data"]["recommended_action"] == "rollback_deployment"
    assert data["metadata"]["confidence"] == 0.94

@pytest.mark.asyncio
async def test_autonomous_orchestration_flow(ac: AsyncClient):
    # Test the end-to-end orchestration trigger
    payload = {"service": "order-engine", "version": "v2.1.4"}
    response = await ac.post("/api/webhooks/deploy", json=payload)
    
    assert response.status_code == 200
    assert response.json()["status"] == "accepted"
    
    # In a real integration test, we would listen to Socket.io events here
    # Since we are using TestClient/AsyncClient, we verify the workflow was triggered
