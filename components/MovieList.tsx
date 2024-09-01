import { Movie } from "@prisma/client";
import MovieImage from "./MovieImage";
import Link from "next/link";

interface MovieWithImage extends Movie {
  imageUrl: string | null;
}

export default function MovieList({ movies }: { movies: MovieWithImage[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <li
          key={movie.id}
          className="border p-4 border-slate-400 flex flex-col items-center w-full max-w-xs"
        >
          <Link href={`/movies/${movie.id}`} className="w-full">
            <MovieImage imageUrl={movie.imageUrl} alt={movie.title} />
            <div className="mt-2 text-center">
              {movie.title} ({movie.releaseYear})
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
