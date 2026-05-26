"use client";

import { useState } from "react";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
};

export default function SmartImage({ src, alt = "image", className }: Props) {
  const [imgSrc, setImgSrc] = useState(src || "/img/Twitter.jpg");
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-2xl" />
      )}

      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgSrc("/img/Twitter.jpg"); // fallback
          setLoading(false);
        }}
      />
    </div>
  );
}