"use server";

import { prisma } from "@/prisma/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaVectorStore } from "langchain/vectorstores/prisma";

export async function vectorizeMovies() {
  const movies = await prisma.movie.findMany();
  const embeddings = new OpenAIEmbeddings();

  const vectorStore = PrismaVectorStore.withModel<any>(prisma).create(
    embeddings,
    {
      prisma: prisma,
      tableName: "Movie",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        title: PrismaVectorStore.TextColumn,
        description: PrismaVectorStore.ContentColumn,
      },
    }
  );

  for (const movie of movies) {
    await vectorStore.addModels([movie]);
  }

  console.log("Vectorization complete");
}
