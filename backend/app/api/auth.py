from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.db.database import get_db
from app.db.models import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_active_user

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "user" # user or admin

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

@router.post("/signup", response_model=Token)
def signup(user_in: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.get("email")).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.get("email"),
        hashed_password=get_password_hash(user_in.get("password")),
        full_name=user_in.get("full_name"),
        role=user_in.get("role", "user"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=Token)
def login_access_token(
    user_in: UserLogin, db: Session = Depends(get_db)
):
    """
    JSON compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current user.
    """
    return current_user
