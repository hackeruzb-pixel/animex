"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./../lib/firebase";

import {
  FaTheaterMasks,
  FaGhost,
  FaBolt,
  FaHeart,
  FaDragon,
  FaLaugh,
} from "react-icons/fa";

/* ================= TYPES ================= */

type Anime = {
  id?: string;
  title?: string;
  genre?: any; // FIX: flexible (string | array)
};

const genresList = [
  { title: "Drama", slug: "drama", icon: <FaTheaterMasks />, color: "text-yellow-400" },
  { title: "Ecchi", slug: "ecchi", icon: <FaHeart />, color: "text-pink-500" },
  { title: "Action", slug: "action", icon: <FaBolt />, color: "text-purple-400" },
  { title: "Fantasy", slug: "fantasy", icon: <FaDragon />, color: "text-cyan-400" },
  { title: "Comedy", slug: "comedy", icon: <FaLaugh />, color: "text-orange-400" },
  { title: "Horror", slug: "horror", icon: <FaGhost />, color: "text-red-500" },
];

export default function GenresPage() {
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
          typeof item === "string" ? item : item?.name || ""
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

  /* ================= COUNT FUNCTION FIXED ================= */

  const getCount = (slug: string) => {
    return animeList.filter((anime) => {
      const genres = normalizeGenres(anime.genre);
      return genres.includes(slug.toLowerCase());
    }).length;
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-r from-[#1a0d14] via-[#111827] to-[#071018] p-10 md:p-14">
          <h1 className="text-5xl font-black italic">
            ANIME JANRLARI
          </h1>
          <p className="text-gray-400 mt-4">
            Admin paneldan yuklangan animelar bo‘yicha avtomatik statistik
          </p>
        </div>
      </section>

      {/* GENRES */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {genresList.map((genre, i) => (
            <div
              key={i}
              className="rounded-[35px] border border-white/10 bg-gradient-to-br from-[#18181c] to-[#0d1117] p-8"
            >

              {/* ICON */}
              <div
                className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-6 ${genre.color}`}
              >
                {genre.icon}
              </div>

              {/* TITLE */}
              <h2 className="text-3xl font-black uppercase">
                {genre.title}
              </h2>

              {/* COUNT */}
              <p className="text-gray-400 mt-2">
                {getCount(genre.slug)} ta anime mavjud
              </p>

              <div className="border-t border-white/10 my-6" />

              {/* LINK */}
              <Link
                href={`/genres/${genre.slug}`}
                className="flex justify-between items-center"
              >
                <span>Ko‘rish</span>
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
                  →
                </div>
              </Link>

            </div>
          ))}

        </div>
      </section>
    </main>
  );
}