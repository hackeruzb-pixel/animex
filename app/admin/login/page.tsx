"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      setError("Email yoki password noto‘g‘ri!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b1020] to-[#05070f] text-white px-4">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8"
      >

        <h1 className="text-4xl font-extrabold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-white/60 mb-8 text-sm">
          Admin panelga kirish
        </p>

        <input
          className="w-full mb-4 p-4 rounded-2xl bg-black/40 border border-white/10 focus:outline-none focus:border-red-500 transition"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-4 rounded-2xl bg-black/40 border border-white/10 focus:outline-none focus:border-red-500 transition"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="mb-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold transition bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 active:scale-[0.98]"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <div className="mt-6 text-center text-xs text-white/40">
          Secure admin access panel
        </div>

      </form>
    </main>
  );
}