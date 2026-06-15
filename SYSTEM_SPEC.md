# LUKE System Spec

## 1. System Architecture Overview

LUKE is split into a Next.js frontend, FastAPI API, PostgreSQL/pgvector database, Redis queue, and Celery workers. The RAG flow is strict: understand query, retrieve verified legal sections, rank by source authority, assemble context, generate with an LLM, validate citations, and refuse if evidence is missing.

## 2. Folder Structure

```text
backend/app/api/routes     Auth, research, documents, contracts, admin APIs
backend/app/models         SQLAlchemy models for the legal domain
backend/app/services       Retrieval, ranking support, citation validation, contracts
backend/app/ai             llm_client facade and explicit RAG step modules
backend/app/storage        Local filesystem storage abstraction, S3-swappable later
backend/app/workers        Celery app and ingestion tasks
backend/migrations         PostgreSQL schema with pgvector
backend/alembic            Migration environment placeholder for production phases
backend/tests              Test plan placeholder for auth/RAG/contract tests
frontend/src/app           Dashboard, research, documents, contracts, admin routes
frontend/src/components    shadcn-style primitives and LUKE SaaS components
scripts                    Local seed workflow
```

## 3. Database Schema

The canonical SQL schema is in `backend/migrations/001_init.sql`. ORM models are in `backend/app/models/legal.py`. Tables: `users`, `organizations`, `legal_sources`, `legal_documents`, `legal_sections`, `document_chunks`, `citations`, `uploaded_documents`, `contract_clauses`, `research_sessions`, `legal_answers`, `regulatory_updates`, and `feedback_logs`.

## 4. Backend Code

FastAPI starts at `backend/app/main.py`. API routes are split by domain: auth, research, document upload, contract inspection, and admin source/system health.

## 5. Worker Code

Celery is configured in `backend/app/workers/celery_app.py`. Tasks in `backend/app/workers/tasks.py` analyze uploaded contracts, ingest official legal documents, create chunks, and generate embeddings.

## 6. AI/RAG Pipeline Code

`backend/app/services/rag.py` implements the runtime seven-step pipeline. `backend/app/ai` contains explicit phase-style modules for query understanding, retrieval, ranking, context assembly, answer generation, citation validation, and response formatting. `retrieval.py` performs hybrid vector and lexical retrieval with authority ranking. `citation_validator.py` blocks output without document name, section, and official URL or stored reference.

## 7. Frontend Next.js Code

The App Router pages live in `frontend/src/app`: `/dashboard`, `/research`, `/documents`, `/contracts/[id]`, and `/admin`. The root route redirects to `/dashboard`.

## 8. UI Components

Reusable UI lives in `frontend/src/components/ui`. LUKE-specific shell, headers, 3D depth, and research console live in `frontend/src/components/luke`. The UI uses dark glass panels, subtle blue/violet lighting, animated citation cards, skeleton states, and responsive layouts.

## 9. Docker Setup

`docker-compose.yml` runs PostgreSQL with pgvector, Redis, backend, and Celery worker. `backend/Dockerfile` builds the Python service.

## 10. Deployment Guide

Use Vercel for `frontend` with `NEXT_PUBLIC_API_URL`. Use Render for backend web and worker services with managed PostgreSQL and Redis. Required production variables are listed in `.env.example`.

## 11. Local Run Guide

Copy `.env.example` to `.env`, run `docker compose up -d postgres redis`, apply `backend/migrations/001_init.sql`, run `docker compose run --rm backend python scripts/seed.py`, then run `docker compose up backend worker`. Start the frontend from `frontend` with `npm install && npm run dev`.
