from app.services.retrieval import Evidence

REFUSAL = "Insufficient verified legal sources"


class CitationValidator:
    def validate(self, answer: str, evidence: list[Evidence]) -> tuple[bool, list[dict], str | None]:
        if not evidence:
            return False, [], "No retrieved evidence was available."

        citations = []
        for item in evidence[:5]:
            if not item.official_url and not item.storage_uri:
                continue
            quote = item.content[:420].strip()
            if len(quote) < 40:
                continue
            citations.append(
                {
                    "document_name": item.document_name,
                    "section": item.section_label,
                    "official_url": item.official_url,
                    "storage_uri": item.storage_uri,
                    "quote": quote,
                }
            )

        if not citations:
            return False, [], "Retrieved evidence had no verifiable source references."
        if REFUSAL.lower() in answer.lower():
            return False, citations, "Model refused because evidence was insufficient."
        return True, citations, None

