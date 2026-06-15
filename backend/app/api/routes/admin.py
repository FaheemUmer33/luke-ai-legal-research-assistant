from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.legal import DocumentChunk, LegalDocument, LegalSource, RegulatoryUpdate
from app.schemas.legal import SourceCreate

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    return {
        "sources": db.scalar(select(func.count()).select_from(LegalSource)),
        "documents": db.scalar(select(func.count()).select_from(LegalDocument)),
        "chunks": db.scalar(select(func.count()).select_from(DocumentChunk)),
        "regulatory_updates": db.scalar(select(func.count()).select_from(RegulatoryUpdate)),
        "rag_policy": "retrieval_first_citation_validated",
    }


@router.get("/sources")
def list_sources(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.scalars(select(LegalSource).order_by(LegalSource.authority_level.desc())).all()
    return [
        {
            "id": str(row.id),
            "name": row.name,
            "source_type": row.source_type.value,
            "base_url": row.base_url,
            "authority_level": row.authority_level,
            "reliability_score": float(row.reliability_score),
            "freshness_priority": row.freshness_priority,
            "is_active": row.is_active,
        }
        for row in rows
    ]


@router.post("/sources")
def create_source(payload: SourceCreate, db: Session = Depends(get_db)) -> dict:
    source = LegalSource(**payload.model_dump(mode="json"))
    db.add(source)
    db.commit()
    db.refresh(source)
    return {"id": str(source.id)}

