'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

interface ProjectGalleryProps {
  images: string[];
  projectTitle: string;
}

export function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
  };

  return (
    <div>
      {/* Gallery Grid with Staggered Viewport Reveals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img, idx) => (
          <motion.div
            key={img + idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.7,
              delay: idx * 0.1,
              ease: EASE_EDITORIAL,
            }}
            onClick={() => openLightbox(idx)}
            data-cursor="open"
            className={`relative group cursor-pointer overflow-hidden bg-[#E8E4DC] border border-[var(--border-light)] ${
              idx === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
            }`}
          >
            <Image
              src={img}
              alt={`${projectTitle} - Architectural Gallery Vignette ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
              className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="p-3 bg-white/80 backdrop-blur-sm text-black rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <ZoomIn className="w-5 h-5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
          >
            {/* Top Toolbar */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-10 font-sans">
              <span className="text-xs uppercase tracking-widest text-white/70 font-mono">
                {projectTitle} · {lightboxIndex + 1} of {images.length}
              </span>
              <button
                onClick={closeLightbox}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Close image lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative w-full max-w-5xl h-[75vh] flex items-center justify-center">
              <Image
                src={images[lightboxIndex]}
                alt={`${projectTitle} fullscreen view`}
                fill
                sizes="100vw"
                className="object-contain object-center"
              />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
