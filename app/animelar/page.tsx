"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./../lib/firebase";
import Link from "next/link";
type Anime = {
  id: string;
  title: string;
  image: string;
  rating: number;
  genre: string;
};

export default function AnimePage() {
  const [search, setSearch] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  // FIREBASE DAN O‘QISH
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "anime"), (snapshot) => {
      const data: Anime[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Anime, "id">),
      }));

      setAnimeList(data);
    });

    return () => unsub();
  }, []);

  const filteredAnime = animeList.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 md:pt-36">
        <div className="relative rounded-[35px] overflow-hidden p-10 md:p-16 bg-gradient-to-r from-[#090909] via-[#111827] to-[#050505] border border-white/10 shadow-2xl">

          {/* Glow */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            <span className="bg-red-600/20 text-red-400 px-4 py-1 rounded-full text-sm border border-red-500/20">
              Admin qo‘shgan animelar
            </span>

            <h1 className="text-4xl md:text-6xl font-black mt-6 leading-tight">
              ANIMELAR <br />
              DUNYOSI
            </h1>

            <p className="text-gray-300 mt-5 max-w-xl text-lg">
              Bu yerda admin paneldan qo‘shilgan barcha animelar avtomatik chiqadi.
            </p>

            {/* COUNT */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block text-right">
              <h2 className="text-7xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {animeList.length}
              </h2>

              <p className="text-gray-400 tracking-widest">
                TA ANIME
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <div className="relative">
          <input
            className="w-full p-5 rounded-2xl bg-[#111827] border border-white/10 outline-none focus:border-red-500 transition"
            placeholder="Anime qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* GRID */}
    {/* GRID */}
<section className="max-w-7xl mx-auto px-6 mt-10 pb-20">
  {animeList.length === 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-[380px] rounded-3xl bg-gray-900 animate-pulse"
        />
      ))}
    </div>
  ) : (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
        {filteredAnime.map((item) => (
         <Link
  href={`/anime/${item.id}`}
  key={item.id}
  className="group block"
>
            {/* CARD */}
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
                src={item.image}
                className="
                  w-full h-full object-cover
                  group-hover:scale-110
                  transition duration-700
                "
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* GLOW */}
              <div className="absolute -inset-[120px] opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-[120px]" />

              {/* YEAR BADGE */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-[10px] font-bold tracking-widest">
                2026
              </div>

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                {/* INFO */}
                <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition duration-500">
                  <span className="text-white/20">|</span>
                  <span className="text-white/60 text-xs uppercase tracking-widest">
                    {item.title}
                  </span>
                </div>

                {/* BUTTON */}
                <button className="
                  w-full py-3 rounded-2xl
                  bg-white/90 text-black font-black text-sm
                  opacity-0 group-hover:opacity-100
                  translate-y-6 group-hover:translate-y-0
                  transition duration-500
                  hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:text-white
                ">
                  ▶ WATCH NOW
                </button>
              </div>
            </div>

            {/* TITLE */}
            <h3 className="
              mt-3 text-white font-bold text-sm sm:text-lg
              line-clamp-2
              group-hover:text-pink-500
              transition
            ">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredAnime.length === 0 && (
        <p className="text-center text-gray-500 mt-14 text-lg">
          Anime topilmadi 😢
        </p>
      )}
    </>
  )}
</section>
    </div>
  );
}