from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    sync_database_url: str = "postgresql://luke:luke@localhost:5432/luke"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str
    jwt_issuer: str = "luke-ai"
    ai_provider: str = "openai"
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    storage_root: str = "./storage"
    frontend_origin: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

