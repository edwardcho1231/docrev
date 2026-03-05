CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "Document"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

ALTER TABLE "Revision"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
