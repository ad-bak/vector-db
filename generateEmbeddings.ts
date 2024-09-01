import "dotenv/config";

import { OpenAIEmbeddings } from "@langchain/openai";

import { db } from "./drizzle/db";
import { movie, movieEmbedding } from "./drizzle/schema";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbeddings() {
  console.log("Fetching movies from database...");
  const movies = await db.select().from(movie).execute();
  console.log(`Fetched ${movies.length} movies.`);

  for (const movieData of movies) {
    console.log(`Generating embedding for movie: ${movieData.title}`);
    const embedding = await embeddings.embedQuery(
      `${movieData.title} ${movieData.description}`
    );

    console.log(`Inserting embedding for movie: ${movieData.title}`);
    await db
      .insert(movieEmbedding)
      .values({
        movieId: movieData.id,
        embedding: embedding,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .execute();
  }

  console.log("Finished generating and inserting embeddings.");

  process.exit(0);
}

generateEmbeddings().catch((error) => {
  console.error("Failed to generate embeddings:", error);
  process.exit(1);
});
