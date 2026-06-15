def understand_query(question: str) -> dict:
    normalized = question.strip()
    keywords = [part.strip(".,;:()").lower() for part in normalized.split() if len(part.strip(".,;:()")) > 3]
    return {"question": normalized, "keywords": keywords[:12], "intent": "legal_research"}

