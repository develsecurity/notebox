# backend Agent Memory
## Project: DERCAS_20260310_094418
## Status: done

## Completed Steps
[2026-03-10T09:50:00Z] [DONE] Read ARCHITECTURE.md, API_CONTRACT.md, DB_SCHEMA.md
[2026-03-10T09:50:01Z] [DONE] Created src/app/api/notes/route.ts (GET list + POST create with Zod + Redis cache)
[2026-03-10T09:50:02Z] [DONE] Created src/app/api/notes/[id]/route.ts (GET single + DELETE with Redis invalidation)
[2026-03-10T09:50:03Z] [DONE] Fixed prisma.config.ts for Prisma 7 (datasource.url, no migrate/earlyAccess)
[2026-03-10T09:50:04Z] [DONE] Fixed db.ts for Prisma 7 (PrismaNeon adapter factory pattern)
[2026-03-10T09:50:05Z] [DONE] Installed @prisma/adapter-neon, @neondatabase/serverless, ws, @types/ws
[2026-03-10T09:50:06Z] [DONE] npm run build: SUCCESS

## Key Decisions
- Prisma 7.4.2: engine type "client" requires driver adapter. Used PrismaNeon factory (not Pool instance).
- Prisma 7 schema.prisma: no `url` in datasource block (forbidden). URL goes in prisma.config.ts datasource.url.
- Prisma 7 prisma.config.ts: valid keys are schema, datasource, migrations, experimental, tables, enums, views, typedSql. No earlyAccess, no migrate.
- Zod v4: use .issues not .errors on ZodError.
- Redis caching: notes:list:{page}:{pageSize} TTL 60s; notes:single:{id} TTL 60s. Invalidated on POST/DELETE.

## Files Created/Modified
- src/app/api/notes/route.ts (CREATED)
- src/app/api/notes/[id]/route.ts (CREATED)
- src/lib/db.ts (MODIFIED - Neon adapter)
- prisma.config.ts (MODIFIED - valid Prisma 7 config)
- prisma/schema.prisma (no url in datasource)

## Errors Encountered
- prisma.config.ts earlyAccess: true → removed (not in PrismaConfig type)
- prisma.config.ts migrate: {...} → removed (not in PrismaConfig type, adapter goes in db.ts)
- db.ts datasourceUrl in PrismaClient constructor → removed (Prisma 7 breaking change)
- schema.prisma url = env(...) → removed (Prisma 7 forbids it)
- PrismaNeon(pool) → PrismaNeon(config) because PrismaNeon is a factory accepting PoolConfig
- Zod v4 .errors → .issues
- ws missing types → installed @types/ws
