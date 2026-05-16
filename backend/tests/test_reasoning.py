import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.reasoning import ReasoningService

@pytest.mark.asyncio
async def test_reasoning_service_fallback():
    # Test fallback when no API keys are provided
    with patch.dict('os.environ', {}, clear=True):
        service = ReasoningService()
        state = {"incident_id": "INC-TEST", "metadata": {"anomaly_type": "latency", "service": "orders"}}
        
        reasoning = await service.analyze_incident(state)
        
        assert "Simulated Reasoning" in reasoning
        assert "thread leak" in reasoning

@pytest.mark.asyncio
async def test_reasoning_service_api_call():
    # Mock LLM response
    mock_response = MagicMock()
    mock_response.content = "Deep Analysis: Causal link between deployment and socket exhaustion."
    
    with patch.dict('os.environ', {'GOOGLE_API_KEY': 'fake-key'}):
        service = ReasoningService()
        service.llm = AsyncMock()
        service.llm.ainvoke.return_value = mock_response
        
        state = {"incident_id": "INC-TEST"}
        reasoning = await service.analyze_incident(state)
        
        assert "Deep Analysis" in reasoning
        service.llm.ainvoke.assert_called_once()
