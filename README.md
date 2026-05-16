# Sentinel SRE: Autonomous Operational Intelligence Platform

Sentinel is a production-grade autonomous multi-agent SRE platform.

## Architecture
- **Backend**: FastAPI + LangGraph + WebSockets
- **Frontend**: Next.js 15 + Tailwind 4 + Framer Motion
- **Agents**: 6 specialized agents orchestrating the incident lifecycle.

## How to Run

### 1. Infrastructure
```bash
cd docker
docker-compose up -d
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Demo Flow
1. Open the dashboard (http://localhost:3000).
2. Click **SIMULATE DEPLOYMENT**.
3. Observe the `DEPLOYMENT_STARTED` event.
4. After 5 seconds, a `latency_spike` anomaly is triggered.
5. The **Sentinel Brain** (LangGraph) activates.
6. Watch the **Agent Activity Feed** as agents reason through the root cause.
7. The **Execution Agent** performs an autonomous rollback.
8. Telemetry metrics recover to normal levels.
9. The **Learning Agent** stores the resolution pattern.
