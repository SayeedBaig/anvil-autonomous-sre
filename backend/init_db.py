from app.db.database import engine, Base, SessionLocal
from app.db.models import ConnectedService, Incident, User
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Create Admin
    admin = db.query(User).filter(User.email == "admin@sentinel.com").first()
    if not admin:
        admin = User(
            email="admin@sentinel.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Sentinel Admin",
            role="admin"
        )
        db.add(admin)
    
    # Create Demo User
    user = db.query(User).filter(User.email == "demo@company.com").first()
    if not user:
        user = User(
            email="demo@company.com",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo User",
            role="user"
        )
        db.add(user)
        
    db.commit()
    db.close()
    print("Database initialized with admin and demo users.")

if __name__ == "__main__":
    init_db()
