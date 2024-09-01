"use server";

import { prisma } from "@/prisma/prisma";

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

export async function fetchMovies(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;

    const movies = await prisma.movie.findMany({
      take: limit,
      skip: skip,
    });

    const moviesWithImages = await Promise.all(
      movies.map(async (movie) => ({
        ...movie,
        imageUrl: await fetchMovieImage(movie.title),
      }))
    );

    const total = await prisma.movie.count();

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

export async function fetchMovieById(id: number) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) return null;

    const imageUrl = await fetchMovieImage(movie.title);

    return {
      ...movie,
      imageUrl,
    };
  } catch (error) {
    console.error(`Failed to fetch movie with id ${id}:`, error);
    return null;
  }
}
