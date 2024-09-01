import { db } from "@/drizzle/db";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { sql } from "drizzle-orm";
import { movie } from "@/drizzle/schema";

class VectorStore {
  private vectorStore: MemoryVectorStore | null = null;
  private embeddings: OpenAIEmbeddings;
  private initialized: boolean = false;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initialize() {
    if (this.initialized) return;

    console.log("Fetching movies from database...");
    const movies = await db.select().from(movie).execute();
    console.log(`Fetched ${movies.length} movies.`);

    console.log("Creating document objects...");
    const documents = movies.map(
      (movie) =>
        new Document({
          pageContent: `${movie.title} ${movie.description}`,
          metadata: { movieId: movie.id },
        })
    );
    console.log(`Created ${documents.length} document objects.`);

    console.log("Initializing vector store...");
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      this.embeddings
    );
    this.initialized = true;
    console.log("Vector store initialized successfully.");
  }

  async searchSimilarMovies(query: string, k: number = 5): Promise<any[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.vectorStore) {
      console.warn("Vector store not initialized. Returning empty result.");
      return [];
    }

    try {
      console.log(`Searching for movies similar to: "${query}"`);
      const results = await this.vectorStore.similaritySearch(query, k);
      const movieIds = results.map((doc) => doc.metadata.movieId as number);
      console.log(`Found ${movieIds.length} similar movies.`);

      const movies = await db
        .select()
        .from(movie)
        .where(sql`${movie.id} IN (${movieIds.join(", ")})`)
        .execute();
      return movies;
    } catch (error) {
      console.error("Error searching similar movies:", error);
      return [];
    }
  }
}

export const vectorStore = new VectorStore();
