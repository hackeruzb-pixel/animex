"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../lib/firebase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      setError("Email yoki parol noto‘g‘ri!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b20] to-black text-white px-4">

      {/* CARD */}
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8">

        {/* TITLE */}
        <h1 className="text-4xl font-black text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Login to continue watching anime 🔥
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-blue-500 transition"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-blue-500 transition"
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-400 hover:opacity-90 transition shadow-lg"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Account yo‘qmi?{" "}
          <Link href="/register" className="text-blue-400 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}