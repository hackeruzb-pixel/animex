'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  getDocs,
} from 'firebase/firestore';

import { db } from './../lib/firebase';
import { supabase } from "@/lib/supabase";
/* ================= TYPES ================= */

type Episode = {
  title: string;
  videoUrl: string;
  number: number;
};

type Anime = {
  id?: string;
  title: string;
  image: string;
  description: string;
  episodes: number;
  genre: string[];
  status: string;
  views: number;
  rating?: number;
  year?: number;
    vip?: boolean;
  episodeList?: Episode[];
};

type UserType = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  banned?: boolean;
};

/* ================= COMPONENT ================= */

export default function AdminPage() {
  const router = useRouter();

  const [active, setActive] = useState<
  'add' | 'edit' | 'episode' | 'users' | 'vip_requests' | null
>(null);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
const [uploading, setUploading] = useState(false);
  const [episodes, setEpisodes] = useState<number>(0);
  const [rating, setRating] = useState<number>(5);
 const [genre, setGenre] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [editId, setEditId] = useState<string | null>(null);

  const [selectedAnimeId, setSelectedAnimeId] = useState('');

  const [episodeTitle, setEpisodeTitle] = useState('');

  const [episodeUrl, setEpisodeUrl] = useState('');

  const [episodeNumber, setEpisodeNumber] = useState<number>(1);

  const [editingEpisodeIndex, setEditingEpisodeIndex] = useState<number | null>(
    null,
  );
const [vip, setVip] = useState(false);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
const [vip_requests, setVipRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const animeRef = collection(db, 'anime');
  const DEFAULT_IMAGE = './img/Twitter.jpg';
  /* ================= FETCH ================= */

  useEffect(() => {
    const unsub = onSnapshot(animeRef, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Anime),
      }));

      setAnimeList(data);
    });

    return () => unsub();
  }, []);
useEffect(() => {
  const unsub = onSnapshot(collection(db, "vip_requests"), (snap) => {
    setVipRequests(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });

  return () => unsub();
}, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, 'users'));

      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as UserType[];

      setUsers(arr);
    };

    fetchUsers();
    
  }, []);
useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, 'users'));

      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as UserType[];

      setUsers(arr);
    };

    fetchUsers();
  
  }, []);
  const filteredUsers = users.filter((u) => {
  const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();

  return (
    fullName.includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
});



const uploadVideo = async (file: File) => {
  const fileName = `episodes/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("auth") // ✅ shu bucket
    .upload(fileName, file);

  if (error) {
    console.log("UPLOAD ERROR:", error.message);
    return null;
  }

  const { data } = supabase.storage
    .from("auth") // ✅ shu ham bir xil bo‘lishi shart
    .getPublicUrl(fileName);

  return data.publicUrl;
};
  /* ================= SAVE ================= */

  const saveAnime = async () => {
    if (!title) return;

    const finalImage = image || DEFAULT_IMAGE;

    if (editId) {
  await updateDoc(doc(db, 'anime', editId), {
    title,
    image: finalImage,
    description,
    episodes,
    genre,
    status,
    rating,
    year,
    vip,
  });
} else {
  await addDoc(animeRef, {
    title,
    image: finalImage,
    description,
    episodes,
    genre,
    status,
    views: 0,
    rating: 5,
    year,
    vip,
    episodeList: [],
    createdAt: Date.now(),
  });
}

    resetForm();
  };

  const deleteAnime = async (id: string) => {
    await deleteDoc(doc(db, 'anime', id));
  };

  const openEdit = (a: Anime) => {
    setTitle(a.title);
    setImage(a.image);
    setDescription(a.description);
    setEpisodes(a.episodes);
    setGenre(a.genre);
    setStatus(a.status);
    setYear(a.year || 2026);
    setVip(a.vip || false);
    setEditId(a.id || null);

    setActive('add');
  };

  const saveEpisode = async () => {
    const anime = animeList.find((a) => a.id === selectedAnimeId);

    if (!anime) return;

    const list = anime.episodeList || [];

    const newEp: Episode = {
      title: episodeTitle,
      videoUrl: episodeUrl,
      number: episodeNumber,
    };

    let updated;

    if (editingEpisodeIndex !== null) {
      list[editingEpisodeIndex] = newEp;
      updated = [...list];
    } else {
      updated = [...list, newEp];
    }

    await updateDoc(doc(db, 'anime', selectedAnimeId), {
      episodeList: updated,
    });

    resetEpisode();
  };

  const deleteEpisode = async (animeId: string, index: number) => {
    const anime = animeList.find((a) => a.id === animeId);

    if (!anime) return;

    const updated = [...(anime.episodeList || [])];

    updated.splice(index, 1);

    await updateDoc(doc(db, 'anime', animeId), {
      episodeList: updated,
    });
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setTitle('');
    setImage('');
    setDescription('');
    setEpisodes(0);
    setGenre([]);
    setStatus('');
    setYear(2026);
    setVip(false);
    setRating(5);
    setEditId(null);
    setActive(null);
  };

  const resetEpisode = () => {
    setEpisodeTitle('');
    setEpisodeUrl('');
    setEpisodeNumber(1);
    setEditingEpisodeIndex(null);
    setActive(null);
  };

  const filtered = animeList.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#020617] to-[#0f172a] text-white p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black">
            👑 Anime Admin Panel
          </h1>

          <p className="text-gray-400 mt-2">Manage anime, episodes and users</p>
        </div>

        {/* HOME BUTTON */}
        <button
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all px-6 py-4 rounded-2xl font-black shadow-2xl"
        >
          🏠 Home
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search anime..."
        className="w-full md:w-1/2 p-4 mb-10 bg-[#111827] border border-white/10 rounded-2xl outline-none"
      />

      {/* BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
        <button onClick={() => setActive('add')} className="card">
          ➕ Add Anime
        </button>

        <button onClick={() => setActive('episode')} className="card">
          🎞 Episodes
        </button>

        <button onClick={() => setActive('edit')} className="card">
          📺 Anime List
        </button>

        <button onClick={() => setActive('users')} className="card">
          👥 Users
        </button>
        <button onClick={() => setActive('vip_requests')} className="card">
  👑 VIP Requests
</button>
      </div>
      {/* ================= ADD / EDIT ANIME ================= */}

      {active === 'add' && (
        <Modal onClose={() => setActive(null)}>
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            {editId ? '✏ Edit Anime' : '➕ Add Anime'}
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* TITLE */}
            <div>
              <p className="mb-2 text-gray-400 font-semibold">Anime Title</p>

              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Naruto..."
              />
            </div>

            {/* GENRE */}
            <div>
  <p className="mb-2 text-gray-400 font-semibold">Genre</p>

  <div className="grid grid-cols-2 gap-2">
    {["Action", "Fantasy", "Romance", "Drama", "Comedy", "Echchi", "Horror"].map((g) => (
      <label
        key={g}
        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition"
      >
        <input
          type="checkbox"
          checked={genre.includes(g)}
          onChange={(e) => {
            if (e.target.checked) {
              setGenre([...genre, g]);
            } else {
              setGenre(genre.filter((x) => x !== g));
            }
          }}
          className="accent-pink-500"
        />

        <span className="text-white text-sm">{g}</span>
      </label>
    ))}
  </div>
</div>
            {/* YEAR */}
            <div>
              <p className="mb-2 text-gray-400 font-semibold">Year</p>

              <input
                type="number"
                className="input"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                placeholder="2026"
              />
            </div>
            {/* RATING */}
            <div className="mt-5">
              <p className="mb-2 text-gray-400 font-semibold">Rating ⭐</p>

              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                className="input"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                placeholder="5.0"
              />
            </div>
            {/* STATUS */}
            <div>
              <p className="mb-2 text-gray-400 font-semibold">Status</p>

              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select status</option>

                <option value="Ongoing">Ongoing</option>

                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* EPISODES */}
            <div>
              <p className="mb-2 text-gray-400 font-semibold">Episodes</p>

              <input
                type="number"
                className="input"
                value={episodes}
                onChange={(e) => setEpisodes(Number(e.target.value))}
                placeholder="12"
              />
            </div>
          </div>
{/* VIP */}
<div className="mt-5">
  <label className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 cursor-pointer">

    <input
      type="checkbox"
      checked={vip}
      onChange={(e) => setVip(e.target.checked)}
      className="w-5 h-5 accent-yellow-500"
    />

    <div>
      <p className="font-black text-yellow-400">
        👑 VIP Anime
      </p>

      <p className="text-sm text-gray-400">
        Belgilansa anime VIP bo‘limga tushadi
      </p>
    </div>

  </label>
</div>
          {/* DESCRIPTION */}
          <div className="mt-5">
            <p className="mb-2 text-gray-400 font-semibold">Description</p>

            <textarea
              className="input min-h-[140px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Anime description..."
            />
          </div>

<div>
  
</div>
          <button onClick={saveAnime} className="btn mt-5">
            {editId ? '💾 Update Anime' : '🚀 Save Anime'}
          </button>
        </Modal>
      )}

      {/* ================= EPISODES PANEL ================= */}

      {active === 'episode' && (
        <Modal onClose={() => setActive(null)}>
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            🎞 Episodes Panel
          </h2>

          {/* SELECT */}
          <div className="mb-5">
            <p className="mb-2 text-gray-400 font-semibold">Select Anime</p>

            <select
              className="input"
              value={selectedAnimeId}
              onChange={(e) => setSelectedAnimeId(e.target.value)}
            >
              <option value="">Select anime</option>

              {animeList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div className="mb-5">
            <p className="mb-2 text-gray-400 font-semibold">Episode Title</p>

            <input
              className="input"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              placeholder="Episode 1"
            />
          </div>

          {/* NUMBER */}
          <div className="mb-5">
            <p className="mb-2 text-gray-400 font-semibold">Episode Number</p>

            <input
              type="number"
              className="input"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(Number(e.target.value))}
            />
          </div>

          {/* VIDEO */}
<div className="mb-5">
  <p className="mb-2 text-gray-400 font-semibold">Upload Video</p>

  {/* INPUT */}
  <input
  type="file"
  accept="video/*"
  className="input"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true); // 🔥 START

    const url = await uploadVideo(file);

    setUploading(false); // 🔥 END

    if (url) {
      setEpisodeUrl(url);
    } else {
      alert("Upload failed!");
    }
  }}
/>
{uploading && (
  <p className="text-blue-400 font-bold mt-2">
    ⏳ Video yuklanmoqda...
  </p>
)}
  {/* LOADING INFO */}
  {!episodeUrl && (
    <p className="text-gray-500 text-sm mt-2">
      🎥 Video hali yuklanmagan
    </p>
  )}

  {/* PREVIEW */}
  {episodeUrl && !uploading && (
  <video
    src={episodeUrl}
    controls
    className="w-full rounded-3xl mt-4 border border-white/10"
  />
)}
</div>
          <button onClick={saveEpisode} className="btn-green">
            {editingEpisodeIndex !== null
              ? '💾 Update Episode'
              : '🚀 Save Episode'}
          </button>
        </Modal>
      )}

      {/* ================= ANIME LIST ================= */}

      {active === 'edit' && (
        <Modal onClose={() => setActive(null)}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black">📺 Anime List</h2>

              <p className="text-gray-400 mt-2">All uploaded anime</p>
            </div>

            <div className="bg-blue-600 px-5 py-3 rounded-2xl font-bold">
              {filtered.length} Anime
            </div>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="bg-gradient-to-br from-[#111827] to-[#1f2937] border border-white/10 rounded-[30px] overflow-hidden"
              >
                {/* TOP */}
                <div className="flex flex-col md:flex-row gap-5 p-5">
                  <img
                    src={a.image}
                    className="w-full md:w-[220px] h-[300px] object-cover rounded-3xl"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-black">{a.title}</h3>

                        <p className="text-gray-400 mt-2">{a.genre}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(a)}
                          className="bg-yellow-500 text-black px-5 py-3 rounded-2xl font-bold"
                        >
                          ✏ Edit
                        </button>

                        <button
                          onClick={() => deleteAnime(a.id!)}
                          className="bg-red-600 px-5 py-3 rounded-2xl font-bold"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 mt-5 leading-7">
                      {a.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <div className="px-4 py-2 rounded-full bg-white/10">
                        🎬 {a.episodes} Episodes
                      </div>

                      <div className="px-4 py-2 rounded-full bg-white/10">
                        👁 {a.views} Views
                      </div>
                      <div className="px-4 py-2 rounded-full bg-white/10">
                        📅 {a.year || 'N/A'}
                      </div>
                      <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-400">
                        {a.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EPISODES */}
                {a.episodeList && a.episodeList.length > 0 && (
                  <div className="border-t border-white/10 p-5">
                    <h4 className="text-2xl font-black mb-5">🎞 Episodes</h4>

                    <div className="space-y-4">
                      {a.episodeList.map((ep, i) => (
                        <div
                          key={i}
                          className="bg-black/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                          <div>
                            <h5 className="font-black text-lg">
                              Episode {ep.number}
                            </h5>

                            <p className="text-gray-400">{ep.title}</p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setSelectedAnimeId(a.id!);

                                setEpisodeTitle(ep.title);

                                setEpisodeUrl(ep.videoUrl);

                                setEpisodeNumber(ep.number);

                                setEditingEpisodeIndex(i);

                                setActive('episode');
                              }}
                              className="bg-blue-600 px-5 py-2 rounded-xl font-bold"
                            >
                              ✏ Edit
                            </button>

                            <button
                              onClick={() => deleteEpisode(a.id!, i)}
                              className="bg-red-600 px-5 py-2 rounded-xl font-bold"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
      {/* VIP REQUESTS PANEL */}

{active === 'vip_requests' && (
  <Modal onClose={() => setActive(null)}>

    <div className="flex items-center justify-between mb-8">

      <div>
        <h2 className="text-4xl font-black">
          👑 VIP Requests
        </h2>

        <p className="text-gray-400 mt-2">
          VIP so‘rovlarini qabul qilish paneli
        </p>
      </div>

      <div className="px-5 py-3 rounded-2xl bg-pink-500/20 border border-pink-500 text-pink-300 font-bold">
        {vip_requests.length} Requests
      </div>

    </div>

    <div className="space-y-5 max-h-[70vh] overflow-y-auto">

      {vip_requests.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-bold text-xl">
          😴 VIP requests yo‘q
        </div>
      )}

      {vip_requests.map((req: any) => (

        <div
          key={req.id}
          className="rounded-[30px] border border-pink-500/20 bg-gradient-to-br from-[#111827] to-[#1f2937] p-6"
        >

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-4">

                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-3xl font-black">
                  {req.firstName?.charAt(0)}
                </div>

                <div>
                  <h3 className="text-2xl font-black">
                    {req.firstName} {req.lastName}
                  </h3>

                  <p className="text-gray-400 mt-1">
                    {req.email}
                  </p>
                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={async () => {

                 await updateDoc(doc(db, "users", req.uid), {
  role: "vip",
});

                  await deleteDoc(doc(db, "vip_requests", req.id));

                }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 rounded-2xl font-black"
              >
                👑 Accept VIP
              </button>

              <button
                onClick={async () => {

                  await deleteDoc(doc(db, "vip_requests", req.id));

                }}
                className="bg-red-600 px-6 py-4 rounded-2xl font-black"
              >
                ❌ Reject
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>

  </Modal>
)}
      {/* USERS PANEL */}

      {active === 'users' && (
        <Modal onClose={() => setActive(null)}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black">
                👥 User Management
              </h2>

              <p className="text-gray-400 mt-2">All users, VIP and owners</p>
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 rounded-2xl font-bold shadow-xl w-fit">
              {users.length} Users
            </div>
          </div>
<input
  value={userSearch}
  onChange={(e) => setUserSearch(e.target.value)}
  placeholder="Search user (name or email)..."
  className="w-full p-4 mb-6 bg-[#111827] border border-white/10 rounded-2xl outline-none text-white"
/>
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        {filteredUsers.length === 0 ? (
  <div className="text-center text-gray-400 py-10 font-bold">
    😕 Foydalanuvchi topilmadi
  </div>
) : (
  [...filteredUsers]
    .sort((a, b) => {
      if (a.role === 'owner') return -1;
      if (b.role === 'owner') return 1;
      return 0;
    })
              .map((u) => (
                <div
                  key={u.id}
                  className={`relative overflow-hidden rounded-[28px] p-5 border shadow-2xl

                  ${
                    u.role === 'owner'
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-400'
                      : u.role === 'vip'
                        ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/10 border-pink-500'
                        : 'bg-gradient-to-br from-[#111827] to-[#1f2937] border-white/10'
                  }`}
                >
                  {/* MOBILE */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* LEFT */}
                    <div className="flex items-start gap-4">
                      {/* AVATAR */}
                      <div
                        className={`min-w-[70px] w-[70px] h-[70px] rounded-full flex items-center justify-center text-2xl font-black border-4

                        ${
                          u.role === 'owner'
                            ? 'bg-black text-yellow-400 border-yellow-400'
                            : u.role === 'vip'
                              ? 'bg-black text-pink-400 border-pink-400'
                              : 'bg-black text-white border-white/20'
                        }`}
                      >
                        {u.firstName?.charAt(0)}
                      </div>

                      {/* INFO */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-black break-words">
                          {u.firstName} {u.lastName}
                        </h3>

                        <p className="text-gray-400 break-all mt-1 text-sm md:text-base">
                          {u.email}
                        </p>

                        <div className="mt-4">
                          {u.role === 'owner' && (
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400 text-black font-black shadow-xl">
                              👑 OWNER
                            </div>
                          )}

                          {u.role === 'vip' && (
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black shadow-xl">
                              👑 VIP USER
                            </div>
                          )}

                          {(!u.role || u.role === 'user') && (
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white font-black">
                              👤 USER
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT BUTTONS */}
                    {u.role !== 'owner' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-[240px]">
                        {/* VIP */}
                        {u.role !== 'vip' ? (
                          <button
                            onClick={async () => {
                              await updateDoc(doc(db, 'users', u.id), {
                                role: 'vip',
                              });

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        role: 'vip',
                                      }
                                    : x,
                                ),
                              );
                            }}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all"
                          >
                            👑 Make VIP
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await updateDoc(doc(db, 'users', u.id), {
                                role: 'user',
                              });

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        role: 'user',
                                      }
                                    : x,
                                ),
                              );
                            }}
                            className="bg-blue-600 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                          >
                            👤 Remove VIP
                          </button>
                        )}

                        {/* BAN */}
                        {!u.banned ? (
                          <button
                            onClick={async () => {
                              await updateDoc(doc(db, 'users', u.id), {
                                banned: true,
                              });

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        banned: true,
                                      }
                                    : x,
                                ),
                              );
                            }}
                            className="bg-red-600 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all"
                          >
                            🚫 Ban
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await updateDoc(doc(db, 'users', u.id), {
                                banned: false,
                              });

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        banned: false,
                                      }
                                    : x,
                                ),
                              );
                            }}
                            className="bg-green-600 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all"
                          >
                            ✅ Unban
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* BANNED */}
                  {u.banned && (
                    <div className="mt-5 bg-red-500/20 border border-red-500 rounded-2xl p-4 text-center text-red-400 font-black">
                      🚫 THIS ACCOUNT IS BANNED
                    </div>
                  )}
                </div>
              )))}
          </div>
        </Modal>
      )}

      {/* STYLES */}
      <style jsx>{`
        .card {
          background: linear-gradient(135deg, #111827, #1f2937);

          border: 1px solid rgba(255, 255, 255, 0.1);

          padding: 22px;

          border-radius: 24px;

          font-weight: bold;

          font-size: 17px;

          transition: 0.3s;

          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .card:hover {
          transform: translateY(-4px) scale(1.02);

          background: linear-gradient(135deg, #1f2937, #374151);
        }

        .input {
          width: 100%;
          padding: 14px;
          margin-bottom: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #111827;
          color: white;
          outline: none;
        }

        .btn {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 14px;
          border-radius: 14px;
          font-weight: bold;
        }

        .btn-green {
          width: 100%;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          padding: 14px;
          border-radius: 14px;
          font-weight: bold;
        }
      `}</style>
    </main>
  );
}

/* ================= MODAL ================= */

function Modal({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] text-white p-5 md:p-7 rounded-3xl w-full max-w-5xl relative border border-white/10 shadow-2xl max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl hover:text-red-400 transition"
        >
          ✖
        </button>

        {children}
      </div>
    </div>
  );
}
