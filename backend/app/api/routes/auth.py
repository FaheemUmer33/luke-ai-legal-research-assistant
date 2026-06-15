from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.db.session import get_db
from app.models.legal import Organization, User
from app.schemas.legal import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    slug = payload.organization_name.lower().strip().replace(" ", "-")
    organization = db.scalar(select(Organization).where(Organization.slug == slug))
    if not organization:
        organization = Organization(name=payload.organization_name, slug=slug)
        db.add(organization)
        db.flush()
    user = User(
        organization_id=organization.id,
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(str(user.id), user.role), refresh_token=create_refresh_token(str(user.id), user.role))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email, User.is_active.is_(True)))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(str(user.id), user.role), refresh_token=create_refresh_token(str(user.id), user.role))


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest) -> TokenResponse:
    claims = decode_token(payload.refresh_token)
    if claims.get("typ") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return TokenResponse(access_token=create_access_token(claims["sub"], claims.get("role", "member")))
