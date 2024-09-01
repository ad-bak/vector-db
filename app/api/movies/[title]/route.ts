import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { title: string } }
) {
  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  const title = params.title;

  const url = `http://www.omdbapi.com/?t=${encodeURIComponent(
    title
  )}&apikey=${OMDB_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.Poster || data.Poster === "N/A") {
      return NextResponse.json({ error: "Poster not found" }, { status: 404 });
    }

    return NextResponse.json({ posterUrl: data.Poster });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movie image" },
      { status: 500 }
    );
  }
}
