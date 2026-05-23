"use client";

import Link from "next/link";
import {
  FaSearch,
  FaUser,
  FaTimes,
  FaBars,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    router.push(`/animelar?search=${search}`);
    setSearch("");
    setSearchOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  /* OUTSIDE CLICK PROFILE CLOSE */
  useEffect(() => {
    const handleClick = () => setProfileOpen(false);

    if (profileOpen) {
      window.addEventListener("click", handleClick);
    }

    return () => window.removeEventListener("click", handleClick);
  }, [profileOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-gray-800">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link href="/" className="text-white text-2xl font-black">
          ANIMEX
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-8 text-white">
          <Link href="/">Home</Link>
          <Link href="/animelar">Animelar</Link>
          <Link href="/genres">Janrlar</Link>
          <Link href="/about">Biz haqimizda</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div className="relative">
            {!searchOpen && (
              <button
                onClick={() => router.push("/?scroll=search")}
                className="w-11 h-11 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center text-white"
              >
                <FaSearch />
              </button>
            )}

            {searchOpen && (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 bg-black border border-gray-700 rounded-2xl px-4 py-2"
              >
                <FaSearch className="text-gray-400" />

              
              </form>
            )}
          </div>

          {/* PROFILE */}
       {user ? (
  <Link href="/profile">
    <button className="w-11 h-11 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center text-white">
      <FaUser />
    </button>
  </Link>
) : (
  <Link href="/login">
    <button className="bg-white text-black px-5 py-2 rounded-2xl font-semibold">
      Kirish
    </button>
  </Link>
)}

          {/* MOBILE MENU */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden w-11 h-11 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center text-white text-xl"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-[1000] transition ${
          menuOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >

        {/* BACKDROP */}
        <div
          onClick={closeMenu}
          className={`absolute inset-0 bg-black transition-opacity ${
            menuOpen ? "opacity-60" : "opacity-0"
          }`}
        />

        {/* SIDEBAR */}
        <div
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl p-6 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >

          <button
            onClick={closeMenu}
            className="mb-8 text-black text-3xl"
          >
            <FaTimes />
          </button>

          <div className="flex flex-col gap-6 text-black text-lg font-semibold">
            <Link onClick={closeMenu} href="/">Home</Link>
            <Link onClick={closeMenu} href="/animelar">Animelar</Link>
            <Link onClick={closeMenu} href="/vip">👑VIP</Link>
            <Link onClick={closeMenu} href="/genres">Janrlar</Link>
            <Link onClick={closeMenu} href="/about">Biz haqimizda</Link>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            {!user ? (
              <Link href="/login">
                <button className="w-full py-3 rounded-xl bg-black text-white font-bold">
                  Kirish
                </button>
              </Link>
            ) : (
              <button
                onClick={() => signOut(auth)}
                className="w-full py-3 rounded-xl bg-red-500 text-white font-bold"
              >
                Chiqish
              </button>
            )}
          </div>

        </div>
      </div>

    </header>
  );
}