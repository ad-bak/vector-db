"use client";

import Image from "next/image";
import { useState } from "react";

type MovieImageProps = {
  imageUrl: string | null;
  alt: string;
};

export default function MovieImage({ imageUrl, alt }: MovieImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-60 bg-gray-300 flex items-center justify-center overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {imageUrl && (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className={`object-center ${loading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setLoading(false)}
            priority
          />
        </div>
      )}
    </div>
  );
}
