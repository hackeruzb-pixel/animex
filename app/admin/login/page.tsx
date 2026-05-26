"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  FaLock,
  FaUserShield,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { auth } from "../../lib/firebase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // LOGIN SUCCESS
      router.push("/admin");
    } catch (err) {
      setError("Email yoki password noto‘g‘ri!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-100px] w-[320px] h-[320px] bg-red-600/30 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px] bg-pink-600/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      {/* LOGIN CARD */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(255,0,100,0.15)] p-8"
      >

        {/* TOP ICON */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <FaUserShield className="text-3xl text-white" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-black text-center text-white tracking-wide">
          ADMIN PANEL
        </h1>

        <p className="text-center text-white/50 mt-2 mb-8 text-sm">
          Secure dashboard access
        </p>

        {/* EMAIL */}
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Admin Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 px-5 text-white outline-none focus:border-red-500 transition-all"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 px-5 pr-14 text-white outline-none focus:border-red-500 transition-all"
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* ERROR */}
       {/* ERROR */}
{error && (
  <div className="mb-5 overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-xl">
    
    <div className="flex items-start gap-4 p-4">
      
      {/* ICON */}
      <div className="min-w-[50px] h-[50px] rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
        <FaLock className="text-red-400 text-xl" />
      </div>

      {/* TEXT */}
      <div className="flex-1">
        <h2 className="text-red-400 font-bold text-sm uppercase tracking-wider">
          Access Denied
        </h2>

        <p className="text-white/70 text-sm mt-1 leading-relaxed">
          Siz admin emassiz yoki login ma’lumotlari noto‘g‘ri.
        </p>

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold transition active:scale-95"
        >
          ⬅ Bosh sahifaga qaytish
        </button>
      </div>

    </div>

    {/* RED LINE */}
    <div className="h-[2px] w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-500 animate-pulse" />
  </div>
)}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-2xl py-4 font-bold text-white transition active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 transition group-hover:scale-105" />

          <div className="relative flex items-center justify-center gap-3">
            <FaLock />
            {loading ? "Loading..." : "ACCESS PANEL"}
          </div>
        </button>

        {/* BOTTOM */}
        <div className="mt-7 text-center">
          <span className="text-xs text-white/30 tracking-[3px]">
            PRIVATE SYSTEM
          </span>
        </div>

      </form>
    </main>
  );
}