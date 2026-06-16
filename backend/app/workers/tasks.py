from pathlib import Path
from pypdf import PdfReader
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.legal import DocumentChunk, LegalDocument, LegalSection, ProcessingStatus
from app.services.ai_provider import AIProvider
from app.services.contracts import ContractAnalyzer
from app.workers.celery_app import celery_app


def _read_text(path: str) -> str:
    file_path = Path(path)
    if file_path.suffix.lower() == ".pdf":
        return "\n".join(page.extract_text() or "" for page in PdfReader(path).pages)
    return file_path.read_text(encoding="utf-8", errors="ignore")


@celery_app.task
def analyze_contract_task(uploaded_document_id: str, path: str) -> None:
    with SessionLocal() as db:
        ContractAnalyzer(db).analyze(uploaded_document_id, _read_text(path))


@celery_app.task
def ingest_legal_document_task(document_id: str, path: str | None = None) -> None:
    ai = AIProvider()
    with SessionLocal() as db:
        doc = db.get(LegalDocument, document_id)
        if not doc:
            return
        doc.status = ProcessingStatus.processing
        text = _read_text(path or doc.storage_uri or "")
        sections = [part.strip() for part in text.split("\n\n") if len(part.strip()) > 120]
        for index, body in enumerate(sections[:200], start=1):
            section = LegalSection(document_id=doc.id, section_label=f"Seccion {index}", title=None, body=body)
            db.add(section)
            db.flush()
            chunk = DocumentChunk(section_id=section.id, chunk_index=0, content=body[:3000], embedding=ai.embed(body[:3000]), metadata_={})
            db.add(chunk)
        doc.status = ProcessingStatus.completed
        db.commit()


@celery_app.task
def check_regulatory_updates_task() -> dict:
    return {"status": "scheduled", "message": "Connect official source crawlers for El Peruano, SPIJ, ministries, and agencies."}
