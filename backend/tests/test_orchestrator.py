import pytest
import asyncio
from unittest.mock import ANY, AsyncMock, MagicMock, patch
from agents.orchestrator import AutonomousOrchestrator

@pytest.mark.asyncio
async def test_orchestrator_full_workflow():
    # Mock Socket.io
    mock_sio = AsyncMock()
    orchestrator = AutonomousOrchestrator(sio=mock_sio)
    
    # Mock agent methods to speed up testing and ensure isolation
    orchestrator.monitoring.detect_anomaly = AsyncMock(return_value=True)
    orchestrator.context.reconstruct_context = AsyncMock(return_value={
        "status": "success",
        "data": {
            "similar_incidents": ["INC-001"],
            "causal_chain": ["deployment", "leak"],
            "recommended_action": "rollback"
        },
        "metadata": {"confidence": 0.9}
    })
    orchestrator.rca.analyze_root_cause = AsyncMock(return_value="Root cause: leak")
    orchestrator.remediation.decide_strategy = AsyncMock(return_value="rollback")
    orchestrator.execution.execute_remediation = AsyncMock(return_value=True)
    
    # Run simulation with narrative pacing mocked
    with patch("asyncio.sleep", return_value=None):
        success = await orchestrator.run_incident_simulation("latency_spike", "orders")
        
        assert success is True
        
        # Verify sequence of calls
        orchestrator.monitoring.detect_anomaly.assert_called_once()
        orchestrator.context.reconstruct_context.assert_called_once()
        orchestrator.rca.analyze_root_cause.assert_called_once()
        orchestrator.remediation.decide_strategy.assert_called_once()
        orchestrator.execution.execute_remediation.assert_called_once()
        
        # We don't verify mock_sio.emit here because we mocked the entire agent methods 
        # which are responsible for calling emit_event.

@pytest.mark.asyncio
async def test_orchestrator_event_emission():
    mock_sio = AsyncMock()
    orchestrator = AutonomousOrchestrator(sio=mock_sio)
    
    event = {
        "agent": "TestAgent",
        "message": "Testing event",
        "timestamp": "12:00:00"
    }
    
    with patch("asyncio.sleep", return_value=None):
        await orchestrator.emit_event(event)
        
        mock_sio.emit.assert_called_with(
            "agent_thought",
            {
                "agent": "TestAgent",
                "content": "Testing event",
                "timestamp": ANY,
            },
        )
