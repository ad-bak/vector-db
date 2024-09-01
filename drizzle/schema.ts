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

export const movieEmbedding = pgTable("MovieEmbedding", {
  id: serial("id").primaryKey().notNull(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movie.id),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type MovieEmbedding = typeof movieEmbedding.$inferSelect;
