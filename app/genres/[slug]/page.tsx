"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

/* ================= TYPES ================= */

type Anime = {
  id?: string;
  title?: string;
  genre?: any;
  image?: string;
  score?: any;
};

/* ================= PAGE ================= */

export default function GenrePage() {
  const params = useParams<{ slug: string }>();

  const slug =
    typeof params?.slug === "string"
      ? params.slug.toLowerCase()
      : "";

  const [animeList, setAnimeList] = useState<Anime[]>([]);

  useEffect(() => {
    const ref = collection(db, "anime");

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Anime[];

      setAnimeList(data);
    });

    return () => unsub();
  }, []);

  /* ================= SAFE GENRE NORMALIZER ================= */

  const normalizeGenres = (g: any): string[] => {
    if (!g) return [];

    if (Array.isArray(g)) {
      return g
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.name || ""
        )
        .filter(Boolean)
        .map((x) => x.toLowerCase().trim());
    }

    if (typeof g === "string") {
      return g
        .split(",")
        .map((x) => x.toLowerCase().trim())
        .filter(Boolean);
    }

    return [];
  };

  /* ================= SAFE RATING ================= */

  const getRating = (score: any) => {
    const num = Number(score);
    return isNaN(num) ? null : num;
  };

  /* ================= FILTER ================= */

  const filtered = animeList.filter((anime) => {
    const genres = normalizeGenres(anime.genre);
    return genres.includes(slug);
  });

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* HEADER */}
      <section className="max-w-7xl mx-auto px-6 pt-24">
        <h1 className="text-4xl font-black uppercase">
          {slug} Anime
        </h1>

        <p className="text-gray-400 mt-2">
          {filtered.length} ta anime topildi
        </p>
      </section>

      {/* LIST */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        {filtered.length === 0 ? (
          <p className="text-gray-500">
            Hech narsa topilmadi 😢
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {filtered.map((anime) => {
              const rating = getRating(anime.score);

              return (
                <div
                  key={anime.id}
                  className="rounded-2xl overflow-hidden bg-[#111] border border-white/10 hover:scale-105 transition"
                >

                  <img
                    src={
                      anime.image ||
                      "https://via.placeholder.com/300x400"
                    }
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-4">

                    <h2 className="font-bold text-lg">
                      {anime.title}
                    </h2>

                    {/* RATING FIX */}
                    <p className="text-sm text-gray-400">
                      ⭐{" "}
                      {rating !== null
                        ? rating.toFixed(1)
                        : "N/A"}
                    </p>

                    <Link
                      href={`/anime/${anime.id}`}
                      className="text-blue-400 text-sm mt-2 block"
                    >
                      Ko‘rish →
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
}