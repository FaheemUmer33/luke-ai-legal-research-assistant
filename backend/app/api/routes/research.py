from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.legal import ResearchRequest, ResearchResponse
from app.services.rag import LegalRAGPipeline

router = APIRouter(prefix="/research", tags=["research"])


@router.post("/ask", response_model=ResearchResponse)
def ask(payload: ResearchRequest, db: Session = Depends(get_db)) -> ResearchResponse:
    return LegalRAGPipeline(db).answer(payload.question, payload.session_id, payload.filters)

