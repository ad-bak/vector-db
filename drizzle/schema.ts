import {
  pgTable,
  timestamp,
  text,
  integer,
  serial,
  vector,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const movie = pgTable("Movie", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  releaseYear: integer("releaseYear").notNull(),
  genre: text("genre").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  vector: vector("vector", { dimensions: 1536 }),
});

export type Movie = typeof movie.$inferSelect;
