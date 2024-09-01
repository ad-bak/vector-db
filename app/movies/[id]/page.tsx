import { fetchMovieById } from "@/actions/movies";
import Image from "next/image";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await fetchMovieById(parseInt(params.id));

  if (!movie) {
    return notFound();
  }

  return (
    <main className="flex flex-col items-center p-8">
      <div className="max-w-lg w-full">
        <Image
          src={movie.imageUrl} // Ensure imageUrl or use a placeholder
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
