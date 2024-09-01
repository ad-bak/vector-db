"use server";

import { db } from "@/drizzle/db";
import { movie } from "@/drizzle/schema";
import { sql } from "drizzle-orm";

export async function fetchMovies(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;

    const totalMovies = await db
      .select({ count: sql`COUNT(*)` })
      .from(movie)
      .execute();
    const total = Number(totalMovies[0].count);

    const movies = await db
      .select()
      .from(movie)
      .limit(limit)
      .offset(skip)
      .execute();

    const moviesWithImages = await Promise.all(
      movies.map(async (movie) => {
        const imageUrl = await fetchMovieImage(movie.title);
        return {
          ...movie,
          imageUrl,
        };
      })
    );

    return {
      movies: moviesWithImages,
      metadata: {
        total,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    throw new Error("Failed to fetch movies. Please try again later.");
  }
}

async function fetchMovieImage(title: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${encodeURIComponent(
        title
      )}`
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.posterUrl || null;
  } catch (error) {
    console.error(`Failed to fetch image for ${title}:`, error);
    return null;
  }
}

export async function fetchMovieById(id: number) {
  try {
    const movieResult = await db
      .select()
      .from(movie)
      .where(sql`${movie.id} = ${id}`)
      .execute();

    if (!movieResult.length) return null;

    const imageUrl = await fetchMovieImage(movieResult[0].title);

    return {
      ...movieResult[0],
      imageUrl,
    };
  } catch (error) {
    console.error(`Failed to fetch movie with id ${id}:`, error);
    return null;
  }
}
