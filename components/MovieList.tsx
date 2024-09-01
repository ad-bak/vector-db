import { Movie } from "@/drizzle/schema";
import MovieImage from "./MovieImage";
import Link from "next/link";

export interface MovieWithImage extends Omit<Movie, "createdAt" | "updatedAt"> {
  imageUrl: string | null;
}

export default function MovieList({ movies }: { movies: MovieWithImage[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <li
          key={movie.id}
          className="border p-4 border-slate-400 flex flex-col items-center w-full max-w-xs"
        >
          <Link href={`/movies/${movie.id}`} className="w-full h-60">
            <MovieImage imageUrl={movie.imageUrl} alt={movie.title} />
            <div className="text-center">
              {movie.title} ({movie.releaseYear})
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
