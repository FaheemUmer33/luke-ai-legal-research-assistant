from app.ai.llm_client import LLMClient


SYSTEM_PROMPT = (
    "You are LUKE, a Peruvian legal research assistant. Answer only from provided sources. "
    "If the sources do not answer the question, say exactly: Insufficient verified legal sources. "
    "Every legal claim must be traceable to a provided source."
)


def generate_answer(question: str, context: str) -> str:
    return LLMClient().complete(SYSTEM_PROMPT, f"Question: {question}\n\nVerified sources:\n{context}")

