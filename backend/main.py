import uvicorn
import os
from fastapi import FastAPI, WebSocket, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import socketio
import asyncio
import logging
import time
from sqlalchemy.orm import Session
from typing import List

from app.db.database import SessionLocal, engine, get_db
from app.db import models
from app.api.auth import router as auth_router
from app.api.deps import get_current_active_user, get_current_active_admin
from app.services.observability import LiveObservability
from app.services.operational_intelligence import analyze_operational_intelligence
from agents.orchestrator import AutonomousOrchestrator
from init_db import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sentinel SRE AI Copilot",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Environment-aware CORS
_raw_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Socket.io setup (CORS mirrors FastAPI)
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=ALLOWED_ORIGINS
)
socket_app = socketio.ASGIApp(sio, app)

# Global Services
observability = LiveObservability(sio)
orchestrator = AutonomousOrchestrator(sio)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"status": "Sentinel SRE AI Copilot Operational", "version": "2.0.0"}

@app.get("/health")
async def health():
    """GCP Cloud Run health check endpoint."""
    return {"status": "healthy"}

# --- Infrastructure Management ---

@app.post("/api/infrastructure/connect")
async def connect_infrastructure(
    service_data: dict, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Register a new deployed application."""
    new_service = models.ConnectedService(
        name=service_data.get("name"),
        url=service_data.get("url"),
        environment=service_data.get("environment", "production"),
        status="active",
        owner_id=current_user.id
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    logger.info(f"Connected new infrastructure: {new_service.name} at {new_service.url} by user {current_user.id}")
    return new_service

@app.get("/api/infrastructure/services")
async def list_services(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role == "admin":
        return db.query(models.ConnectedService).all()
    return db.query(models.ConnectedService).filter(models.ConnectedService.owner_id == current_user.id).all()

@app.delete("/api/infrastructure/services/{service_id}")
async def disconnect_service(
    service_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    service = db.query(models.ConnectedService).filter(models.ConnectedService.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    if service.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough privileges")
    
    db.delete(service)
    db.commit()
    return {"status": "disconnected"}

# --- Incident Management ---

@app.post("/api/incidents/trigger")
async def trigger_incident(
    payload: dict, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    service_id = payload.get("service_id")
    anomaly_type = payload.get("type", "latency_spike")
    
    service = db.query(models.ConnectedService).filter(models.ConnectedService.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    if service.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough privileges")
    
    logger.info(f"Triggering {anomaly_type} on {service.name} for user {current_user.id}")
    observability.trigger_anomaly(service_id, anomaly_type)
    
    # Start autonomous recovery flow
    asyncio.create_task(orchestrator.run_incident_simulation(anomaly_type, service.name))
    
    return {"status": "incident_triggered", "service": service.name}

@app.post("/api/incidents/resolve/{service_id}")
async def resolve_incident(service_id: int):
    observability.stop_anomaly(service_id)
    await sio.emit('event', {'type': 'INCIDENT_RESOLVED', 'data': {'service_id': service_id}})
    return {"status": "resolved"}

# --- Operational Intelligence ---

@app.get("/api/memory/search")
async def search_memory(
    query: str = Query(...),
    current_user: models.User = Depends(get_current_active_user)
):
    """Search operational memory for historical context."""
    logger.info(f"Searching operational memory for: {query} by user {current_user.id}")
    # Mocking historical context retrieval
    return {
        "query": query,
        "matches": [
            {
                "id": "HIST-001",
                "title": "Cascading Latency Spike in Checkout",
                "similarity": 0.94,
                "remediation": "Rolled back deployment v2.1.4",
                "recovery_time": "4m 12s"
            },
            {
                "id": "HIST-002",
                "title": "Connection Pool Exhaustion",
                "similarity": 0.82,
                "remediation": "Increased DB connection limit",
                "recovery_time": "12m 45s"
            }
        ]
    }

@app.post("/api/operational-intelligence")
async def operational_intelligence(
    payload: dict,
    current_user: models.User = Depends(get_current_active_user)
):
    """Deep analysis of incident context and causal reconstruction."""
    query = payload.get("incident_description", "")
    logger.info(f"[Intelligence] Performing deep analysis for: {query}")
    
    # Simulate intelligence processing
    return {
        "status": "success",
        "data": {
            "similar_incidents": ["HIST-001", "HIST-005"],
            "causal_chain": ["deployment", "thread_leak", "latency_spike"],
            "recommended_action": "rollback_deployment",
            "reasoning": "High similarity (96%) with historical incident HIST-001 where a thread leak was resolved by rolling back v2.1.4."
        },
        "metadata": {
            "confidence": 0.98,
            "analysis_time_ms": 450,
            "engine": "SENTINEL_BRAIN_V2",
            "causal_chain_depth": 3
        }
    }

# --- Lifecycle Management ---

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(observability.start())
    logger.info("Sentinel SRE Engine initialized")

@app.on_event("shutdown")
async def shutdown_event():
    await observability.stop()

# --- Socket.io Events ---

@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:socket_app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True,
    )
