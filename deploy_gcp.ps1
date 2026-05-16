$ErrorActionPreference = "Stop"

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "🚀 SENTINEL_ONE - GCP Cloud Run Deployment Script 🚀" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

# 1. Check for Google Cloud CLI
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "`n[ERROR] Google Cloud CLI (gcloud) is not installed or not in your PATH." -ForegroundColor Red
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install-sdk" -ForegroundColor Yellow
    Write-Host "After installation, open a NEW terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

$PROJECT_ID = "just-rhythm-328816"
$REGION = "asia-south1" # Or any region you prefer
$GEMINI_API_KEY = "-AQ.Ab8RN6JCA6KhcSnVVH90AqPbbuGpjxfph7WtO2H-0fQGKokYuQ"

Write-Host "`n[1/4] Checking Google Cloud Authentication..." -ForegroundColor Cyan
$currentAccount = gcloud config get-value account 2>$null
if (-not $currentAccount) {
    Write-Host "You are not logged in. Opening browser to authenticate..." -ForegroundColor Yellow
    gcloud auth login
} else {
    Write-Host "Authenticated as: $currentAccount" -ForegroundColor Green
}

Write-Host "`nSetting active project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

Write-Host "`n[2/4] Enabling required Google Cloud APIs (Cloud Run, Artifact Registry, Cloud Build)..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

Write-Host "`n[3/4] Deploying Backend to Cloud Run..." -ForegroundColor Cyan
cd backend
gcloud run deploy sentinel-backend `
    --source . `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars="GEMINI_API_KEY=$GEMINI_API_KEY,PORT=8000" `
    --port 8000

# Get backend URL
$BACKEND_URL = gcloud run services describe sentinel-backend --region $REGION --format="value(status.url)"
cd ..

Write-Host "`nBackend deployed successfully at: $BACKEND_URL" -ForegroundColor Green

Write-Host "`n[4/4] Deploying Frontend to Cloud Run..." -ForegroundColor Cyan
cd frontend
gcloud run deploy sentinel-frontend `
    --source . `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL"

# Get frontend URL
$FRONTEND_URL = gcloud run services describe sentinel-frontend --region $REGION --format="value(status.url)"
cd ..

Write-Host "`n===========================================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "Sentinel SRE Frontend: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "Sentinel SRE Backend:  $BACKEND_URL" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
