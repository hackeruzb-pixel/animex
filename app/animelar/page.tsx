"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./../lib/firebase";

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
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {filteredAnime.map((anime) => (
            <div
              key={anime.id}
              className="group bg-[#111111] rounded-[28px] overflow-hidden border border-white/10 hover:border-red-500/30 hover:-translate-y-2 transition-all duration-300"
            >

              <div className="overflow-hidden">
                <img
                  src={anime.image}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-1">
                  {anime.title}
                </h3>

                <div className="flex justify-between text-gray-400 text-sm mt-3">
                  <span>{anime.genre}</span>

                  <span className="text-yellow-400">
                    ⭐ {anime.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}

        </div>

        {filteredAnime.length === 0 && (
          <p className="text-center text-gray-500 mt-14 text-lg">
            Anime topilmadi 😢
          </p>
        )}
      </section>
    </div>
  );
}