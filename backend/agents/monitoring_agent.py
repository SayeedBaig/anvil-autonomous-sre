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
        if telemetry_data.get("latency", 0) > 2000:
            svc = telemetry_data.get("service") or "checkout-service"
            logger.info("[MonitoringAgent] Latency spike detected — raising incident signal")
            event = {
                "agent": "MonitoringAgent",
                "status": "active",
                "message": f"Latency spike detected on {svc}",
                "timestamp": time.strftime("%H:%M:%S"),
            }
            await self.orchestrator.emit_event(event)
            return True
        return False
