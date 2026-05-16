import asyncio
import logging
import time
from .monitoring_agent import MonitoringAgent
from .context_agent import ContextAgent
from .rca_agent import RCAAgent
from .remediation_agent import RemediationAgent
from .execution_agent import ExecutionAgent
from .extended_agents import SecurityAgent, DeploymentAgent, OptimizationAgent, LearningAgent

logger = logging.getLogger(__name__)

class AutonomousOrchestrator:
    def __init__(self, sio=None):
        self.sio = sio
        self.monitoring = MonitoringAgent(self)
        self.context = ContextAgent(self)
        self.security = SecurityAgent(self)
        self.deployment = DeploymentAgent(self)
        self.rca = RCAAgent(self)
        self.optimization = OptimizationAgent(self)
        self.remediation = RemediationAgent(self)
        self.execution = ExecutionAgent(self)
        self.learning = LearningAgent(self)

    async def emit_event(self, event):
        """
        Emits an agent event to the frontend via Socket.io.
        """
        agent_name = event.get("agent", "System")
        message = event.get("message", "Processing...")
        logger.info(f"[{agent_name}] {message}")
        
        if self.sio:
            await self.sio.emit('agent_thought', {
                "agent": agent_name,
                "content": message,
                "timestamp": time.time()  # Numeric timestamp for frontend compatibility
            })
        # Narrative pacing for cinematic effect
        await asyncio.sleep(1.8)

    async def run_incident_simulation(self, incident_type, service):
        """
        Runs a complete autonomous 10-agent incident recovery simulation.
        """
        try:
            description = f"{incident_type} on {service} after deployment"
            logger.info(f"STARTING ORCHESTRATION: {description}")
            
            # 1. Detection
            logger.info(f"[MonitoringAgent] Latency spike detected on {service}")
            await self.monitoring.detect_anomaly({"latency": 2500, "service": service})
            
            # 2. Context Reconstruction
            logger.info(f"[ContextAgent] Reconstructing operational memory for {service}")
            intelligence = await self.context.reconstruct_context(description)
            
            # 3. Deployment Correlation
            logger.info(f"[DeploymentAgent] Correlating deployment history for {service}")
            await self.deployment.check_deployment_history(service)
            
            # 4. Security Audit
            logger.info(f"[SecurityAgent] Verifying system integrity")
            await self.security.verify_integrity()
            
            # 5. Causal Analysis (RCA)
            logger.info(f"[RCAAgent] Root cause reconstructed from causal chain")
            await self.rca.analyze_root_cause(intelligence)
            
            # 6. Optimization Analysis
            logger.info(f"[OptimizationAgent] Analyzing resource efficiency")
            await self.optimization.analyze_efficiency()
            
            # 7. Remediation Decision
            logger.info(f"[RemediationAgent] Rollback selected based on historical match")
            strategy = await self.remediation.decide_strategy(intelligence)
            
            # 8. Execution
            logger.info(f"[ExecutionAgent] Executing recovery workflow: {strategy}")
            await self.execution.execute_remediation(strategy)
            
            # 9. Verification & Learning
            logger.info(f"[ExecutionAgent] Recovery verified. Telemetry stabilized.")
            await self.learning.finalize()
            
            # 10. System Resolution
            await self.emit_event({
                "agent": "System",
                "message": "Autonomous recovery workflow complete. All systems returning to baseline."
            })
            
            logger.info("ORCHESTRATION COMPLETE: All agents finished successfully.")
            return True
        except Exception as e:
            logger.error(f"Orchestration Engine Failure: {str(e)}", exc_info=True)
            await self.emit_event({
                "agent": "System",
                "message": f"CRITICAL: Autonomous loop halted due to engine failure: {str(e)}"
            })
            return False
