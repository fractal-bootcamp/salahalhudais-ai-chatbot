// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `chatbotrerun_${name}`);

export const sessions = createTable(
  "session",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title").default("New Chat"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
);

export const messages = createTable(
  "message",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    sessionId: integer("session_id").references(() => sessions.id),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
    message: text('content').notNull(),
    role: text("role", { enum: ["user", "assistant"] }).notNull(),
  },
);
