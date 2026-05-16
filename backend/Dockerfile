FROM python:3.10-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libffi-dev libssl-dev python3-dev build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Cloud Run injects PORT env var
ENV PORT=8000
EXPOSE 8000

# Production: gunicorn with uvicorn workers
CMD exec gunicorn main:socket_app \
    --bind "0.0.0.0:${PORT}" \
    --workers 2 \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 120 \
    --log-level info \
    --access-logfile -
