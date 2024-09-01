import { Suspense } from "react";
import MovieList from "@/components/MovieList";
import Pagination from "@/components/Pagination";
import { fetchMovies } from "@/actions/movies";
import Chatbot from "@/components/Chatbot";
import { Loading } from "@/components/Loading";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Movies in our database:</h1>
      <Suspense fallback={<Loading />}>
        <MovieListWrapper page={page} />
      </Suspense>
      <Chatbot />
    </main>
  );
}

async function MovieListWrapper({ page }: { page: number }) {
  const { movies, metadata } = await fetchMovies(page);

  return (
    <>
      <MovieList movies={movies} />
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(metadata.total / metadata.limit)}
      />
    </>
  );
}
