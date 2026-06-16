from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    database_url: str
    sync_database_url: str = "postgresql://luke:luke@localhost:5432/luke"
    supabase_pooler_url: str | None = None
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str
    jwt_issuer: str = "luke-ai"
    ai_provider: str = "openai"
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    storage_root: str = "./storage"
    frontend_origin: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=ROOT_DIR / ".env", extra="ignore")

    @property
    def effective_database_url(self) -> str:
        url = (self.supabase_pooler_url or self.database_url).strip()
        if url.startswith("postgresql+psycopg://"):
            return url
        if url.startswith("postgresql://"):
            return "postgresql+psycopg://" + url[len("postgresql://") :]
        if url.startswith("postgres://"):
            return "postgresql+psycopg://" + url[len("postgres://") :]
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
