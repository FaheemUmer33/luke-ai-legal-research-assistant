from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import admin, auth, contracts, documents, research
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title="LUKE AI Legal Research Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(research.router)
app.include_router(documents.router)
app.include_router(contracts.router)
app.include_router(admin.router)
app.include_router(auth.router, prefix="/api")
app.include_router(research.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(contracts.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/")
def root() -> dict:
    return {"name": "LUKE", "policy": "citation-first retrieval-gated Peruvian legal AI"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "luke-backend"}
