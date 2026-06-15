from sqlalchemy.orm import Session
from app.services.retrieval import RetrievalService


def retrieve_evidence(db: Session, question: str, filters: dict | None = None):
    return RetrievalService(db).search(question, filters=filters)

