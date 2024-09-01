import { PrismaClient } from "@prisma/client";
import { movieData } from "../data";
import { vectorStore } from "../lib/vectorStore";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  for (const movie of movieData) {
    const result = await prisma.movie.create({
      data: movie,
    });
    console.log(`Created movie with id: ${result.id}`);
  }
  console.log(`Seeding finished.`);

  console.log(`Start vectorization ...`);
  await vectorStore.initialize();
  console.log(`Vectorization finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
