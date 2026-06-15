from dataclasses import dataclass
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.services.ai_provider import AIProvider


@dataclass
class Evidence:
    chunk_id: str
    content: str
    document_name: str
    section_label: str
    official_url: str | None
    storage_uri: str | None
    authority_level: int
    reliability_score: float


class RetrievalService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.ai = AIProvider()

    def search(self, query: str, filters: dict | None = None, limit: int = 8) -> list[Evidence]:
        embedding = self.ai.embed(query)
        params = {"query": query, "embedding": str(embedding), "limit": limit}
        rows = self.db.execute(
            text(
                """
                SELECT c.id, c.content, d.title AS document_name, s.section_label,
                       d.official_url, d.storage_uri, src.authority_level, src.reliability_score,
                       ts_rank(c.tsv, plainto_tsquery('spanish', :query)) AS lexical_rank,
                       1 - (c.embedding <=> (:embedding)::vector) AS vector_rank
                FROM document_chunks c
                JOIN legal_sections s ON s.id = c.section_id
                JOIN legal_documents d ON d.id = s.document_id
                JOIN legal_sources src ON src.id = d.source_id
                WHERE src.is_active = true
                ORDER BY (COALESCE(ts_rank(c.tsv, plainto_tsquery('spanish', :query)), 0) * 0.35)
                       + ((1 - (c.embedding <=> (:embedding)::vector)) * 0.45)
                       + (src.authority_level::float / 100 * 0.20) DESC
                LIMIT :limit
                """
            ),
            params,
        ).mappings()
        evidence = [
            Evidence(
                chunk_id=str(row["id"]),
                content=row["content"],
                document_name=row["document_name"],
                section_label=row["section_label"],
                official_url=row["official_url"],
                storage_uri=row["storage_uri"],
                authority_level=row["authority_level"],
                reliability_score=float(row["reliability_score"]),
            )
            for row in rows
        ]
        return sorted(evidence, key=lambda item: (item.authority_level, item.reliability_score), reverse=True)
