// drizzle/seed.ts
import "dotenv/config"; // Add this line at the very top

import { db } from "./db";
import { movie } from "./schema";
import { movieData } from "../data";
import { vectorStore } from "../lib/vectorStore";

async function seedDatabase() {
  console.log("Starting the database seeding...");
  for (const data of movieData) {
    const { title, description, releaseYear, genre } = data;
    await db
      .insert(movie)
      .values({
        title,
        description,
        releaseYear,
        genre,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        vector: new Array(1536).fill(0), // Assuming this is required
      })
      .execute();
    console.log(`Inserted movie: ${title}`);
  }
  console.log("Database seeding completed.");

  console.log("Start vectorization ...");
  await vectorStore.initialize();
  console.log("Vectorization finished.");
}

seedDatabase().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
