from sqlalchemy.orm import Session
from app.models.legal import ContractClause, ProcessingStatus, UploadedDocument
from app.services.ai_provider import AIProvider


EXPECTED_CLAUSES = ["Partes", "Objeto", "Plazo", "Contraprestacion", "Confidencialidad", "Terminacion", "Ley aplicable"]


class ContractAnalyzer:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.ai = AIProvider()

    def analyze(self, uploaded_document_id: str, text: str) -> None:
        doc = self.db.get(UploadedDocument, uploaded_document_id)
        if not doc:
            return
        doc.status = ProcessingStatus.processing
        prompt = (
            "Extract contract clauses from this Spanish/Peruvian legal document. "
            "Return a practical executive summary and identify risky or missing clauses.\n\n"
            + text[:12000]
        )
        summary = self.ai.complete("You analyze contracts. Do not provide legal advice beyond the text.", prompt)
        doc.summary = summary
        found = {name for name in EXPECTED_CLAUSES if name.lower() in text.lower()}
        for name in EXPECTED_CLAUSES:
            missing = name not in found
            self.db.add(
                ContractClause(
                    uploaded_document_id=doc.id,
                    clause_type=name.lower().replace(" ", "_"),
                    title=name,
                    body="Detected in uploaded text." if not missing else "Clause not detected in uploaded text.",
                    risk_level="high" if missing and name in {"Terminacion", "Ley aplicable"} else ("medium" if missing else "low"),
                    risk_reason="Expected clause is missing or unclear." if missing else "Clause appears present.",
                    missing_recommendation=f"Add a clear {name} clause." if missing else None,
                )
            )
        doc.status = ProcessingStatus.completed
        self.db.commit()

