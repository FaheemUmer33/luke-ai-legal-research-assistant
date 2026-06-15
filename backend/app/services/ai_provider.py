from app.core.config import get_settings


class AIProvider:
    def __init__(self) -> None:
        self.settings = get_settings()

    def embed(self, text: str) -> list[float]:
        if self.settings.openai_api_key:
            from openai import OpenAI

            client = OpenAI(api_key=self.settings.openai_api_key)
            result = client.embeddings.create(model="text-embedding-3-small", input=text[:8000])
            return result.data[0].embedding
        seed = abs(hash(text)) % 997
        return [((seed + i * 31) % 1000) / 1000 for i in range(1536)]

    def complete(self, system: str, user: str) -> str:
        if self.settings.ai_provider == "anthropic" and self.settings.anthropic_api_key:
            from anthropic import Anthropic

            client = Anthropic(api_key=self.settings.anthropic_api_key)
            msg = client.messages.create(
                model="claude-3-5-sonnet-latest",
                max_tokens=1200,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            return msg.content[0].text
        if self.settings.openai_api_key:
            from openai import OpenAI

            client = OpenAI(api_key=self.settings.openai_api_key)
            result = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
                temperature=0,
            )
            return result.choices[0].message.content or ""
        return "Insufficient verified legal sources"

