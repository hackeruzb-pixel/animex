"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        age: Number(age),
        gender,
        email,
        createdAt: new Date(),
      });

      router.push("/");
    } catch (err) {
      setError("Ro‘yxatdan o‘tishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b20] to-black text-white px-4">

      {/* CARD */}
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8">

        {/* TITLE */}
        <h1 className="text-4xl font-black text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Join Anime World 🔥
        </p>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* NAME */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Ism"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-500 transition"
            />

            <input
              type="text"
              placeholder="Familiya"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* AGE + GENDER */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Yosh"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-500 transition"
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-500 transition"
            >
              <option value="male">Erkak</option>
              <option value="female">Ayol</option>
            </select>
          </div>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-500 transition"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-500 transition"
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition shadow-lg"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Allaqachon account bormi?{" "}
          <Link href="/login" className="text-purple-400 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}