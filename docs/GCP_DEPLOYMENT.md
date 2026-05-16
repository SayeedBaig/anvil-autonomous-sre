# SENTINEL_ONE — GCP Cloud Run Deployment Guide

## Architecture

```
GitHub Push (main)
       │
       ▼
GitHub Actions CI/CD
  ├── Backend tests (pytest)
  ├── Frontend lint + build
  └── Deploy to Cloud Run
        ├── sentinel-backend  (Cloud Run — :8000)
        └── sentinel-frontend (Cloud Run — :3000)
```

---

## Prerequisites

1. **GCP Project** with billing enabled
2. **APIs enabled:**
   ```bash
   gcloud services enable \
     run.googleapis.com \
     artifactregistry.googleapis.com \
     secretmanager.googleapis.com \
     cloudbuild.googleapis.com
   ```
3. **Artifact Registry repo:**
   ```bash
   gcloud artifacts repositories create sentinel \
     --repository-format=docker \
     --location=us-central1
   ```

---

## Secrets (Secret Manager)

Store sensitive values — never in env vars directly:

```bash
# JWT Secret
echo -n "$(openssl rand -hex 32)" | \
  gcloud secrets create sentinel-secret-key --data-file=-

# Gemini API Key
echo -n "YOUR_GEMINI_KEY" | \
  gcloud secrets create gemini-api-key --data-file=-
```

---

## GitHub Actions Setup

Add these **GitHub Secrets** to your repo:

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity provider resource name |
| `GCP_SERVICE_ACCOUNT` | Service account email for deployments |

### Workload Identity Federation (keyless auth)

```bash
# Create service account
gcloud iam service-accounts create sentinel-deployer \
  --display-name="Sentinel CI Deployer"

SA="sentinel-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" \
  --role="roles/secretmanager.secretAccessor"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create sentinel-pool \
  --location="global"

gcloud iam workload-identity-pools providers create-oidc sentinel-github \
  --location="global" \
  --workload-identity-pool="sentinel-pool" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository"

# Allow GitHub Actions to impersonate SA
gcloud iam service-accounts add-iam-policy-binding $SA \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/sentinel-pool/attribute.repository/YOUR_GITHUB_ORG/sentinel-sre"
```

---

## Manual Deployment (one-time)

```bash
# Set project
export PROJECT_ID=your-project-id
export REGION=us-central1

# Backend
docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/sentinel/sentinel-backend:latest ./backend
docker push us-central1-docker.pkg.dev/$PROJECT_ID/sentinel/sentinel-backend:latest

gcloud run deploy sentinel-backend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/sentinel/sentinel-backend:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8000 \
  --memory 512Mi \
  --set-secrets="SECRET_KEY=sentinel-secret-key:latest,GEMINI_API_KEY=gemini-api-key:latest" \
  --set-env-vars="ALLOWED_ORIGINS=https://sentinel-frontend-HASH-uc.a.run.app"

# Get backend URL
BACKEND_URL=$(gcloud run services describe sentinel-backend \
  --region $REGION --format 'value(status.url)')

# Frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=$BACKEND_URL \
  --build-arg NEXT_PUBLIC_SOCKET_URL=$BACKEND_URL \
  -t us-central1-docker.pkg.dev/$PROJECT_ID/sentinel/sentinel-frontend:latest ./frontend
docker push us-central1-docker.pkg.dev/$PROJECT_ID/sentinel/sentinel-frontend:latest

gcloud run deploy sentinel-frontend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/sentinel/sentinel-frontend:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi
```

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env   # fill in GEMINI_API_KEY
python init_db.py
python main.py

# Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

**Test accounts:**
- Admin: `admin@sentinel.com` / `admin123`
- User: `demo@company.com` / `demo123`

---

## Health Checks

| Endpoint | Expected |
|----------|----------|
| `GET /health` | `{"status": "healthy"}` |
| `GET /` | `{"status": "Sentinel SRE AI Copilot Operational", "version": "2.0.0"}` |
| `GET /api/docs` | Swagger UI |
