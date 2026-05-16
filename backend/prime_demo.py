from app.db.database import SessionLocal
from app.db import models
from app.core.security import get_password_hash
import random
import datetime

def prime_demo():
    db = SessionLocal()
    try:
        # 1. Create Demo Users
        admin = db.query(models.User).filter(models.User.email == "admin@sentinel.com").first()
        if not admin:
            admin = models.User(
                email="admin@sentinel.com",
                full_name="Sentinel Admin",
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        user = db.query(models.User).filter(models.User.email == "demo@company.com").first()
        if not user:
            user = models.User(
                email="demo@company.com",
                full_name="Demo User",
                hashed_password=get_password_hash("demo123"),
                role="user"
            )
            db.add(user)
            db.commit()

        # 2. Create Demo Services
        services = [
            ("election ai (production)", "https://election-ai.gov"),
            ("checkout-svc", "https://checkout.internal"),
            ("payment-gateway", "https://payments.stripe.com"),
            ("auth-provider", "https://auth.internal")
        ]
        
        svc_ids = []
        for name, url in services:
            exists = db.query(models.ConnectedService).filter(models.ConnectedService.name == name).first()
            if not exists:
                svc = models.ConnectedService(
                    name=name,
                    url=url,
                    environment="production" if "production" in name else "staging",
                    status="active",
                    owner_id=admin.id
                )
                db.add(svc)
                db.commit()
                db.refresh(svc)
                svc_ids.append(svc.id)
            else:
                svc_ids.append(exists.id)
        
        # 3. Create Historical Incidents for "Knowledge" tab
        incidents = [
            ("latency_spike", "Cascading timeout in node cluster", "Automated restart of checkout pods and circuit breaker trip."),
            ("connection_error", "Redis connection pool exhaustion", "Scale Redis cluster and rotate idle connections."),
            ("deployment_failure", "Broken asset pipeline in v2.1.2", "Automatic rollback to stable v2.1.1 successful."),
            ("api_timeout", "Stripe API Gateway timeout", "Enabled regional failover to US-West-2."),
            ("memory_leak", "Heap overflow in payment service", "Isolate node, capture heap dump, and restart.")
        ]

        if db.query(models.Incident).count() < 10:
            for i in range(15):
                inc_type, rca, plan = random.choice(incidents)
                inc = models.Incident(
                    service_id=random.choice(svc_ids),
                    type=inc_type,
                    status="resolved",
                    rca=rca,
                    remediation_plan=plan,
                    confidence_score=0.85 + (random.random() * 0.14),
                    created_at=datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 14), hours=random.randint(0, 23))
                )
                db.add(inc)
            db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    prime_demo()
