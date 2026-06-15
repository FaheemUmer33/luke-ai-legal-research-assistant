from uuid import UUID
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.legal import UploadedDocument
from app.storage.local import get_storage
from app.workers.tasks import analyze_contract_task

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
def upload_contract(file: UploadFile = File(...), db: Session = Depends(get_db)) -> dict:
    storage_uri = get_storage().save_upload(file)
    doc = UploadedDocument(
        organization_id=UUID("00000000-0000-0000-0000-000000000001"),
        filename=file.filename,
        storage_uri=storage_uri,
        mime_type=file.content_type or "application/octet-stream",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    analyze_contract_task.delay(str(doc.id), storage_uri)
    return {"id": str(doc.id), "status": doc.status.value}


@router.get("")
def list_documents(db: Session = Depends(get_db)) -> list[dict]:
    docs = db.scalars(select(UploadedDocument).order_by(UploadedDocument.filename)).all()
    return [{"id": str(doc.id), "filename": doc.filename, "status": doc.status.value, "summary": doc.summary} for doc in docs]
