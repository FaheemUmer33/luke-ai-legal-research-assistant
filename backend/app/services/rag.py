from sqlalchemy.orm import Session
from app.models.legal import AnswerStatus, LegalAnswer
from app.schemas.legal import ResearchResponse
from app.services.ai_provider import AIProvider
from app.services.citation_validator import CitationValidator, REFUSAL
from app.services.retrieval import RetrievalService


class LegalRAGPipeline:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.retrieval = RetrievalService(db)
        self.ai = AIProvider()
        self.validator = CitationValidator()

    def answer(self, question: str, session_id=None, filters: dict | None = None) -> ResearchResponse:
        normalized = question.strip()
        if not normalized:
            return ResearchResponse(answer=REFUSAL, status="refused", citations=[], refusal_reason="Empty question.")

        evidence = self.retrieval.search(normalized, filters=filters)
        if not evidence:
            self._persist(session_id, normalized, REFUSAL, AnswerStatus.refused, [])
            return ResearchResponse(answer=REFUSAL, status="refused", citations=[], refusal_reason="No matching verified sources.")

        context = "\n\n".join(
            f"[{i}] {item.document_name} | {item.section_label} | {item.official_url or item.storage_uri}\n{item.content}"
            for i, item in enumerate(evidence, start=1)
        )
        system = (
            "You are LUKE, a Peruvian legal research assistant. Answer only from provided sources. "
            "Do not infer beyond evidence. If sources do not answer, say exactly: Insufficient verified legal sources. "
            "Every legal claim must be traceable to a cited source number."
        )
        user = f"Question: {normalized}\n\nVerified sources:\n{context}\n\nReturn a concise legal research answer with citations."
        draft = self.ai.complete(system, user)
        ok, citations, reason = self.validator.validate(draft, evidence)
        if not ok:
            self._persist(session_id, normalized, REFUSAL, AnswerStatus.validation_failed, citations)
            return ResearchResponse(answer=REFUSAL, status="validation_failed", citations=citations, refusal_reason=reason)

        final = f"{draft.strip()}\n\nCitations validated: {len(citations)} verified source(s)."
        self._persist(session_id, normalized, final, AnswerStatus.answered, citations)
        return ResearchResponse(answer=final, status="answered", citations=citations)

    def _persist(self, session_id, question: str, answer: str, status: AnswerStatus, citations: list[dict]) -> None:
        self.db.add(LegalAnswer(session_id=session_id, question=question, answer=answer, status=status, citations=citations))
        self.db.commit()

