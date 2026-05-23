"use client";

import { useRef, useState } from "react";

export default function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }

    setPlaying(!playing);
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (!video) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent || 0);
  };

  const seek = (e: any) => {
    const video = videoRef.current;
    if (!video) return;

    const value = e.target.value;
    video.currentTime = (value / 100) * video.duration;
    setProgress(value);
  };

  return (
    <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl">

      {/* VIDEO */}
      <video
        ref={videoRef}
        src={url}
        className="w-full"
        onTimeUpdate={updateProgress}
      />

      {/* CONTROLS */}
      <div className="p-3 flex flex-col gap-2 bg-black/80">

        {/* progress */}
        <input
          type="range"
          value={progress}
          onChange={seek}
          className="w-full"
        />

        <div className="flex justify-between items-center">

          <button
            onClick={togglePlay}
            className="bg-red-500 px-4 py-1 rounded-lg text-white"
          >
            {playing ? "Pause" : "Play"}
          </button>

          <span className="text-white text-sm">
            {Math.round(progress)}%
          </span>

        </div>

      </div>

    </div>
  );
}