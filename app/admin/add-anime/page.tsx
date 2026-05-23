"use client";

import { useState } from "react";

export default function AddAnimePage() {

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: any) {

    e.preventDefault();

    const anime = {
      title,
      image,
      description,
    };

    console.log(anime);

    alert("Anime Added");

  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white p-10">

      <h1 className="text-5xl font-black mb-10">

        Add Anime

      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
      >

        <input
          type="text"
          placeholder="Anime title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none h-40"
        />

        <button className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 rounded-2xl font-bold">

          Add Anime

        </button>

      </form>

    </main>
  );
}