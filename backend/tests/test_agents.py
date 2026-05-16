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
    fake_intel = {
        "status": "success",
        "data": {
            "similar_incidents": ["HIST-001"],
            "causal_chain": ["deployment"],
            "recommended_action": "rollback_deployment",
            "reasoning": "test",
        },
        "metadata": {"confidence": 0.94},
    }
    with patch(
        "agents.context_agent.analyze_operational_intelligence",
        new_callable=AsyncMock,
        return_value=fake_intel,
    ):
        intelligence = await agent.reconstruct_context("checkout timeout")

    assert intelligence["status"] == "success"
    assert intelligence["metadata"]["confidence"] == 0.94
    assert mock_orchestrator.emit_event.call_count >= 2

@pytest.mark.asyncio
async def test_rca_agent_analysis(mock_orchestrator):
    agent = RCAAgent(mock_orchestrator)
    intelligence = {
        "data": {"causal_chain": ["deployment", "thread_leak", "latency_spike"]}
    }
    
    rca = await agent.analyze_root_cause(intelligence)

    assert "ROOT CAUSE IDENTIFIED" in rca
    assert mock_orchestrator.emit_event.call_count >= 3

@pytest.mark.asyncio
async def test_remediation_agent_decision(mock_orchestrator):
    agent = RemediationAgent(mock_orchestrator)
    intelligence = {
        "data": {"recommended_action": "rollback_deployment"}
    }
    
    strategy = await agent.decide_strategy(intelligence)
    
    assert strategy == "rollback_deployment"
    assert mock_orchestrator.emit_event.call_count == 2

@pytest.mark.asyncio
async def test_execution_agent_flow(mock_orchestrator):
    agent = ExecutionAgent(mock_orchestrator)
    
    with patch("asyncio.sleep", return_value=None):
        success = await agent.execute_remediation("rollback")
        
        assert success is True
        assert mock_orchestrator.emit_event.call_count == 4
