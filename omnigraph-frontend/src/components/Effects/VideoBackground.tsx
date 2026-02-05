"use client";

import { useEffect, useRef } from "react";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure seamless loop
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play();
    });

    // Auto-play on mount
    video.play().catch(err => {
      console.log("Video autoplay prevented:", err);
    });

    return () => {
      video.removeEventListener('ended', () => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
      >
        <source src="/videos/omnigraf-intro.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradients for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-300/80 via-dark-300/60 to-dark-300/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-base-blue/10 via-transparent to-accent-500/10" />

      {/* Vignette effect */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.4) 100%)'
      }} />
    </div>
  );
}
