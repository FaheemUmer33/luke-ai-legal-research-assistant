# LUKE – AI Legal Research Assistant for Peruvian Law

**Suggested GitHub repository name:** `luke-ai-legal-research-assistant`

**Suggested GitHub description:**  
Citation-first AI legal research and contract intelligence platform for Peruvian law, built with Next.js, FastAPI, PostgreSQL/pgvector, Redis, and Celery.

LUKE is a production-style full-stack SaaS platform for legal research and document intelligence. It is designed around a strict retrieval-first architecture: the system retrieves verified legal sources before any AI answer is generated, and every legal response must include traceable citations.

> This project is built for portfolio demonstration and engineering evaluation. It is not legal advice and should be connected to verified official legal corpora before production legal use.

## Core Principles

- **Retrieval first:** LUKE never calls the LLM for legal Q&A unless relevant source chunks are retrieved first.
- **Citation first:** every legal answer must include a document name, article or section, and official URL or stored document reference.
- **No hallucinated law:** if verified evidence is missing, LUKE returns exactly:

```text
Insufficient verified legal sources
```

- **Authority-aware ranking:** Peruvian legal materials are ranked by authority, freshness, and reliability.
- **Production SaaS shape:** separate frontend, backend, database, workers, storage abstraction, admin controls, and deployment path.

## Features

### Legal Research

- Chat-style legal Q&A interface
- Retrieval-gated answer generation
- Hybrid search using vector similarity, lexical search, and metadata
- Citation validation before final response
- Clickable citation panel with source viewer

### Contract Intelligence

- Contract/PDF upload workflow
- Async processing through Celery workers
- Clause extraction and risk indicators
- Missing-clause detection
- Contract detail page with review actions

### Legal Source Registry

- Admin-managed legal sources
- Source authority levels
- Jurisdiction, freshness priority, and reliability scoring
- Seed support for El Peruano, SPIJ, ministries, and agencies

### Admin Panel

- Source registry management
- System health cards
- Ingestion log viewer
- Backend/offline fallback states for UI demonstration

### Professional Frontend

- Next.js App Router
- Dark enterprise UI
- Glassmorphism cards
- Framer Motion transitions
- Responsive sidebar/mobile navigation
- Subtle React Three Fiber dashboard accent

## Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn-style UI primitives
- Framer Motion
- React Three Fiber / Three.js
- Lucide icons

### Backend

- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- pgvector
- Redis
- Celery
- JWT auth with access and refresh tokens

### AI Layer

- Custom RAG orchestration in `backend/app/ai`
- Swappable AI provider abstraction
- OpenAI or Anthropic compatible configuration
- Citation validator
- Refusal path when evidence is missing

### Storage

- Local filesystem storage abstraction under `backend/app/storage`
- Designed to be S3-swappable later

## Architecture

```text
User
  |
  v
Next.js Frontend
  |
  v
FastAPI API
  |
  +--> PostgreSQL + pgvector
  +--> Redis Queue
  +--> Celery Workers
  +--> Local/S3-style Storage
  |
  v
RAG Pipeline
  1. Query understanding
  2. Hybrid retrieval
  3. Authority ranking
  4. Context assembly
  5. LLM answer generation
  6. Citation validation
  7. Final response formatting
```

## Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── ai/                 # RAG steps and LLM client facade
│   │   ├── api/routes/         # FastAPI routers
│   │   ├── core/               # Config and security
│   │   ├── db/                 # SQLAlchemy session
│   │   ├── models/             # ORM models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Retrieval, RAG, citation, contract services
│   │   ├── storage/            # Local storage abstraction
│   │   ├── workers/            # Celery app and tasks
│   │   └── main.py
│   ├── migrations/             # Initial PostgreSQL/pgvector schema
│   ├── alembic/                # Migration environment placeholder
│   ├── tests/                  # Test plan placeholder
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/app/                # App Router pages
│   ├── src/components/         # UI and LUKE product components
│   ├── src/lib/                # API client and demo data
│   ├── Dockerfile
│   └── package.json
├── scripts/
│   └── seed.py                 # Seed legal sources and sample text
├── docker-compose.yml
├── package.json                # Root convenience scripts
├── .env.example
└── README.md
```

## Main Pages

- `/dashboard` – operational overview, live metrics, recent questions, regulatory alerts
- `/research` – citation-first legal research chat with source viewer
- `/documents` – upload and processing workflow for contracts/legal PDFs
- `/contracts/[id]` – clause breakdown, risk filters, missing-clause review
- `/admin` – source registry, ingestion logs, and health status

## Local Setup

### 1. Clone and enter the project

```bash
git clone https://github.com/YOUR_USERNAME/luke-ai-legal-research-assistant.git
cd luke-ai-legal-research-assistant
```

If you are using the current local folder:

```bash
cd "/Users/nabeel/Desktop/Faheem/Faheem/Projects/LUKE - AI"
```

### 2. Create environment file

```bash
cp .env.example .env
```

Update `.env` if needed:

```env
DATABASE_URL=postgresql+psycopg://luke:luke@localhost:5432/luke
SYNC_DATABASE_URL=postgresql://luke:luke@localhost:5432/luke
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=replace-with-a-strong-secret
AI_PROVIDER=openai
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
STORAGE_ROOT=./storage
FRONTEND_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Start database and Redis

```bash
docker compose up -d postgres redis
```

### 5. Apply database schema

```bash
docker compose exec postgres psql -U luke -d luke -f /migrations/001_init.sql
```

### 6. Seed sample legal data

```bash
docker compose run --rm backend python scripts/seed.py
```

Demo login seeded by the script:

```text
Email: admin@luke.pe
Password: luke-demo
```

### 7. Run the app

Frontend only:

```bash
npm run dev
```

Backend:

```bash
npm run dev:backend
```

Worker:

```bash
npm run worker
```

Full Docker stack:

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000
```

If port `3000` is already busy, Next.js may choose another port such as `3001`.

## Root Commands

Run these from the project root:

```bash
npm run dev          # Start frontend
npm run build        # Build frontend
npm run dev:backend  # Start FastAPI backend
npm run worker       # Start Celery worker
npm run db:up        # Start Postgres + Redis
npm run db:migrate   # Apply SQL schema
npm run seed         # Seed sample legal data
npm run stack        # Start full Docker stack
```

## Backend API Highlights

```text
GET    /health
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/research/ask
POST   /api/documents/upload
GET    /api/documents
GET    /api/contracts/{id}
GET    /api/admin/health
GET    /api/admin/sources
POST   /api/admin/sources
```

## RAG Safety Flow

LUKE’s legal Q&A pipeline is intentionally conservative:

1. Normalize and understand the query.
2. Retrieve candidate legal chunks from pgvector and lexical search.
3. Rank evidence by legal authority, freshness, and reliability.
4. Assemble context only from retrieved chunks.
5. Generate an answer using only that context.
6. Validate that citations map to retrieved evidence.
7. Return the final answer or refuse.

If retrieval fails or citations cannot be validated:

```text
Insufficient verified legal sources
```

## Deployment

### Frontend: Vercel

Recommended settings:

```text
Root Directory: frontend
Build Command: npm run build
Output: Next.js default
```

Environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Backend: Render

Render is a good fit for this project because it supports:

- FastAPI web services
- Background workers
- Managed PostgreSQL
- Managed Redis
- Environment variable management

Web service:

```text
Root: backend
Build: pip install -r requirements.txt
Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Worker service:

```text
Root: backend
Build: pip install -r requirements.txt
Start: celery -A app.workers.celery_app.celery_app worker --loglevel=info
```

Production environment variables:

```env
DATABASE_URL=
SYNC_DATABASE_URL=
REDIS_URL=
JWT_SECRET=
JWT_ISSUER=luke-ai
AI_PROVIDER=openai
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
STORAGE_ROOT=/app/storage
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

## Production Checklist

- Replace seed/sample legal excerpts with verified official legal documents.
- Enable Alembic migrations for ongoing schema changes.
- Use strong JWT secrets.
- Configure CORS for the deployed frontend domain only.
- Add persistent object storage such as S3.
- Add managed pgvector indexes after production data volume is known.
- Run backend tests for auth, retrieval, ranking, citation validation, and refusal paths.
- Monitor Celery queues and worker failures.
- Add audit logging for admin changes.

## Current Verification

The project has been verified with:

```bash
npm run build
python3 -m compileall backend/app scripts
```

## License

This project is provided for portfolio and educational use. Add a formal license before public distribution.

