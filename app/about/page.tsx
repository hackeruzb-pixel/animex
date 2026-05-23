"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  FaPlay,
  FaFire,
  FaUsers,
  FaStar,
  FaCode,
  FaRocket,
  FaGlobe,
  FaBolt,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-28 px-6">

        {/* BACKGROUND EFFECTS */}
        <div className="absolute inset-0">
          <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-purple-600/30 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-cyan-500/30 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">

          <p className="uppercase tracking-[8px] text-cyan-400 text-sm font-semibold">
            ANIMEX PLATFORM
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mt-4">
            Anime Streaming <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Next Level Experience
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-gray-400 text-lg mt-8 leading-8">
            ANIMEX — bu zamonaviy anime platforma bo‘lib,
            foydalanuvchilarga eng yangi, trend va mashhur
            animelarni bir joyda tomosha qilish imkonini beradi.
            Next.js + Firebase asosida qurilgan tezkor va zamonaviy UI.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex justify-center gap-5 flex-wrap">

            <Link href="/animelar">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-lg hover:scale-105 transition shadow-lg shadow-cyan-500/20">
                🚀 Start Watching
              </button>
            </Link>

            <Link href="/register">
              <button className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl font-bold text-lg hover:bg-white/10 transition">
                Join Community
              </button>
            </Link>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {[
            { icon: <FaPlay />, label: "Anime", value: "500+" , color:"text-cyan-400"},
            { icon: <FaUsers />, label: "Users", value: "10K+", color:"text-pink-400"},
            { icon: <FaFire />, label: "Trending", value: "Daily", color:"text-orange-400"},
            { icon: <FaStar />, label: "Rating", value: "4.9", color:"text-yellow-400"},
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center hover:scale-105 transition"
            >
              <div className={`text-4xl mb-4 flex justify-center ${item.color}`}>
                {item.icon}
              </div>
              <h2 className="text-4xl font-black">{item.value}</h2>
              <p className="text-gray-400 mt-2">{item.label}</p>
            </div>
          ))}

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-24">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>

            <p className="uppercase tracking-[6px] text-purple-400 text-sm mb-4">
              Our Mission
            </p>

            <h2 className="text-5xl font-black leading-tight">
              Anime Lovers <br />
              Community Hub
            </h2>

            <p className="text-gray-400 mt-6 leading-8 text-lg">
              Bizning maqsadimiz — anime muxlislariga tez, qulay
              va chiroyli platforma yaratish. Foydalanuvchilar
              anime qidirishi, janrlar bo‘yicha saralashi,
              reytinglarni ko‘rishi va o‘z sevimli kontentini topishi mumkin.
            </p>

            {/* FEATURES */}
            <div className="mt-8 flex flex-wrap gap-3">

              <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                ⚡ Fast Performance
              </span>

              <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                🎨 Modern UI
              </span>

              <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                🎌 Anime Focused
              </span>

              <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                🌍 Global Access
              </span>

            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative group">

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl rounded-[40px]" />

            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq2_5-Ym65I9U-J152Yi1vMKWRLA_Gi4ks2A&s"
              className="relative w-full h-[420px] object-cover rounded-[40px] border border-white/10 group-hover:scale-[1.02] transition"
            />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24 text-center">

        <div className="rounded-[40px] border border-white/10 bg-gradient-to-r from-[#0f172a] to-[#111827] p-10 md:p-16">

          <h2 className="text-4xl md:text-5xl font-black">
            Ready to explore anime world?
          </h2>

          <p className="text-gray-400 mt-4">
            Eng yangi animelarni bugun ko‘rishni boshlang 🚀
          </p>

          <Link href="/animelar">
            <button className="mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 font-bold hover:scale-105 transition">
              Go to Anime List
            </button>
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-gray-500">

        <div className="flex items-center justify-center gap-3 mb-3">
          <FaCode />
          <span>Built with Next.js</span>
        </div>

        <p>© 2026 ANIMEX. All rights reserved.</p>
      </footer>

    </main>
  );
}