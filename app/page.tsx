import MovieList from "@/components/MovieList";

import { Suspense } from "react";
import Pagination from "@/components/Pagination";
import { fetchMovies } from "@/actions/movies";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { movies, metadata } = await fetchMovies(page);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Movies in our database:</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <MovieList movies={movies} />
      </Suspense>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(metadata.total / metadata.limit)}
      />
    </main>
  );
}
