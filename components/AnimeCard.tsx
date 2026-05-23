import Link from "next/link";

interface AnimeProps {
  anime: {
    mal_id: number;
    title: string;
    score: number;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
}

export default function AnimeCard({ anime }: AnimeProps) {

  return (
    <Link href={`/anime/${anime.mal_id}`}>

      <div className="bg-slate-800 rounded-xl overflow-hidden hover:scale-105 duration-300">

        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full h-[300px] object-cover"
        />

        <div className="p-3">

          <h2 className="font-bold line-clamp-1">
            {anime.title}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            ⭐ {anime.score}
          </p>

        </div>

      </div>

    </Link>
  );
}