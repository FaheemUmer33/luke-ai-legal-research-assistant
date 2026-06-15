Alembic migration environment placeholder.

The canonical initial schema is currently maintained at `backend/migrations/001_init.sql`
so the database can be brought up quickly through Docker Compose. In a production
phase, initialize Alembic here and mirror future migrations from the SQLAlchemy
models in `backend/app/models`.

