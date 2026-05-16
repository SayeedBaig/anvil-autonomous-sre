import logging
import time

logger = logging.getLogger(__name__)

class RCAAgent:
    def __init__(self, orchestrator):
        self.orchestrator = orchestrator

    async def analyze_root_cause(self, intelligence_data):
        """
        Analyzes the causal chain provided by the intelligence layer.
        """
        logger.info("[RCAAgent] Analyzing causal chain...")
        
        causal_chain = intelligence_data.get("data", {}).get("causal_chain", [])
        
        if "deployment" in causal_chain and "thread_leak" in causal_chain:
            message = "Deployment rollback previously resolved similar timeout cascade."
        else:
            message = "Root cause isolated to upstream service dependency failure."

        event = {
            "agent": "RCAAgent",
            "status": "active",
            "message": message,
            "timestamp": time.strftime("%H:%M:%S")
        }
        await self.orchestrator.emit_event(event)
        return message
