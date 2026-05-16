import asyncio
import httpx
import time
import random
import logging
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import ConnectedService

logger = logging.getLogger(__name__)

class LiveObservability:
    def __init__(self, sio):
        self.sio = sio
        self.is_running = False
        self.active_anomalies = {} # service_id -> anomaly_type

    async def start(self):
        self.is_running = True
        logger.info("Live Observability Engine Started")
        while self.is_running:
            db = SessionLocal()
            try:
                services = db.query(ConnectedService).filter(ConnectedService.is_monitored == True).all()
                for service in services:
                    telemetry = await self.probe_service(service)
                    try:
                        await self.sio.emit("telemetry_update", telemetry)
                    except Exception as emit_err:
                        logger.error("telemetry_update emit failed: %s", emit_err)
            except Exception as e:
                logger.error(f"Error in observability loop: {e}")
            finally:
                db.close()
            
            await asyncio.sleep(2) # Poll every 2 seconds

    async def stop(self):
        self.is_running = False

    async def probe_service(self, service):
        start_time = time.time()
        status = "healthy"
        latency = 0
        
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                response = await client.get(service.url)
                latency = (time.time() - start_time) * 1000 # ms
                if response.status_code >= 400:
                    status = "degraded"
        except Exception as e:
            status = "unreachable"
            latency = 2000 # timeout simulation
            logger.warning(f"Failed to probe {service.url}: {e}")

        # Inject anomaly if active
        if service.id in self.active_anomalies:
            anomaly = self.active_anomalies[service.id]
            if anomaly == "latency_spike":
                latency += random.uniform(500, 1500)
                status = "degraded"
            elif anomaly == "error_surge":
                status = "critical"
            elif anomaly == "unreachable":
                status = "unreachable"
                latency = 5000

        return {
            "service_id": service.id,
            "service_name": service.name,
            "latency": round(latency, 2),
            "status": status,
            "timestamp": time.time(),
            "cpu_usage": round(random.uniform(5, 45) + (20 if status != "healthy" else 0), 1),
            "memory_usage": round(random.uniform(128, 512) + (100 if status != "healthy" else 0), 1),
            "request_count": random.randint(100, 500)
        }

    def trigger_anomaly(self, service_id: int, anomaly_type: str):
        self.active_anomalies[service_id] = anomaly_type

    def stop_anomaly(self, service_id: int):
        if service_id in self.active_anomalies:
            del self.active_anomalies[service_id]
