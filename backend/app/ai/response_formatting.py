def format_response(answer: str, citations: list[dict], status: str, refusal_reason: str | None = None) -> dict:
    confidence = 0 if not citations else min(0.95, 0.55 + len(citations) * 0.08)
    return {
        "answer": answer,
        "status": status,
        "citations": citations,
        "confidence": confidence,
        "refusal_reason": refusal_reason,
    }

