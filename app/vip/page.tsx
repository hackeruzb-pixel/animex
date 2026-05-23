"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCrown, FaBolt } from "react-icons/fa";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<"click" | "payme" | null>(null);

  const user = auth.currentUser;

  const handlePayment = async (type: "click" | "payme") => {
    if (!user) return;

    setLoading(true);

    // 🔥 SEND TO BACKEND (REAL PAYMENT INIT)
    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.uid,
        type,
        amount: 10000, // VIP price
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // redirect to Click/Payme
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20"
      >
        ← Back
      </button>

      <div className="w-full max-w-lg">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-yellow-400 text-black flex items-center justify-center text-3xl">
            <FaCrown />
          </div>

          <h1 className="text-4xl font-black mt-4 text-yellow-400">
            VIP UPGRADE
          </h1>

          <p className="text-gray-400 mt-2">
            Unlock premium anime access
          </p>
        </div>

        {/* OPTIONS */}
        <div className="space-y-4">

          <div
            onClick={() => setSelected("click")}
            className={`p-5 rounded-2xl border cursor-pointer ${
              selected === "click"
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-700"
            }`}
          >
            ⚡ Click Payment
          </div>

          <div
            onClick={() => setSelected("payme")}
            className={`p-5 rounded-2xl border cursor-pointer ${
              selected === "payme"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700"
            }`}
          >
            💳 Payme Payment
          </div>

        </div>

        {/* BUTTON */}
        <button
          disabled={!selected || loading}
          onClick={() => selected && handlePayment(selected)}
          className="w-full mt-6 py-4 rounded-2xl bg-yellow-400 text-black font-bold"
        >
          {loading ? "Processing..." : "Pay & Become VIP"}
        </button>

      </div>
    </div>
  );
}