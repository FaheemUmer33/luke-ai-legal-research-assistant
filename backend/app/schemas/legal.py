from uuid import UUID
from pydantic import BaseModel, Field, HttpUrl


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    organization_name: str
    email: str
    full_name: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class SourceCreate(BaseModel):
    name: str
    source_type: str
    base_url: HttpUrl
    jurisdiction: str = "Peru"
    authority_level: int = Field(ge=1, le=100)
    freshness_priority: int = Field(default=5, ge=1, le=10)
    reliability_score: float = Field(default=0.95, ge=0, le=1)


class ResearchRequest(BaseModel):
    question: str
    session_id: UUID | None = None
    filters: dict = Field(default_factory=dict)


class CitationOut(BaseModel):
    document_name: str
    section: str
    official_url: str | None
    storage_uri: str | None
    quote: str


class ResearchResponse(BaseModel):
    answer: str
    status: str
    citations: list[CitationOut]
    refusal_reason: str | None = None
