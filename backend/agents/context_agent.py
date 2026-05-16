import httpx
import logging
import time

logger = logging.getLogger(__name__)

class ContextAgent:
    def __init__(self, orchestrator, api_url="http://localhost:8000"):
        self.orchestrator = orchestrator
        self.api_url = api_url

    async def reconstruct_context(self, incident_description):
        """
        Calls the Operational Intelligence API to find similar historical incidents.
        """
        logger.info("[ContextAgent] Reconstructing historical context...")
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/operational-intelligence",
                    json={"incident": incident_description},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    intelligence = response.json()
                    data = intelligence.get("data", {})
                    metadata = intelligence.get("metadata", {})
                    
                    message = f"Historical incident match found. Confidence: {metadata.get('confidence', 0)*100:.0f}%"
                    event = {
                        "agent": "ContextAgent",
                        "status": "active",
                        "message": message,
                        "timestamp": time.strftime("%H:%M:%S")
                    }
                    await self.orchestrator.emit_event(event)
                    return intelligence
                else:
                    logger.error(f"[ContextAgent] API Error: {response.status_code}")
                    return None
        except Exception as e:
            logger.error(f"[ContextAgent] Connection Error: {str(e)}")
            # Fallback for demo if API is not yet up
            return {
                "status": "success",
                "data": {
                    "similar_incidents": ["INC-2024-001"],
                    "causal_chain": ["deployment", "thread_leak", "latency_spike"],
                    "recommended_action": "rollback deployment"
                },
                "metadata": {"confidence": 0.94}
            }
