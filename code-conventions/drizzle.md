# Drizzle ORM Rules (Delta)

> These rules complement [`javascript.md`](javascript.md) and [`database.md`](database.md). Only Drizzle-specific conventions are listed here.

## Schema Design

- One schema file per domain: `src/db/schema/users.ts`, `src/db/schema/posts.ts`
- Export barrel: `src/db/schema/index.ts` re-exports all schemas
- Always export Select and Insert types:

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Critical Rules

- **Never change primary key types** — breaks migrations irreversibly
- **Array syntax**: `text('field').array()` — NOT `array(text(...))`
- **Timestamps**: use `integer('field', { mode: 'timestamp' })` for SQLite/D1 (no native date type)
- **Never write SQL migrations manually** — use `drizzle-kit generate`
- **Never hardcode credentials** in `drizzle.config.ts`

## Migrations

```bash
npx drizzle-kit generate    # generate migration from schema diff
npx drizzle-kit migrate     # apply pending migrations
npx drizzle-kit push        # push schema directly (dev only)
npx drizzle-kit studio      # visual schema browser
```

- Always test migrations locally before production
- Review generated SQL before applying
- Never edit generated migration files after they've been applied

## Query Patterns

```ts
// Select with filter
const activeUsers = await db.select()
  .from(users)
  .where(eq(users.status, 'active'))
  .orderBy(desc(users.createdAt))
  .limit(10);

// Insert
const [user] = await db.insert(users)
  .values({ name: 'John', email: 'john@example.com' })
  .returning();

// Update
await db.update(users)
  .set({ name: 'Jane' })
  .where(eq(users.id, userId));

// Delete
await db.delete(users).where(eq(users.id, userId));
```

## Relations

```ts
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

- Define relations in separate `*.relations.ts` files or alongside schema
- Use `db.query.*` API for relation queries (not raw joins)

## Transactions

- Use `db.batch()` for D1/SQLite multi-statement operations
- Never use raw `BEGIN TRANSACTION` SQL with D1
- For PostgreSQL/MySQL, use `db.transaction()`:

```ts
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values(data).returning();
  await tx.insert(profiles).values({ userId: user.id });
});
```

## D1-Specific

- Driver: `d1-http` dialect: `sqlite`
- D1 binding name in `wrangler.jsonc` must match TypeScript interface property
- Max database size: 10 GB (paid), 500 MB (free)
- Use `db.batch()` instead of transactions

## PostgreSQL-Specific (Neon, Supabase)

- Driver: `@neondatabase/serverless` or `pg`
- Use `pgTable` from `drizzle-orm/pg-core`
- Native `timestamp`, `json`, `jsonb`, `uuid` types available
- Use `drizzle-kit push` for rapid prototyping, `generate` + `migrate` for production

## Anti-Patterns

- No raw SQL for CRUD — use the query builder
- No `SELECT *` — always specify columns or use typed select
- No skipping migration review — always check generated SQL
- No mixing Drizzle transactions with raw SQL transactions
