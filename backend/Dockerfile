FROM python:3.10-slim AS base

# Security: non-root user
RUN groupadd --gid 1001 sentinel && \
    useradd --uid 1001 --gid sentinel --shell /bin/bash --create-home sentinel

WORKDIR /app

# Install OS-level dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libffi-dev libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=sentinel:sentinel . .

# Switch to non-root user
USER sentinel

# Cloud Run injects PORT env var
ENV PORT=8000

EXPOSE 8000

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT}/health')"

# Production: gunicorn with uvicorn workers
CMD exec gunicorn main:socket_app \
    --bind "0.0.0.0:${PORT}" \
    --workers 2 \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 120 \
    --log-level info \
    --access-logfile -
