"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  FaCrown,
  FaPaperPlane,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

import { auth, db } from "@/app/lib/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function VipPage() {
  const router = useRouter();
const [isVip, setIsVip] = useState(false);
const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendVipRequest = async () => {
    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "vip_requests"), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      setSuccess(true);

    } catch (err) {
      console.log(err);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setIsVip(data.vip === true || data.role === "vip");
    } else {
      setIsVip(false);
    }

    setChecking(false);
  });

  return () => unsub();
}, [router]);
if (checking) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      Loading...
    </main>
  );
}

if (isVip) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <FaCrown className="text-yellow-400 text-6xl mx-auto" />
        <h1 className="text-4xl font-bold mt-4">
          Siz VIP foydalanuvchisiz 👑
        </h1>
        <p className="text-white/60 mt-2">
          Premium kontentlarga kirish ochilgan.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold"
        >
          Bosh sahifaga
        </button>
      </div>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/20 blur-3xl rounded-full"></div>

      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-50 px-5 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all flex items-center gap-3"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="max-w-5xl mx-auto px-5 py-16">

        {/* TOP */}
        <div className="relative overflow-hidden rounded-[40px] border border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 via-pink-500/10 to-purple-600/20 p-10 md:p-16 shadow-2xl">

          {/* GLOW */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">

            {/* ICON */}
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-6xl text-black shadow-[0_0_80px_rgba(255,215,0,0.5)]">

              <FaCrown />

            </div>

            {/* TITLE */}
            <h1 className="text-5xl md:text-7xl font-black mt-8 bg-gradient-to-r from-yellow-300 via-white to-pink-300 bg-clip-text text-transparent">
              VIP MEMBERSHIP
            </h1>

            <p className="text-white/60 text-lg mt-5 max-w-2xl mx-auto">
              Premium anime, maxsus imkoniyatlar va VIP badge olish uchun ownerga so‘rov yuboring.
            </p>

          </div>

        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="rounded-[30px] border border-pink-500/20 bg-pink-500/10 p-8 backdrop-blur-xl">
            <div className="text-5xl">👑</div>

            <h2 className="text-2xl font-black mt-6">
              VIP Badge
            </h2>

            <p className="text-white/50 mt-3">
              Profilingizda maxsus VIP status.
            </p>
          </div>

          <div className="rounded-[30px] border border-cyan-500/20 bg-cyan-500/10 p-8 backdrop-blur-xl">
            <div className="text-5xl">⚡</div>

            <h2 className="text-2xl font-black mt-6">
              Premium Anime
            </h2>

            <p className="text-white/50 mt-3">
              Faqat VIP foydalanuvchilar uchun anime.
            </p>
          </div>

          <div className="rounded-[30px] border border-yellow-500/20 bg-yellow-500/10 p-8 backdrop-blur-xl">
            <div className="text-5xl">🔥</div>

            <h2 className="text-2xl font-black mt-6">
              Early Access
            </h2>

            <p className="text-white/50 mt-3">
              Yangi episode va kontentlarga erta kirish.
            </p>
          </div>

        </div>

        {/* REQUEST CARD */}
        <div className="mt-10 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center">

          {!success ? (
            <>
              <h2 className="text-4xl font-black">
                VIP So‘rov Yuborish
              </h2>

              <p className="text-white/50 mt-4 text-lg">
                Owner sizning so‘rovingizni admin panel orqali ko‘radi.
              </p>

              <button
                disabled={loading}
                onClick={sendVipRequest}
                className="group mt-8 relative overflow-hidden rounded-3xl px-10 py-5 font-black text-xl"
              >

                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 group-hover:scale-110 transition-all duration-500"></div>

                <div className="relative flex items-center gap-4 text-black">
                  <FaPaperPlane />
                  {loading ? "Yuborilmoqda..." : "VIP So‘rov Yuborish"}
                </div>

              </button>
            </>
          ) : (
            <div>

              <div className="w-28 h-28 mx-auto rounded-full bg-green-500/20 border border-green-400 flex items-center justify-center text-5xl text-green-400">
                <FaCheckCircle />
              </div>

              <h2 className="text-5xl font-black mt-8 text-green-400">
                So‘rov Yuborildi
              </h2>

              <p className="text-white/50 mt-5 text-lg">
                Owner tez orada sizning VIP so‘rovingizni ko‘rib chiqadi.
              </p>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}