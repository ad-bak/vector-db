import MovieList from "@/components/MovieList";
import Pagination from "@/components/Pagination";
import { fetchMovies } from "@/actions/movies";
import Chatbot from "@/components/Chatbot";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;

  const res = await fetchMovies(page);
  const { movies, metadata } = res;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Movies in our database:</h1>
      <MovieList movies={movies} />
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(metadata.total / metadata.limit)}
      />
      <Chatbot />
    </main>
  );
}
