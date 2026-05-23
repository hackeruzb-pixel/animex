"use client";

import { useEffect, useState } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import { getTopAnime } from "@/services/api";
import Link from "next/link";
import { useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "./lib/firebase";

import {
  onAuthStateChanged,
} from "firebase/auth";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Anime {
  id?: string;
  mal_id?: number;
  title?: string;
  score?: number;
  episodes?: number;
  views?: number;
  image?: string;

  images?: {
    jpg: {
      large_image_url: string;
    };
  };
}

export default function Home() {
  const [apiAnime, setApiAnime] =
    useState<Anime[]>([]);

  const [firebaseAnime, setFirebaseAnime] =
    useState<Anime[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [banned, setBanned] =
    useState(false);

  const [userRole, setUserRole] =
    useState("");

  const animeRef = collection(db, "anime");
const searchRef = useRef<HTMLDivElement>(null);
  /* ================= CHECK USER ================= */
const searchParams = useSearchParams();

useEffect(() => {
  const scroll = searchParams.get("scroll");

  if (scroll === "search") {
    setTimeout(() => {
      searchRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  }
}, [searchParams]);
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) return;

        const ref = doc(
          db,
          "users",
          user.uid
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setBanned(data.banned || false);

          setUserRole(data.role || "user");
        }
      }
    );

    return () => unsub();
  }, []);

  /* ================= API ================= */

  useEffect(() => {
    getTopAnime()
      .then((data) => setApiAnime(data))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FIREBASE ================= */

  useEffect(() => {
    const unsub = onSnapshot(
      animeRef,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Anime[];

        setFirebaseAnime(data);
      }
    );

    return () => unsub();
  }, []);

  /* ================= MERGE ================= */

  const allAnime = [
    ...firebaseAnime,
    ...apiAnime,
  ];

  /* ================= SEARCH ================= */

  const filteredAnime = allAnime.filter(
    (item) =>
      (item.title ?? "")
        .toLowerCase()
        .includes(
          search.toLowerCase().trim()
        )
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

              Your account has been temporarily
              suspended from accessing AnimeHub.

              <br />
              <br />

              If you think this is a mistake,
              contact the administrator.

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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white text-black">

      {/* HERO */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">

        <img
          src="https://images6.alphacoders.com/136/1368325.jpeg"
          className="absolute w-full h-full object-cover scale-110"
        />

        <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />

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

            {userRole === "owner" && (
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black shadow-2xl">

                👑 OWNER ACCOUNT

              </div>
            )}

            {userRole === "vip" && (
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search anime..."
            className="w-full bg-transparent outline-none text-black"
          />

        </div>

      </section>

      {/* TITLE */}
      <section className="max-w-7xl mx-auto px-6 pt-16">

        <h2 className="text-4xl font-black mb-10">

          🔥 Trending Anime

        </h2>

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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

            {filteredAnime.length > 0 ? (
              filteredAnime.map((item, i) => (
                <div
                  key={i}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-lg hover:-translate-y-2 transition duration-500"
                >

                  <img
                    src={
                      item.image ||
                      item.images?.jpg
                        ?.large_image_url ||
                      "/placeholder.jpg"
                    }
                    className="h-[380px] w-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-xl text-sm flex items-center gap-1">

                    <FaStar className="text-yellow-400" />

                    {item.score || "NEW"}

                  </div>

                  <div className="absolute bottom-0 p-4 w-full text-white">

                    <h3 className="font-bold line-clamp-1">
                      {item.title || "Untitled"}
                    </h3>

                    <p className="text-xs text-gray-300 mt-1">

                      Episodes:{" "}
                      {item.episodes || "?"}
                      {" • 👁 "}
                      {item.views || 0}

                    </p>

                    <Link
                      href={`/anime/${item.id}`}
                    >
                      <button className="mt-4 w-full py-2 rounded-xl bg-red-500 font-semibold hover:bg-red-600 transition">

                        Watch

                      </button>
                    </Link>

                  </div>

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
            <h2 className="text-2xl font-black text-black">
              AnimeHub
            </h2>

            <p className="text-gray-500 mt-3 text-sm leading-6">

              Watch trending anime and admin-uploaded episodes in one place.

            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3">
              Quick Links
            </h3>

            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Home</li>
              <li>Trending</li>
              <li>Genres</li>
              <li>Favorites</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">
              Genres
            </h3>

            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Action</li>
              <li>Romance</li>
              <li>Adventure</li>
              <li>Fantasy</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">
              Contact
            </h3>

            <p className="text-gray-600 text-sm">
              Email: support@animehub.com
            </p>

            <p className="text-gray-600 text-sm mt-2">
              Telegram: @animehub
            </p>
          </div>

        </div>

        <div className="border-t border-gray-200 py-4 text-center text-gray-500 text-sm">

          © {new Date().getFullYear()} AnimeHub. All rights reserved.

        </div>

      </footer>

    </main>
  );
}