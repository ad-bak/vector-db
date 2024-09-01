import { db } from "@/drizzle/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import { sql } from "drizzle-orm";
import { movie, movieEmbedding } from "@/drizzle/schema";
import { QueryResult } from "pg";

interface MovieWithDistance {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  distance: number;
}

class VectorStore {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async searchSimilarMovies(
    query: string,
    k: number = 5
  ): Promise<MovieWithDistance[]> {
    try {
      const queryEmbedding = await this.embeddings.embedQuery(query);
      const embeddingString = queryEmbedding.map((x) => x.toFixed(6)).join(",");
      const embeddingArrayString = `ARRAY[${embeddingString}]::float4[]`;

      const results: QueryResult = await db.execute(sql`
        SELECT m.id, m.title, m.description, m."releaseYear", m.genre,
               me.embedding <=> ${sql.raw(
                 embeddingArrayString
               )}::vector(1536) AS distance
        FROM ${movie} m
        JOIN ${movieEmbedding} me ON m.id = me.movie_id
        ORDER BY distance ASC
        LIMIT ${k}
      `);

      return results.rows.map((row) => ({
        id: row.id as number,
        title: row.title as string,
        description: row.description as string,
        releaseYear: row.releaseYear as number,
        genre: row.genre as string,
        distance: parseFloat(row.distance as string),
      }));
    } catch (error) {
      console.error("Error searching similar movies:", error);
      throw error;
    }
  }
}

export const vectorStore = new VectorStore();
