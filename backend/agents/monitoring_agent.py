import asyncio
import time
import logging

logger = logging.getLogger(__name__)

class MonitoringAgent:
    def __init__(self, orchestrator):
        self.orchestrator = orchestrator

    async def detect_anomaly(self, telemetry_data):
        """
        Detects anomalies in telemetry data.
        In a real scenario, this would involve complex thresholding or ML.
        """
        logger.info("[MonitoringAgent] Scanning telemetry streams...")
        # Simulate detection logic
        if telemetry_data.get("latency", 0) > 2000:
            logger.info("[MonitoringAgent] CRITICAL: Latency spike detected in checkout-service.")
            event = {
                "agent": "MonitoringAgent",
                "status": "active",
                "message": "Latency spike detected in checkout-service",
                "timestamp": time.strftime("%H:%M:%S")
            }
            await self.orchestrator.emit_event(event)
            return True
        return False
