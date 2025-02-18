// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

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
    sessionId: text("session_id").notNull().unique(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
);

export const messages = createTable(
  "message",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    sessionId: text("session_id").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
    message: text('content').notNull(),
  },
);
