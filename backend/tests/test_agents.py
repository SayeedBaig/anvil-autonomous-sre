import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from agents.monitoring_agent import MonitoringAgent
from agents.context_agent import ContextAgent
from agents.rca_agent import RCAAgent
from agents.remediation_agent import RemediationAgent
from agents.execution_agent import ExecutionAgent
from agents.orchestrator import AutonomousOrchestrator

@pytest.fixture
def mock_orchestrator():
    orchestrator = MagicMock(spec=AutonomousOrchestrator)
    orchestrator.emit_event = AsyncMock()
    return orchestrator

@pytest.mark.asyncio
async def test_monitoring_agent_detection(mock_orchestrator):
    agent = MonitoringAgent(mock_orchestrator)
    
    # Test anomaly detection
    telemetry = {"latency": 2500, "service": "checkout"}
    detected = await agent.detect_anomaly(telemetry)
    
    assert detected is True
    mock_orchestrator.emit_event.assert_called_once()
    assert mock_orchestrator.emit_event.call_args[0][0]["agent"] == "MonitoringAgent"

@pytest.mark.asyncio
async def test_context_agent_api_call(mock_orchestrator):
    agent = ContextAgent(mock_orchestrator)
    
    # Mock successful API call
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = MagicMock(status_code=200)
        mock_post.return_value.json.return_value = {
            "status": "success",
            "data": {"recommended_action": "rollback"},
            "metadata": {"confidence": 0.94}
        }
        
        intelligence = await agent.reconstruct_context("checkout timeout")
        
        assert intelligence["status"] == "success"
        assert intelligence["metadata"]["confidence"] == 0.94
        mock_orchestrator.emit_event.assert_called_once()

@pytest.mark.asyncio
async def test_rca_agent_analysis(mock_orchestrator):
    agent = RCAAgent(mock_orchestrator)
    intelligence = {
        "data": {"causal_chain": ["deployment", "thread_leak", "latency_spike"]}
    }
    
    rca = await agent.analyze_root_cause(intelligence)
    
    assert "rollback previously resolved" in rca
    mock_orchestrator.emit_event.assert_called_once()

@pytest.mark.asyncio
async def test_remediation_agent_decision(mock_orchestrator):
    agent = RemediationAgent(mock_orchestrator)
    intelligence = {
        "data": {"recommended_action": "rollback_deployment"}
    }
    
    strategy = await agent.decide_strategy(intelligence)
    
    assert strategy == "rollback_deployment"
    mock_orchestrator.emit_event.assert_called_once()

@pytest.mark.asyncio
async def test_execution_agent_flow(mock_orchestrator):
    agent = ExecutionAgent(mock_orchestrator)
    
    with patch("asyncio.sleep", return_value=None):
        success = await agent.execute_remediation("rollback")
        
        assert success is True
        # Emits start and end events
        assert mock_orchestrator.emit_event.call_count == 2
