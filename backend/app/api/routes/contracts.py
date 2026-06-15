from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.legal import ContractClause, UploadedDocument

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.get("/{contract_id}")
def get_contract(contract_id: str, db: Session = Depends(get_db)) -> dict:
    doc = db.get(UploadedDocument, contract_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Contract not found")
    clauses = db.scalars(select(ContractClause).where(ContractClause.uploaded_document_id == doc.id)).all()
    return {
        "id": str(doc.id),
        "filename": doc.filename,
        "status": doc.status.value,
        "summary": doc.summary,
        "clauses": [
            {
                "id": str(clause.id),
                "title": clause.title,
                "clause_type": clause.clause_type,
                "risk_level": clause.risk_level,
                "risk_reason": clause.risk_reason,
                "missing_recommendation": clause.missing_recommendation,
                "body": clause.body,
            }
            for clause in clauses
        ],
    }

