import { vectorStore } from "./lib/vectorStore";

async function testVectorization() {
  console.log("Starting vectorization...");
  await vectorStore.initialize();
  console.log("Vectorization complete.");

  console.log("Testing search...");
  const query = "science fiction adventure";
  const similarMovies = await vectorStore.searchSimilarMovies(query);
  console.log(`Similar movies for query "${query}":`);
  console.log(similarMovies);
}

testVectorization().catch(console.error);
