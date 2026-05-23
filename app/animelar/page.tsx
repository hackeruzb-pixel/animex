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
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl">

          <span className="bg-red-600/20 text-red-400 px-4 py-1 rounded-full text-sm">
            Admin qo‘shgan animelar
          </span>

          <h1 className="text-5xl md:text-6xl font-black mt-6">
            ANIMELAR DUNYOSI
          </h1>

          <p className="text-gray-300 mt-5 max-w-xl">
            Bu yerda admin paneldan qo‘shilgan barcha animelar avtomatik chiqadi.
          </p>

          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block text-right">
            <h2 className="text-6xl font-black">{animeList.length}</h2>
            <p className="text-gray-400">TA ANIME</p>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <input
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
          placeholder="Anime qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredAnime.map((anime) => (
            <div
              key={anime.id}
              className="bg-gray-900 rounded-2xl overflow-hidden hover:scale-105 transition"
            >
              <img
                src={anime.image}
                className="w-full h-60 object-cover"
              />

              <div className="p-4">
                <h3 className="font-bold">{anime.title}</h3>

                <div className="flex justify-between text-gray-400 text-sm mt-2">
                  <span>{anime.genre}</span>
                  <span>⭐ {anime.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnime.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Anime topilmadi 😢
          </p>
        )}
      </section>
    </div>
  );
}