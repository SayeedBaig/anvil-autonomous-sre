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
        await self.orchestrator.emit_event({
            "agent": "RemediationAgent",
            "message": "Synthesizing recovery strategies based on historical success rates..."
        })
        
        data = intelligence_data.get("data", {})
        meta = intelligence_data.get("metadata", {})
        
        recommended_action = (data.get("recommended_action") or "investigate").strip()
        if not recommended_action:
            recommended_action = "investigate"
        confidence = float(meta.get("confidence", 0.98) or 0.0)
        
        logger.info("[RemediationAgent] Rollback selected (recommended_action=%s)", recommended_action)

        message = f"DECISION: {recommended_action.replace('_', ' ').title()} strategy selected. Confidence: {confidence*100:.0f}%."

        await self.orchestrator.emit_event(
            {"agent": "RemediationAgent", "message": message}
        )
        return recommended_action
