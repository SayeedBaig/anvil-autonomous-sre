import asyncio
import logging
from .monitoring_agent import MonitoringAgent
from .context_agent import ContextAgent
from .rca_agent import RCAAgent
from .remediation_agent import RemediationAgent
from .execution_agent import ExecutionAgent

logger = logging.getLogger(__name__)

class AutonomousOrchestrator:
    def __init__(self, sio=None):
        self.sio = sio
        self.monitoring = MonitoringAgent(self)
        self.context = ContextAgent(self)
        self.rca = RCAAgent(self)
        self.remediation = RemediationAgent(self)
        self.execution = ExecutionAgent(self)

    async def emit_event(self, event):
        """
        Emits an agent event to the frontend via Socket.io.
        """
        logger.info(f"Event: {event['agent']} -> {event['message']}")
        if self.sio:
            await self.sio.emit('agent_thought', {
                "agent": event["agent"],
                "content": event["message"],
                "timestamp": event["timestamp"]
            })
        # Narrative pacing
        await asyncio.sleep(2)

    async def run_incident_simulation(self, incident_type, service):
        """
        Runs a complete autonomous incident recovery simulation.
        """
        description = f"{incident_type} on {service} after deployment"
        
        # 1. Detection
        await self.monitoring.detect_anomaly({"latency": 2500, "service": service})
        
        # 2. Context Reconstruction (Intelligence API Call)
        intelligence = await self.context.reconstruct_context(description)
        
        # 3. Causal Analysis
        await self.rca.analyze_root_cause(intelligence)
        
        # 4. Remediation Decision
        strategy = await self.remediation.decide_strategy(intelligence)
        
        # 5. Execution & Verification
        await self.execution.execute_remediation(strategy)
        
        return True
