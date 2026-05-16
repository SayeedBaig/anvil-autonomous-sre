import logging
import time

logger = logging.getLogger(__name__)

class RemediationAgent:
    def __init__(self, orchestrator):
        self.orchestrator = orchestrator

    async def decide_strategy(self, intelligence_data):
        """
        Decides the remediation strategy based on intelligence recommendations.
        """
        logger.info("[RemediationAgent] Determining remediation strategy...")
        
        recommended_action = intelligence_data.get("data", {}).get("recommended_action", "investigate")
        
        message = f"Recommended action: {recommended_action.replace('_', ' ').title()}"
        
        event = {
            "agent": "RemediationAgent",
            "status": "active",
            "message": message,
            "timestamp": time.strftime("%H:%M:%S")
        }
        await self.orchestrator.emit_event(event)
        return recommended_action
