import { Suspense } from "react";
import { fetchMovieById } from "@/actions/movies";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { Loading } from "@/components/Loading";

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default function MoviePage({ params }: MoviePageProps) {
  return (
    <ErrorBoundary
      fallback={<div>Error loading movie. Please try again later.</div>}
    >
      <Suspense fallback={<Loading />}>
        <MovieDetails id={parseInt(params.id)} />
      </Suspense>
    </ErrorBoundary>
  );
}

async function MovieDetails({ id }: { id: number }) {
  const movie = await fetchMovieById(id);

  if (!movie) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center p-8">
      <div className="max-w-lg w-full">
        <Image
          src={movie.imageUrl || "/placeholder.jpg"}
          alt={movie.title}
          width={300}
          height={450}
          className="object-cover rounded-md shadow-lg mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">
          {movie.title} ({movie.releaseYear})
        </h1>
        <p className="text-gray-700 mb-4">{movie.genre}</p>
        <p className="text-gray-500">{movie.description}</p>
      </div>
    </main>
  );
}
