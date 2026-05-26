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
    <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
      <div
        className="
          relative aspect-[2/3]
          rounded-[2.5rem]
          overflow-hidden
          bg-[#050505]
          border border-white/10
          shadow-[0_15px_70px_rgba(0,0,0,0.9)]
          transition-all duration-700

          hover:scale-[1.04]
          hover:-translate-y-3
          hover:shadow-[0_35px_120px_rgba(255,0,120,0.25)]
        "
      >
        {/* IMAGE */}
        <img
          src={anime.image || "https://via.placeholder.com/300x400"}
          className="
            w-full h-full object-cover
            group-hover:scale-110
            transition duration-700
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* GLOW EFFECT */}
        <div className="absolute -inset-[120px] opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-[120px]" />

        {/* TOP BADGE */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-[10px] font-bold tracking-widest uppercase">
          {slug}
        </div>

        {/* BOTTOM CONTENT */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          {/* RATING + GENRE */}
          <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition duration-500">
          

            <span className="text-white/20">|</span>

            <span className="text-white/60 text-xs uppercase tracking-widest">
              {slug}
            </span>
          </div>

          {/* BUTTON */}
          <div
            className="
              opacity-0 group-hover:opacity-100
              translate-y-6 group-hover:translate-y-0
              transition duration-500
            "
          >
            <div className="
              w-full py-3 rounded-2xl
              bg-white/90 text-black font-black text-sm
              flex items-center justify-center
              hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:text-white
            ">
              ▶ WATCH NOW
            </div>
          </div>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="
        mt-3 text-white font-bold text-sm sm:text-lg
        line-clamp-2
        group-hover:text-pink-500
        transition
      ">
        {anime.title}
      </h2>
    </Link>
  );
})}

          </div>
        )}

      </section>
    </main>
  );
}