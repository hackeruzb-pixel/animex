'use client';

import { Suspense, useEffect, useState } from 'react';
import { FaSearch, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { useRef } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

import { auth, db } from './lib/firebase';

import { onAuthStateChanged } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Anime {
  id?: string;
  mal_id?: number;
  title?: string;
  score?: number;
  episodes?: number;
  views?: number;
  image?: string;
  year?: number;
  images?: {
    jpg: {
      large_image_url: string;
    };
  };
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
          {/* ANIMATION */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20"></div>

            <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-t-cyan-400 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin"></div>
          </div>

          {/* TEXT */}
          <h1 className="mt-8 text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            ANIMEX
          </h1>

          <p className="text-gray-400 mt-3 text-lg animate-pulse">
            Loading amazing anime...
          </p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
function HomeContent() {
  const [apiAnime, setApiAnime] = useState<Anime[]>([]);

  const [firebaseAnime, setFirebaseAnime] = useState<Anime[]>([]);

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);

  const [banned, setBanned] = useState(false);

  const [userRole, setUserRole] = useState('');

  const animeRef = collection(db, 'anime');
  const searchRef = useRef<HTMLDivElement>(null);
  /* ================= CHECK USER ================= */
  const searchParams = useSearchParams();

  useEffect(() => {
    const scroll = searchParams.get('scroll');

    if (scroll === 'search') {
      setTimeout(() => {
        searchRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
  }, [searchParams]);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = doc(db, 'users', user.uid);

      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setBanned(data.banned || false);

        setUserRole(data.role || 'user');
      }
    });

    return () => unsub();
  }, []);

  /* ================= API ================= */



  /* ================= FIREBASE ================= */

 useEffect(() => {
  const unsub = onSnapshot(animeRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Anime[];

    setFirebaseAnime(data);

    setLoading(false);
  });

  return () => unsub();
}, []);

  /* ================= MERGE ================= */

const allAnime = firebaseAnime;
  /* ================= SEARCH ================= */

  const filteredAnime = allAnime.filter((item) =>
    (item.title ?? '').toLowerCase().includes(search.toLowerCase().trim()),
  );

  /* ================= BANNED SCREEN ================= */

  if (banned) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden relative">
        {/* BG EFFECT */}
        <div className="absolute w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[140px]" />

        <div className="relative z-10 max-w-2xl w-full">
          <div className="bg-gradient-to-br from-[#111111] to-[#1a0000] border border-red-500/30 rounded-[40px] p-10 shadow-[0_0_80px_rgba(255,0,0,0.2)] text-center overflow-hidden relative">
            {/* ICON */}
            <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-7xl shadow-[0_0_60px_rgba(255,0,0,0.5)] animate-pulse">
              🚫
            </div>

            {/* TITLE */}
            <h1 className="text-white text-4xl md:text-6xl font-black mt-8">
              ACCOUNT BANNED
            </h1>

            {/* TEXT */}
            <p className="text-gray-300 mt-6 text-lg leading-8">
              Your account has been temporarily suspended from accessing
              AnimeHub.
              <br />
              <br />
              If you think this is a mistake, contact the administrator.
            </p>

            {/* ROLE */}
            <div className="mt-8 inline-flex items-center gap-3 bg-red-500/20 border border-red-500 text-red-300 px-6 py-3 rounded-full font-black">
              ⚠ ACCESS DENIED
            </div>

            {/* FOOTER */}
            <div className="mt-10 text-gray-500 text-sm">
              AnimeHub Security System
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <img
          src="https://images6.alphacoders.com/136/1368325.jpeghttps://pin.it/7GaQy7LpN"
          className="absolute w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="text-red-500 tracking-[8px] text-sm mb-6 font-semibold">
            PREMIUM ANIME EXPERIENCE
          </p>

          <h1 className="text-5xl md:text-7xl font-black max-w-3xl leading-tight">
            Watch Anime Like Never Before
          </h1>

          <p className="text-gray-600 mt-5 max-w-xl">
            Stream trending anime + admin uploaded anime in one place.
          </p>

          {/* ROLE BADGE */}
          <div className="mt-8">
            {userRole === 'owner' && (
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black shadow-2xl">
                👑 OWNER ACCOUNT
              </div>
            )}

            {userRole === 'vip' && (
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black shadow-2xl">
                👑 VIP USER
              </div>
            )}
          </div>
        </div>
      </section>

      <Navbar />

      {/* SEARCH */}
      <section
        id="search"
        ref={searchRef}
        className="max-w-7xl mx-auto px-6 -mt-12 relative z-20"
      >
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-4 flex items-center gap-4">
          <FaSearch className="text-gray-500 ml-2" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anime..."
            className="w-full bg-transparent outline-none text-black"
          />
        </div>
      </section>

      {/* TITLE */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <h2 className="text-4xl font-black mb-10">🔥 Trending Anime</h2>
      </section>

      {/* LIST */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-[380px] rounded-3xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
            {filteredAnime.length > 0 ? (
              filteredAnime.map((item, i) => (
                <div key={i} className="group">
                  <Link href={`/anime/${item.id}`} className="block">
                    {/* ULTRA PREMIUM CARD */}
                    <div
                      className="
      relative aspect-[2/3]

      rounded-[2.8rem]
      overflow-hidden

      bg-[#050505]

      transition-all duration-700 ease-out

      hover:scale-[1.04]
      hover:-translate-y-4

      shadow-[0_15px_70px_rgba(0,0,0,0.9)]

      hover:shadow-[0_35px_120px_rgba(255,0,120,0.28)]

      border border-white/[0.05]

      backdrop-blur-xl
    "
                    >
                      {/* TOP LIGHT */}
                      <div
                        className="
        absolute inset-0

        bg-gradient-to-b
        from-white/[0.06]
        via-transparent
        to-transparent

        z-10
      "
                      />

                      {/* ANIMATED GLOW */}
                      <div
                        className="
        absolute -inset-[140px]

        opacity-0
        group-hover:opacity-100

        transition-all duration-700

        bg-gradient-to-r
        from-pink-500/20
        via-purple-500/20
        to-cyan-500/20

        blur-[130px]
      "
                      />

                      {/* SHINE */}
                      <div
                        className="
        absolute top-0 -left-[120%]

        w-[55%] h-full

        rotate-[20deg]

        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent

        group-hover:left-[150%]

        transition-all duration-[1400ms]

        z-20
      "
                      />

                      {/* IMAGE */}
                      <img
                        src={
                          item.image ||
                          item.images?.jpg?.large_image_url ||
                          '/placeholder.jpg'
                        }
                        alt={item.title}
                        className="
        w-full h-full object-cover

        transition-all duration-700

        group-hover:scale-110
      "
                      />

                      {/* DARK CINEMATIC OVERLAY */}
                      <div
                        className="
        absolute inset-0

        bg-gradient-to-t
        from-black
        via-black/10
        to-transparent
      "
                      />

                      {/* TOP BADGES */}

                      {/* YEAR */}
                      <div
                        className="
        absolute top-4 right-4

        z-30

        px-4 py-2

        rounded-2xl

        bg-black/50
        backdrop-blur-2xl

        border border-white/10

        text-white

        text-[10px]

        font-black

        tracking-[3px]
      "
                      >
                        {item.year || 'N/A'}
                      </div>

                      {/* BOTTOM CONTENT */}
                      <div
                        className="
        absolute bottom-0 left-0 right-0

        p-5

        z-30
      "
                      >
                        {/* INFO */}
                        <div
                          className="
          flex items-center gap-3

          mb-4

          opacity-0
          translate-y-6

          group-hover:opacity-100
          group-hover:translate-y-0

          transition-all duration-500
        "
                        >
                          <div className="flex items-center gap-1 text-yellow-400 text-sm font-black">
                            ⭐ {item.score || '8.7'}
                          </div>

                          <span className="text-white/20">|</span>

                          <div className="text-white/60 text-xs uppercase tracking-[2px] font-bold">
                            Anime
                          </div>
                        </div>

                        {/* BUTTON */}
                        <button
                          className="
          w-full

          py-3.5

          rounded-2xl

          bg-white/95

          backdrop-blur-xl

          text-black

          font-black

          text-sm

          flex items-center justify-center gap-3

          transition-all duration-300

          hover:bg-gradient-to-r
          hover:from-pink-500
          hover:to-red-500

          hover:text-white

          opacity-0
          translate-y-8

          group-hover:opacity-100
          group-hover:translate-y-0
        "
                        >
                          ▶ WATCH NOW
                        </button>
                      </div>
                    </div>

                    {/* TITLE */}
                    <div className="px-2">
                      <h3
                        className="
        mt-2

        text-sm sm:text-xl

        font-black

        leading-tight

        line-clamp-2

        text-white

        transition-all duration-300

        group-hover:text-pink-500
      "
                      >
                        {item.title || 'Untitled Anime'}
                      </h3>

                      <p
                        className="
        text-gray-500

        text-[10px] sm:text-xs

        uppercase

        tracking-[4px]

        mt-2
      "
                      >
                        転生悪女の黒歴史
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No anime found
              </p>
            )}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-2xl font-black text-black">AnimeHub</h2>

            <p className="text-gray-500 mt-3 text-sm leading-6">
              Watch trending anime and admin-uploaded episodes in one place.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>

            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Home</li>
              <li>Trending</li>
              <li>Genres</li>
              <li>Favorites</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Genres</h3>

            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Action</li>
              <li>Romance</li>
              <li>Adventure</li>
              <li>Fantasy</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Contact</h3>

            <p className="text-gray-600 text-sm">Email: support@animehub.com</p>

            <p className="text-gray-600 text-sm mt-2">Telegram: @animehub</p>
          </div>
        </div>

        <div className="border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} AnimeHub. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
