'use client';

import React, { useRef, useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';

interface HeroVideoProps {
  desktopVideo?: string;
  mobileVideo?: string;
  posterImage?: string;
  title: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  isActive: boolean;
  onEnded?: () => void;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function subscribeSaveData() {
  return () => {};
}

function getSaveDataSnapshot() {
  if (typeof navigator === 'undefined') return false;
  return Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
}

export function HeroVideo({
  desktopVideo,
  mobileVideo,
  posterImage,
  title,
  autoplay = true,
  muted = true,
  loop = true,
  playsInline = true,
  isActive,
  onEnded,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const isSaveData = useSyncExternalStore(
    subscribeSaveData,
    getSaveDataSnapshot,
    () => false
  );

  // Handle Play/Pause when isActive changes or tab/viewport visibility changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError || isReducedMotion || isSaveData) return;

    if (isActive) {
      if (autoplay) {
        video.play().catch(() => {
          // Autoplay policy prevented playback, keep poster fallback
        });
      }
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // Ignored
      }
    }
  }, [isActive, autoplay, hasError, isReducedMotion, isSaveData]);

  // Handle Tab Visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video || !isActive || hasError) return;

      if (document.visibilityState === 'hidden') {
        video.pause();
      } else if (document.visibilityState === 'visible' && autoplay) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, autoplay, hasError]);

  // If reduced motion or saveData is active, or video errored, show poster image
  if (isReducedMotion || isSaveData || hasError || (!desktopVideo && !mobileVideo)) {
    if (posterImage) {
      return (
        <Image
          src={posterImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-100"
        />
      );
    }
    return <div className="absolute inset-0 bg-[#121212]" />;
  }

  const videoSource = desktopVideo || mobileVideo;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Poster Image while loading */}
      {posterImage && !isLoaded && (
        <Image
          src={posterImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center absolute inset-0 z-0"
        />
      )}

      <video
        ref={videoRef}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        poster={posterImage}
        onLoadedData={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        onEnded={onEnded}
        className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {mobileVideo && <source src={mobileVideo} media="(max-width: 767px)" type="video/mp4" />}
        {desktopVideo && <source src={desktopVideo} type="video/mp4" />}
        {videoSource && <source src={videoSource} />}
      </video>
    </div>
  );
}
