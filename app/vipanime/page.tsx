"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "./../lib/firebase";
import Link from "next/link";
type Anime = {
  id: string;
  title: string;
  image: string;
  rating: number;
  genre: string;
  vip?: boolean;
};

export default function AnimePage() {
  const [search, setSearch] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
const [isVip, setIsVip] = useState(false);
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
useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setIsVip(false);
      return;
    }

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      setIsVip(
        data.role === "vip" ||
        data.role === "owner"
      );
    }
  });

  return () => unsub();
}, []);
const filteredAnime = animeList.filter((a) => {
  const matchesSearch = a.title
    .toLowerCase()
    .includes(search.toLowerCase());

  return matchesSearch && a.vip;
});

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
     <section className="max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-36">
  <div className="
    relative overflow-hidden
    rounded-[40px]
    border border-yellow-500/20
    bg-gradient-to-br
    from-black
    via-[#0f172a]
    to-[#050505]
    shadow-[0_0_120px_rgba(255,180,0,0.12)]
  ">

    {/* BACKGROUND IMAGE */}
    <div
      className="absolute inset-0 opacity-20 bg-cover bg-center scale-110"
      style={{
        backgroundImage:
          "url('https://images.alphacoders.com/135/1356256.jpeg')",
      }}
    />

    {/* DARK OVERLAY */}
    <div className="absolute inset-0 bg-black/60" />

    {/* GLOW */}
    <div className="absolute -top-32 -left-20 w-[400px] h-[400px] bg-yellow-500/20 blur-3xl rounded-full" />

    <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-pink-500/20 blur-3xl rounded-full" />

    {/* SHINE */}
    <div className="absolute -left-40 top-0 h-full w-32 rotate-12 bg-white/10 blur-2xl animate-pulse" />

    <div className="relative z-10 p-8 md:p-16">

      {/* TOP BADGE */}
      <div className="
        inline-flex items-center gap-3
        px-5 py-2 rounded-full
        bg-gradient-to-r from-yellow-400 to-orange-500
        text-black font-black tracking-[3px]
        text-xs md:text-sm
        shadow-[0_0_30px_rgba(255,215,0,0.5)]
      ">
        👑 PREMIUM ANIME COLLECTION
      </div>

      {/* CONTENT */}
      <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

        {/* LEFT */}
        <div className="max-w-3xl">

          <h1 className="
            text-5xl md:text-7xl lg:text-8xl
            font-black leading-[0.9]
          ">
            <span className="bg-gradient-to-r from-yellow-200 via-white to-pink-400 bg-clip-text text-transparent">
              VIP
            </span>

            <br />

            <span className="text-white">
              ANIME
            </span>

            <br />

            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              WORLD
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-xl mt-7 max-w-2xl leading-relaxed">
            Premium anime, VIP episode va exclusive
            kontentlarni faqat maxsus foydalanuvchilar
            ko‘ra oladi.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-8">

            <button className="
              px-8 py-4 rounded-2xl
              bg-gradient-to-r from-yellow-400 to-orange-500
              text-black font-black
              shadow-[0_0_40px_rgba(255,200,0,0.45)]
              hover:scale-105
              transition
            ">
              👑 WATCH VIP
            </button>

            <button className="
              px-8 py-4 rounded-2xl
              bg-white/10 border border-white/10
              backdrop-blur-xl
              text-white font-bold
              hover:bg-white/20
              transition
            ">
              🔥 Explore Anime
            </button>

          </div>
        </div>

        {/* RIGHT STATS */}
        <div className="
          grid grid-cols-2 gap-5
          w-full max-w-md
        ">

          <div className="
            rounded-3xl p-6
            bg-white/5 border border-white/10
            backdrop-blur-xl
          ">
            <p className="text-white/50 text-sm">
              Total Anime
            </p>

            <h2 className="text-5xl font-black mt-3 bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">
              {animeList.length}
            </h2>
          </div>

          <div className="
            rounded-3xl p-6
            bg-white/5 border border-white/10
            backdrop-blur-xl
          ">
            <p className="text-white/50 text-sm">
              VIP Access
            </p>

            <h2 className="text-4xl font-black mt-4">
              👑
            </h2>
          </div>

          <div className="
            rounded-3xl p-6
            bg-gradient-to-br from-pink-500/20 to-red-500/10
            border border-pink-500/20
            col-span-2
          ">
            <p className="text-white/50 text-sm">
              Premium Streaming
            </p>

            <h2 className="text-3xl font-black mt-3">
              Ultra HD Anime Experience
            </h2>
          </div>

        </div>

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
 {filteredAnime.length === 0 ? (
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
  className={`
  relative aspect-[2/3]
  rounded-[2.5rem]
  overflow-hidden
  transition-all duration-700

  ${
    item.vip
      ? `
      bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-black
      border border-yellow-400/50
      shadow-[0_0_40px_rgba(255,215,0,0.25)]
      hover:shadow-[0_0_90px_rgba(255,215,0,0.5)]
      hover:-translate-y-4
      hover:scale-[1.05]
    `
      : `
      bg-[#050505]
      border border-white/10
      shadow-[0_15px_70px_rgba(0,0,0,0.9)]
      hover:scale-[1.04]
      hover:-translate-y-3
      hover:shadow-[0_35px_120px_rgba(255,0,120,0.25)]
    `
  }
`}
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

  <div className="absolute top-4 left-4 z-2 px-3 py-1 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-black tracking-widest shadow-lg">
    👑 VIP
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
          <button
  className={`
    w-full py-3 rounded-2xl
    font-black text-sm
    opacity-0 group-hover:opacity-100
    translate-y-6 group-hover:translate-y-0
    transition duration-500

    ${
      item.vip
        ? `
        bg-gradient-to-r from-yellow-300 to-orange-500
        text-black
        shadow-[0_0_25px_rgba(255,215,0,0.5)]
      `
        : `
        bg-white/90 text-black
        hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:text-white
      `
    }
  `}
>
  {item.vip ? "👑 VIP WATCH" : "▶ WATCH NOW"}
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