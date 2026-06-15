from app.services.ai_provider import AIProvider


class LLMClient(AIProvider):
    """Swappable AI client facade used by the legal RAG pipeline."""

