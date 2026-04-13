---
extends: [javascript, database]
---

# Prisma Rules (Delta)

> These rules complement [`javascript.md`](javascript.md) and [`database.md`](database.md). Only Prisma-specific conventions are listed here.

## v7 Configuration

Prisma v7 uses `prisma.config.ts` — no auto environment loading:

```ts
// prisma.config.ts
import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
});
```

- Requires explicit driver adapters (e.g., `@prisma/adapter-pg` for PostgreSQL)
- Node.js 20.19.0+ and TypeScript 5.4.0+ required
- MongoDB is NOT supported in v7 — use v6

## Schema Design

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@map("users")
}

model Post {
  id       String @id @default(cuid())
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  @@map("posts")
}
```

- Use `@@map` to control table names (snake_case in DB, PascalCase in schema)
- Always add `@@index` for frequently queried foreign keys
- Use `@default(cuid())` or `@default(uuid())` for IDs — never auto-increment for distributed systems
- `@updatedAt` for automatic timestamp management
- Optional fields with `?` — never nullable without reason

## Client Usage

```ts
import { PrismaClient } from '@prisma/client';

// Singleton pattern
const prisma = new PrismaClient();

// Select specific fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true },
});

// Include relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true },
});

// Nested create
const user = await prisma.user.create({
  data: {
    name: 'John',
    email: 'john@example.com',
    posts: { create: [{ title: 'First Post' }] },
  },
});
```

## Query Patterns

- Use `select` to pick specific fields — never fetch entire rows when unnecessary
- Use `include` for eager loading relations — be explicit about depth
- `findUnique` for single record by unique field, `findFirst` for first match
- `upsert` for create-or-update patterns
- `count`, `aggregate`, `groupBy` for analytics queries

## Transactions

```ts
// Array transaction (simple, auto-batched)
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.post.create({ data: postData }),
]);

// Interactive transaction (complex logic)
await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');
  await tx.user.update({ where: { id }, data: { credits: user.credits - 1 } });
});
```

- Use array transactions for independent operations
- Use interactive transactions for dependent operations
- Set `timeout` and `maxWait` for long-running transactions

## Migrations

```bash
npx prisma generate          # regenerate client after schema changes
npx prisma migrate dev       # create + apply migration (dev only)
npx prisma migrate deploy    # apply pending migrations (production)
npx prisma db push           # push schema without migration (prototyping)
npx prisma studio            # visual data browser
npx prisma validate          # validate schema syntax
npx prisma format            # format schema file
```

- Always run `prisma generate` after schema changes
- Use `migrate dev --name descriptive-name` for named migrations
- Never edit applied migration files
- Use `db push` only for prototyping — `migrate` for production

## Raw SQL

```ts
// Safe parameterized query
const users = await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;

// Execute (returns affected rows count)
await prisma.$executeRaw`UPDATE users SET name = ${name} WHERE id = ${id}`;
```

- Always use tagged template literals for parameterization — never string concatenation
- Use `$queryRaw` for reads, `$executeRaw` for writes

## Bun Runtime

- Use `bunx --bun prisma ...` — prevents fallback to Node.js
- Applies to all CLI commands: `generate`, `migrate`, `studio`

## D1 / Cloudflare

- Use `@prisma/adapter-d1` driver adapter
- Configure in `prisma.config.ts` with D1 binding
- Refer to [`cloudflare.md`](cloudflare.md) for D1-specific limits

## Anti-Patterns

- No `findMany` without `take` / pagination — always limit results
- No raw SQL for standard CRUD — use Prisma Client
- No `$queryRawUnsafe` / `$executeRawUnsafe` — SQL injection risk
- No fetching entire relations when you need one field — use `select`
- No singleton issues: use a single `PrismaClient` instance, not one per request
- No skipping `prisma generate` after schema changes
