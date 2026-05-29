"use client";

import { useEffect, useState } from "react";
import { auth, db } from "./../lib/firebase";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

import {
  FaCrown,
  FaUserShield,
  FaGem,
  FaFire,
  FaHome,
  FaSignOutAlt,
  FaStar,
} from "react-icons/fa";

type UserData = {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;

  role?: string; // owner | vip | user

  coins?: number;
  level?: number;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<UserData | null>(null);
 const [checking, setChecking] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      // FIRESTORE DATA
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setData(snap.data() as UserData);
      }

      setChecking(false);
    });

    return () => unsub();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // LOADING
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-black">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0b1020] to-black text-white px-4 py-10">

      {/* MAIN CARD */}
      <div
        className={`max-w-6xl mx-auto rounded-3xl overflow-hidden border shadow-2xl backdrop-blur-xl

        ${
          data?.role === "owner"
            ? "border-yellow-400 shadow-yellow-500/40"
            : data?.role === "vip"
            ? "border-pink-500 shadow-pink-500/30"
            : "border-white/10"
        }

        bg-[#111827]/90`}
      >

        {/* TOP BANNER */}
     <div
  className={`relative min-h-[320px] md:min-h-[500px] flex items-center justify-center overflow-hidden
          ${
            data?.role === "owner"
              ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600"
              : data?.role === "vip"
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
              : "bg-gradient-to-r from-cyan-600 to-blue-700"
          }`}
        >

          {/* OWNER GLOW */}
          {data?.role === "owner" && (
            <>
              <div className="absolute w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>

              <div className="absolute inset-0 bg-white/10"></div>
            </>
          )}

          {/* PROFILE CONTENT */}
          <div className="relative text-center z-10">

            {/* AVATAR */}
            <div
              className={`w-40 h-40 rounded-full border-4 mx-auto flex items-center justify-center text-6xl font-black shadow-2xl

              ${
                data?.role === "owner"
                  ? "border-yellow-300 bg-black text-yellow-400 shadow-[0_0_60px_gold]"
                  : data?.role === "vip"
                  ? "border-pink-300 bg-black text-pink-400"
                  : "border-white bg-black text-white"
              }`}
            >
              {data?.firstName?.charAt(0)}
            </div>

            {/* NAME */}
            <h1 className="text-3xl md:text-5xl font-black mt-5 tracking-wide px-4 break-words">
              {data?.firstName} {data?.lastName}
            </h1>

            {/* BADGES */}
            <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">

              {/* OWNER */}
              {data?.role === "owner" && (
                <div className="px-4 md:px-7 py-2 md:py-3 text-sm md:text-base rounded-full bg-black border-2 border-yellow-400 text-yellow-300 font-black flex items-center gap-3 shadow-[0_0_35px_gold] animate-pulse">

                  <FaUserShield className="text-2xl" />

                  <span className="tracking-widest">
                    👑 WEBSITE OWNER
                  </span>

                </div>
              )}

              {/* VIP */}
              {data?.role === "vip" && (
                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center gap-3 shadow-2xl">

                  <FaCrown className="text-xl" />

                  VIP USER

                </div>
              )}

              {/* USER */}
              {(!data?.role || data?.role === "user") && (
                <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold flex items-center gap-3">

                  <FaStar />

                  USER

                </div>
              )}

            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-5 p-4 md:p-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* ACCOUNT INFO */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

              <h2 className="text-3xl font-black mb-6">
                Account Info
              </h2>

              <div className="space-y-4 text-lg">

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    First Name
                  </span>

                  <span className="font-bold">
                    {data?.firstName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    Last Name
                  </span>

                  <span className="font-bold">
                    {data?.lastName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    Email
                  </span>

                  <span className="font-bold">
                    {user?.email}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    Age
                  </span>

                  <span className="font-bold">
                    {data?.age}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    Gender
                  </span>

                  <span className="font-bold">
                    {data?.gender}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Role
                  </span>

                  <span className="font-bold uppercase">
                    {data?.role || "user"}
                  </span>
                </div>

              </div>
            </div>

            {/* STATS */}
   

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
{/* PREMIUM BALANCE CARD */}
<div
  className={`relative overflow-hidden rounded-3xl p-7 border shadow-2xl

  ${
    data?.role === "owner"
      ? "border-yellow-400 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-red-500/20"
      : data?.role === "vip"
      ? "border-pink-500 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-indigo-500/20"
      : "border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
  }`}
>

  {/* GLOW */}
  <div className="absolute -top-20 -right-20 w-52 h-52 bg-white/10 blur-3xl rounded-full"></div>

  {/* TOP */}
  <div className="relative flex items-center justify-between">

    <div>
      <p className="text-white/50 text-sm uppercase tracking-[3px]">
        Wallet Balance
      </p>

      <h2 className="text-5xl font-black mt-3">
        ${(data?.coins || 0).toLocaleString()}
      </h2>

      <p className="text-white/40 mt-2">
        Premium account balance
      </p>
    </div>

    {/* ICON */}
    <div
      className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl

      ${
        data?.role === "owner"
          ? "bg-yellow-500/20 text-yellow-300"
          : data?.role === "vip"
          ? "bg-pink-500/20 text-pink-300"
          : "bg-cyan-500/20 text-cyan-300"
      }`}
    >
      💎
    </div>

  </div>

  {/* ACTION BUTTONS */}
  <div className="relative grid grid-cols-2 gap-4 mt-8">

    {/* TOP UP */}
    <button
      onClick={() => router.push("/payment")}
      className="group relative overflow-hidden rounded-2xl py-4 font-bold transition-all active:scale-95"
    >

      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:scale-105 transition-all"></div>

      <div className="relative flex items-center justify-center gap-3 text-white text-lg">
        💰 Balance To‘ldirish
      </div>

    </button>

    {/* VIP */}
    <button
      onClick={() => router.push("/vip")}
      className="group relative overflow-hidden rounded-2xl py-4 font-bold transition-all active:scale-95"
    >

      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:scale-105 transition-all"></div>

      <div className="relative flex items-center justify-center gap-3 text-white text-lg">
        👑 VIP Upgrade
      </div>

    </button>

  </div>

  {/* BONUS INFO */}
  <div className="relative mt-7 grid md:grid-cols-3 gap-4">

    <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
      <p className="text-white/50 text-sm">
        Daily Bonus
      </p>

      <h3 className="text-2xl font-black mt-2">
        +50 Coins
      </h3>
    </div>

    <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
      <p className="text-white/50 text-sm">
        Premium Status
      </p>

      <h3 className="text-2xl font-black mt-2">
        {data?.role === "owner"
          ? "OWNER"
          : data?.role === "vip"
          ? "VIP"
          : "FREE"}
      </h3>
    </div>

    <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
      <p className="text-white/50 text-sm">
        Next Reward
      </p>

      <h3 className="text-2xl font-black mt-2">
        🔥 Lv {(data?.level || 1) + 1}
      </h3>
    </div>

  </div>
</div>
            {/* FEATURES */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

              <h2 className="text-3xl font-black mb-6">
                Features
              </h2>

              <div className="space-y-4">

                <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                  🎬 Watch Anime
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                  ❤️ Favorite Anime List
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                  💬 Community Chat
                </div>

                {/* VIP FEATURES */}
                {data?.role === "vip" && (
                  <>
                    <div className="bg-pink-600/20 border border-pink-500 rounded-2xl p-4">
                      👑 VIP Anime Access
                    </div>

                    <div className="bg-pink-600/20 border border-pink-500 rounded-2xl p-4">
                      ⚡ Premium Streaming
                    </div>

                    <div className="bg-pink-600/20 border border-pink-500 rounded-2xl p-4">
                      🔥 Early Episodes
                    </div>
                  </>
                )}

                {/* OWNER FEATURES */}
               {/* OWNER FEATURES */}
{data?.role === "owner" && (
  <>
    {/* ADMIN PANEL BUTTON */}
    <button
      onClick={() => router.push("/admin/login")}
      className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400 rounded-2xl p-4 text-left transition-all duration-300"
    >
      🛠Admin Panel
    </button>

  </>
)}

              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">

              {/* HOME */}
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-3"
              >
                <FaHome />
                Home
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 transition-all font-bold text-lg flex items-center justify-center gap-3"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}