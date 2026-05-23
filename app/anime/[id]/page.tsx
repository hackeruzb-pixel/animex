"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaPlay, FaStar, FaArrowLeft, FaRegPlayCircle } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

/* ================= TYPES ================= */

type Episode = {
  title: string;
  videoUrl: string;
  number: number;
};

interface Anime {
  id?: string;
  title: string;
  image?: string;
  videoUrl?: string; // 🔥 TRAILER VIDEO
  description?: string;
  synopsis?: string;
  score?: number;
  status?: string;
  genres?: any;
  episodeList?: Episode[];
}

export default function AnimePage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [playHero, setPlayHero] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;

        const ref = doc(db, "anime", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setAnime({ id: snap.id, ...(snap.data() as Anime) });
        } else {
          setAnime(null);
        }
      } catch (e) {
        console.log(e);
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (!anime) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Anime not found
      </main>
    );
  }

  const image = anime.image || "/placeholder.jpg";

  const description =
    anime.description || anime.synopsis || "No description available";

  const rating = anime.score ?? 0;

  /* ================= GENRES FIX ================= */

  const genres: string[] = (() => {
    const g = anime.genres;

    if (!g) return [];

    if (Array.isArray(g)) {
      return [...new Set(
        g.map((x: any) => (typeof x === "string" ? x : x?.name))
          .filter(Boolean)
      )];
    }

    if (typeof g === "string") {
      return g.split(",").map((x) => x.trim()).filter(Boolean);
    }

    return [];
  })();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#05070f] via-[#0b1220] to-black text-white">

      {/* BACK */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12 items-start">

        {/* VIDEO / IMAGE HERO */}
        <div className="relative group">

          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-3xl" />

          {!playHero && anime.videoUrl ? (
            <div
              onClick={() => setPlayHero(true)}
              className="relative cursor-pointer"
            >
              <img
                src={image}
                className="w-full h-[520px] object-cover rounded-3xl border border-white/10 shadow-2xl"
              />

              {/* PLAY OVERLAY */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl">
                <FaPlay className="text-6xl text-white hover:scale-110 transition" />
              </div>
            </div>
          ) : anime.videoUrl ? (
            <video
              src={anime.videoUrl}
              controls
              autoPlay
              className="w-full h-[520px] object-cover rounded-3xl border border-white/10 shadow-2xl"
            />
          ) : (
            <img
              src={image}
              className="w-full h-[520px] object-cover rounded-3xl border border-white/10 shadow-2xl"
            />
          )}

        </div>

        {/* INFO */}
        <div className="space-y-6">

          <h1 className="text-5xl font-black leading-tight">
            {anime.title}
          </h1>

          {/* STATS */}
          <div className="flex flex-wrap gap-3">

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <FaStar className="text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-300 border border-green-500/20">
              {anime.status || "Unknown"}
            </div>

          </div>

          {/* GENRES */}
          <div className="flex flex-wrap gap-2">
            {genres.length > 0 ? (
              genres.map((g, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20"
                >
                  {g}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No genres</span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-300 leading-8">
            {description}
          </p>

        </div>
      </section>

      {/* EPISODES */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FaRegPlayCircle className="text-cyan-400" />
          Episodes
        </h2>

        {anime.episodeList?.length ? (
          <div className="grid md:grid-cols-3 gap-5">

            {anime.episodeList
              .sort((a, b) => a.number - b.number)
              .map((ep, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >

                  <div className="flex justify-between items-center">
                    <span className="font-bold">
                      Episode {ep.number}
                    </span>
                    <FaPlay className="text-red-400" />
                  </div>

                  <p className="text-sm text-gray-400 mt-2">
                    {ep.title}
                  </p>

                  <button
                    onClick={() => setCurrentVideo(ep.videoUrl)}
                    className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-300 border border-green-500/20 hover:scale-105 transition"
                  >
                    ▶ Watch Episode
                  </button>

                </div>
              ))}

          </div>
        ) : (
          <p className="text-gray-500">No episodes added yet</p>
        )}

      </section>

      {/* VIDEO MODAL */}
      {currentVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">

          <div className="w-[92%] max-w-5xl relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">

            <button
              onClick={() => setCurrentVideo(null)}
              className="absolute top-3 right-3 text-white text-3xl z-10 hover:scale-110 transition"
            >
              ✖
            </button>

            {currentVideo.includes("mp4") ? (
              <video
                src={currentVideo}
                controls
                autoPlay
                className="w-full"
              />
            ) : (
              <iframe
                src={currentVideo}
                className="w-full h-[520px]"
                allowFullScreen
              />
            )}

          </div>

        </div>
      )}

    </main>
  );
}