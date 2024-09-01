// actions/chatbot.ts
"use server";

import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { vectorStore } from "@/lib/vectorStore";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables");
}

export async function getChatbotResponse(message: string) {
  try {
    const similarMovies = await vectorStore.searchSimilarMovies(message);

    const llm = new OpenAI({
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const template = `You are a helpful movie recommendation chatbot. Based on the user's message and the following similar movies, provide a friendly response. If the user's message is a greeting or unrelated to movies, respond in a friendly manner without movie recommendations.

When mentioning a movie title, format it as a Markdown link like this: [Movie Title](/movies/ID), replacing ID with the movie's ID.

User message: {message}

Similar movies:
{similarMovies}

Your response (in Markdown format):`;

    const prompt = PromptTemplate.fromTemplate(template);

    const chain = RunnableSequence.from([
      prompt,
      llm,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      message,
      similarMovies: JSON.stringify(
        similarMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          description: movie.description,
          releaseYear: movie.releaseYear,
          genre: movie.genre,
          distance: movie.distance,
        }))
      ),
    });

    return { response: result };
  } catch (error) {
    console.error("Error in chatbot action:", error);
    throw new Error("An error occurred while processing your request");
  }
}
