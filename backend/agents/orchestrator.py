import asyncio
import logging
import threading
import time
from .monitoring_agent import MonitoringAgent
from .context_agent import ContextAgent
from .rca_agent import RCAAgent
from .remediation_agent import RemediationAgent
from .execution_agent import ExecutionAgent
from .extended_agents import SecurityAgent, DeploymentAgent, OptimizationAgent, LearningAgent

logger = logging.getLogger(__name__)

# Delay between streamed agent thoughts (seconds). Short enough for realtime UX; nonzero for readable pacing.
_THOUGHT_PACE_SEC = 0.45


class AutonomousOrchestrator:
    def __init__(self, sio=None):
        self.sio = sio
        self._run_sync = threading.Lock()
        self._active = False
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
        logger.info("[%s] %s", agent_name, message)

        sio = getattr(self, "sio", None)
        if sio:
            try:
                await sio.emit(
                    "agent_thought",
                    {
                        "agent": agent_name,
                        "content": message,
                        "timestamp": time.time(),
                    },
                )
            except Exception as e:
                logger.error("[%s] Socket emit agent_thought failed: %s", agent_name, e)
        await asyncio.sleep(_THOUGHT_PACE_SEC)

    async def _emit_ctrl(self, typ: str, data: dict):
        """Realtime control plane (no narrative pacing)."""
        sio = getattr(self, "sio", None)
        if not sio:
            return
        try:
            await sio.emit("event", {"type": typ, "data": data})
        except Exception as e:
            logger.error("[Orchestrator] control emit %s failed: %s", typ, e)

    def try_begin_run(self) -> bool:
        """Thread-safe claim before overlapping asyncio tasks can start."""
        with self._run_sync:
            if self._active:
                return False
            self._active = True
            return True

    def finish_run(self):
        with self._run_sync:
            self._active = False

    async def run_incident_simulation(self, incident_type, service):
        """
        Runs a complete autonomous 10-agent incident recovery simulation.
        Overlapping triggers are rejected while a run is active (deterministic UX).
        """
        if not self.try_begin_run():
            logger.warning(
                "[Orchestrator] Duplicate simulation rejected while run_active (service=%s)",
                service,
            )
            await self._emit_ctrl(
                "ORCHESTRATION_FINISHED",
                {"service": service, "success": False, "rejected_duplicate": True},
            )
            await self.emit_event(
                {
                    "agent": "System",
                    "message": "Orchestration already running — wait for completion before triggering again.",
                }
            )
            return False

        success = False
        await self._emit_ctrl(
            "ORCHESTRATION_STARTED",
            {"service": service, "incident_type": incident_type},
        )
        try:
            description = f"{incident_type} on {service} after deployment"
            logger.info("STARTING ORCHESTRATION: %s", description)

            # 1. Detection
            logger.info("[MonitoringAgent] Latency spike detected on %s", service)
            await self.monitoring.detect_anomaly({"latency": 2500, "service": service})

            # 2. Context Reconstruction
            logger.info("[ContextAgent] Reconstructing operational memory for %s", service)
            intelligence = await self.context.reconstruct_context(description)

            # 3. Deployment Correlation
            logger.info("[DeploymentAgent] Correlating deployment history for %s", service)
            await self.deployment.check_deployment_history(service)

            # 4. Security Audit
            logger.info("[SecurityAgent] Verifying system integrity")
            await self.security.verify_integrity()

            # 5. Causal Analysis (RCA)
            logger.info("[RCAAgent] Root cause reconstructed from causal chain")
            await self.rca.analyze_root_cause(intelligence)

            # 6. Optimization Analysis
            logger.info("[OptimizationAgent] Analyzing resource efficiency")
            await self.optimization.analyze_efficiency()

            # 7. Remediation Decision
            logger.info("[RemediationAgent] Rollback selected based on historical match")
            strategy = await self.remediation.decide_strategy(intelligence)
            logger.info("[RemediationAgent] Strategy locked in: %s", strategy)

            # 8. Execution
            logger.info("[ExecutionAgent] Executing recovery workflow: %s", strategy)
            await self.execution.execute_remediation(strategy)

            # 9. Verification & Learning
            logger.info("[ExecutionAgent] Recovery verified. Telemetry stabilized.")
            await self.learning.finalize()

            # 10. System Resolution
            logger.info("[Orchestrator] Recovery lifecycle complete; emitting executive summary.")
            await self.emit_event(
                {
                    "agent": "ExecutiveSummary",
                    "message": (
                        "Incident closed: autonomous rollback executed; latency returned to baseline; "
                        "causal chain and remediation committed to operational memory."
                    ),
                }
            )

            await self.emit_event(
                {
                    "agent": "System",
                    "message": "Autonomous recovery workflow complete. All systems returning to baseline.",
                }
            )

            logger.info("ORCHESTRATION COMPLETE: All agents finished successfully.")
            success = True
            return True
        except Exception as e:
            logger.error("Orchestration Engine Failure: %s", str(e), exc_info=True)
            await self.emit_event(
                {
                    "agent": "System",
                    "message": f"CRITICAL: Autonomous loop halted due to engine failure: {str(e)}",
                }
            )
            return False
        finally:
            await self._emit_ctrl(
                "ORCHESTRATION_FINISHED",
                {"service": service, "success": success},
            )
            self.finish_run()
