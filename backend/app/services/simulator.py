import asyncio
import random
import time
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class TelemetrySimulator:
    def __init__(self, sio):
        self.sio = sio
        self.running = False
        self.services = ["auth-service", "payment-gateway", "order-engine", "inventory-db"]
        self.metrics_history = {s: [] for s in self.services}
        self.anomaly_active = False
        self.anomaly_type = None
        self.affected_service = None

    async def start(self):
        self.running = True
        logger.info("Telemetry Simulator Started")
        while self.running:
            metrics = self.generate_metrics()
            await self.sio.emit('telemetry', metrics)
            
            if self.anomaly_active:
                await self.check_anomaly_thresholds(metrics)
                
            await asyncio.sleep(2)  # Update every 2 seconds

    def generate_metrics(self) -> Dict:
        timestamp = time.time()
        metrics = {"timestamp": timestamp, "services": {}}
        
        for service in self.services:
            # Base metrics
            cpu = random.uniform(20, 40)
            latency = random.uniform(50, 150)
            error_rate = random.uniform(0.1, 0.5)
            
            # Apply anomalies
            if self.anomaly_active and service == self.affected_service:
                if self.anomaly_type == "latency_spike":
                    latency = random.uniform(1000, 3000)
                    cpu += random.uniform(20, 40)
                elif self.anomaly_type == "error_surge":
                    error_rate = random.uniform(15, 45)
                    latency += random.uniform(200, 500)
                elif self.anomaly_type == "cpu_saturation":
                    cpu = random.uniform(90, 99)
                    latency += random.uniform(500, 1000)

            metrics["services"][service] = {
                "cpu": round(cpu, 2),
                "latency": round(latency, 2),
                "error_rate": round(error_rate, 2),
                "status": "healthy" if latency < 500 and error_rate < 5 else "degraded"
            }
            
        return metrics

    async def trigger_anomaly(self, anomaly_type: str, service: str = None):
        self.anomaly_active = True
        self.anomaly_type = anomaly_type
        self.affected_service = service or random.choice(self.services)
        logger.warning(f"Anomaly triggered: {anomaly_type} on {self.affected_service}")
        await self.sio.emit('event', {
            'type': 'ANOMALY_TRIGGERED',
            'data': {'type': anomaly_type, 'service': self.affected_service}
        })

    def stop_anomaly(self):
        self.anomaly_active = False
        self.anomaly_type = None
        self.affected_service = None
        logger.info("Anomaly resolved")

    async def check_anomaly_thresholds(self, metrics):
        # Monitoring logic can be moved to the Monitoring Agent later
        pass

    def stop(self):
        self.running = False
