# @repo/db

Prisma schema and database client package for edwardcho.dev.

## Scope

- Prisma schema: `prisma/schema.prisma`
- SQL migrations: `prisma/migrations/*`
- Shared Prisma client export: `index.js`

## Required environment variable

```env
DATABASE_URL=postgresql://USER:PASS@HOST:5432/DB_NAME
```

`DATABASE_URL` is required at runtime. `index.js` throws if it is missing.
A malformed `DATABASE_URL` will fail runtime Prisma queries.

## Optional SSL certificate env

If your provider requires a custom root CA cert (for example some Supabase setups), set:

```env
SUPABASE_CA_CERT=-----BEGIN CERTIFICATE-----...
```

The package writes this cert to `/tmp/supabase-ca.crt` and sets `PGSSLROOTCERT` automatically when `SUPABASE_CA_CERT` is present.

## Database Setup (Prisma)

From repo root:

```bash
pnpm --filter @repo/db exec prisma generate
pnpm --filter @repo/db exec prisma migrate deploy
```

Use `prisma generate` after schema/client changes, and `prisma migrate deploy` to apply committed migrations to the target database.

Optional:

```bash
pnpm --filter @repo/db exec prisma studio
```
