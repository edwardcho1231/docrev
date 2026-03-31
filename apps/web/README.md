# web

Next.js app for edwardcho.dev UI and API route handlers.

For full project setup, read the repo root README first.
For database-specific setup, read `../../packages/db/README.md`.

## Scope

- Public portfolio pages
- Publisher-only documents workspace
- Vercel Blob-backed document image uploads with markdown rendering
- API routes under `src/app/api/v1` (same origin)

## Required environment variables

Set in `apps/web/.env` for local development:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
DATABASE_URL=postgresql://USER:PASS@HOST:5432/DB_NAME
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```

Important:
- A malformed `DATABASE_URL` will fail runtime Prisma queries.
- `BLOB_READ_WRITE_TOKEN` is required for document image uploads.

## Document Images

- Supported upload types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/avif`
- Max upload size: `10 MB`
- Images can be uploaded only after a document has been created once, because uploads are stored under a document-scoped blob path.
- Uploading an image inserts standard markdown image syntax into the editor content.
- Markdown previews and published blog/project pages render uploaded images inline.

## Run

From repo root:

```bash
pnpm --filter web dev
```

Default URL: `http://localhost:3000`

Default API URLs:
- API base: `http://localhost:3000/api/v1`
- Health check: `http://localhost:3000/api/v1/health`

## API Endpoints

Current API routes in `src/app/api/v1`:

- `GET /api/v1/health`
  - Public
  - Returns `{ "status": "ok" }`

- `GET /api/v1/documents`
  - Requires Clerk auth and publisher access
  - Returns current user id and document list (including `latestRevision`)

- `POST /api/v1/documents`
  - Requires Clerk auth and publisher access
  - Body:
    - `title: string`
    - `content: string`
  - Creates a `Document`, creates initial `Revision`, then updates `latestRevisionId`

- `PUT /api/v1/documents/:id`
  - Requires Clerk auth and publisher access
  - Body:
    - `title: string`
    - `content: string`
  - Creates a new revision and updates `latestRevisionId`

- `DELETE /api/v1/documents/:id`
  - Requires Clerk auth and publisher access
  - Deletes the document and all associated revisions for the signed-in owner

- `GET /api/v1/revisions?documentId=<document-uuid>`
  - Requires Clerk auth and publisher access
  - Returns revisions for the document ordered by newest first

- `POST /api/v1/images/upload`
  - Requires Clerk auth and publisher access
  - Prepares a Vercel Blob client upload for a document-owned image path
  - Validates document ownership, content type, and max size before issuing the upload token

- `POST /api/v1/images/register`
  - Requires Clerk auth and publisher access
  - Verifies blob metadata and persists the uploaded image asset record for the document

- `GET /api/v1/documents/access`
  - Requires Clerk auth
  - Returns whether the signed-in user has publisher access to the documents workspace

## Testing Publisher-Only API Calls with curl

1. Sign in to the web app with a publisher-authorized account.
2. In browser console, get a fresh token:

```js
await window.Clerk.session.getToken()
```

3. Call API quickly (token is short-lived in local dev):

```bash
curl -i http://localhost:3000/api/v1/documents \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Origin: http://localhost:3000" \
  -H "Referer: http://localhost:3000/" \
  -H "Sec-Fetch-Dest: empty" \
  -H "X-Forwarded-Host: localhost:3000" \
  -H "X-Forwarded-Proto: http"
```

## Useful scripts

From repo root:

```bash
pnpm --filter web lint
pnpm --filter web test
pnpm --filter web build
```

## Deployment notes

- Framework: Next.js
- Root directory: `apps/web`
- Keep `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `DATABASE_URL` set in deployment environment.
