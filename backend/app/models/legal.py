import enum
import uuid
from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer, JSON, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.db.session import Base


class SourceType(str, enum.Enum):
    constitution = "constitution"
    law = "law"
    decree = "decree"
    regulation = "regulation"
    agency_resolution = "agency_resolution"
    ministry_guidance = "ministry_guidance"
    memo = "memo"
    contract = "contract"


class ProcessingStatus(str, enum.Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class AnswerStatus(str, enum.Enum):
    answered = "answered"
    refused = "refused"
    validation_failed = "validation_failed"


class Organization(Base):
    __tablename__ = "organizations"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String)
    slug: Mapped[str] = mapped_column(String, unique=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    email: Mapped[str] = mapped_column(String, unique=True)
    full_name: Mapped[str] = mapped_column(String)
    password_hash: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String, default="member")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class LegalSource(Base):
    __tablename__ = "legal_sources"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    base_url: Mapped[str] = mapped_column(String)
    jurisdiction: Mapped[str] = mapped_column(String, default="Peru")
    authority_level: Mapped[int] = mapped_column(Integer)
    freshness_priority: Mapped[int] = mapped_column(Integer, default=5)
    reliability_score: Mapped[float] = mapped_column(Numeric(4, 3), default=0.95)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class LegalDocument(Base):
    __tablename__ = "legal_documents"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("legal_sources.id"))
    title: Mapped[str] = mapped_column(String)
    document_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    official_url: Mapped[str | None] = mapped_column(String)
    storage_uri: Mapped[str | None] = mapped_column(String)
    publication_date: Mapped[Date | None] = mapped_column(Date)
    checksum: Mapped[str | None] = mapped_column(String)
    status: Mapped[ProcessingStatus] = mapped_column(Enum(ProcessingStatus), default=ProcessingStatus.queued)
    source: Mapped[LegalSource] = relationship()


class LegalSection(Base):
    __tablename__ = "legal_sections"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("legal_documents.id"))
    section_label: Mapped[str] = mapped_column(String)
    title: Mapped[str | None] = mapped_column(String)
    body: Mapped[str] = mapped_column(Text)
    page_start: Mapped[int | None] = mapped_column(Integer)
    page_end: Mapped[int | None] = mapped_column(Integer)
    official_anchor: Mapped[str | None] = mapped_column(String)
    document: Mapped[LegalDocument] = relationship()


class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    section_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("legal_sections.id"))
    chunk_index: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))
    metadata_: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    section: Mapped[LegalSection] = relationship()


class Citation(Base):
    __tablename__ = "citations"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    section_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("legal_sections.id"))
    document_name: Mapped[str] = mapped_column(String)
    section_label: Mapped[str] = mapped_column(String)
    official_url: Mapped[str | None] = mapped_column(String)
    storage_uri: Mapped[str | None] = mapped_column(String)
    quote: Mapped[str] = mapped_column(Text)


class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    filename: Mapped[str] = mapped_column(String)
    storage_uri: Mapped[str] = mapped_column(String)
    mime_type: Mapped[str] = mapped_column(String)
    status: Mapped[ProcessingStatus] = mapped_column(Enum(ProcessingStatus), default=ProcessingStatus.queued)
    summary: Mapped[str | None] = mapped_column(Text)


class ContractClause(Base):
    __tablename__ = "contract_clauses"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    uploaded_document_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("uploaded_documents.id"))
    clause_type: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    body: Mapped[str] = mapped_column(Text)
    risk_level: Mapped[str] = mapped_column(String, default="medium")
    risk_reason: Mapped[str | None] = mapped_column(Text)
    missing_recommendation: Mapped[str | None] = mapped_column(Text)


class ResearchSession(Base):
    __tablename__ = "research_sessions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String)


class LegalAnswer(Base):
    __tablename__ = "legal_answers"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("research_sessions.id"))
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text)
    status: Mapped[AnswerStatus] = mapped_column(Enum(AnswerStatus))
    citations: Mapped[list] = mapped_column(JSON, default=list)


class RegulatoryUpdate(Base):
    __tablename__ = "regulatory_updates"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("legal_sources.id"))
    title: Mapped[str] = mapped_column(String)
    official_url: Mapped[str] = mapped_column(String)
    summary: Mapped[str | None] = mapped_column(Text)
    status: Mapped[ProcessingStatus] = mapped_column(Enum(ProcessingStatus), default=ProcessingStatus.queued)


class FeedbackLog(Base):
    __tablename__ = "feedback_logs"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    answer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("legal_answers.id"))
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    rating: Mapped[int | None] = mapped_column(Integer)
    comment: Mapped[str | None] = mapped_column(Text)
