'use client';

import { useRef, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export function VideoPlayer({ url, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        muted={muted}
        playsInline
        className="w-full aspect-video object-contain"
        onClick={togglePlay}
        onEnded={() => setPlaying(false)}
      />

      {/* カスタムコントロール */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={togglePlay}
          className="text-white text-sm hover:text-amber-400 transition-colors"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="text-white text-sm hover:text-amber-400 transition-colors"
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* 再生オーバーレイ */}
      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center text-white text-2xl hover:bg-amber-500/80 transition-colors">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
