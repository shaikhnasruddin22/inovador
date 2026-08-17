'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_EDITORIAL, EASE_CINEMATIC } from '@/lib/utils/animations';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  title?: string;
  location?: string;
  description?: string;
}

export function BeforeAfterSlider({
  beforeImage = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
  afterImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
  title = 'Apartment 702 Heritage Transformation',
  location = 'Marine Drive, Mumbai',
  description = 'Drag the slider to reveal the contrast between the original dilapidated Art Deco shell and our restored sanctuary of honed travertine, fluted walnut, and brushed bronze.',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  // If no before/after pair exists, do not render broken element
  if (!beforeImage || !afterImage) {
    return null;
  }

  return (
    <section id="renovations" className="section-spacing bg-[var(--bg-primary)] scroll-mt-20 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        >
          <SectionHeading
            eyebrow="Adaptive Reuse &amp; Transformation"
            title="Before &amp; After Restoration"
            subtitle={description}
          />
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Metadata Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mb-4 font-sans"
          >
            <span className="text-[var(--text-primary)] font-medium">{title}</span>
            <span>{location}</span>
          </motion.div>

          {/* Interactive Comparison Container with data-cursor="drag" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
            ref={containerRef}
            tabIndex={0}
            role="slider"
            data-cursor="drag"
            aria-label="Before and after transformation comparison slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={handleKeyDown}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/10] overflow-hidden select-none cursor-ew-resize border border-[var(--border-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-terracotta)]"
          >
            {/* After Image (Full background) */}
            <div className="absolute inset-0">
              <Image
                src={afterImage}
                alt="After architectural restoration"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-white text-[11px] uppercase tracking-widest px-3 py-1 font-medium font-sans">
                After: Restored
              </span>
            </div>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <Image
                src={beforeImage}
                alt="Before architectural restoration"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center grayscale brightness-90"
              />
              <span className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white text-[11px] uppercase tracking-widest px-3 py-1 font-medium font-sans">
                Before: Original Shell
              </span>
            </div>

            {/* Draggable Divider Line & Knob */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-xl pointer-events-none transition-all"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform duration-200">
                <GripVertical className="w-4 h-4 text-black/80" />
              </div>
            </div>
          </motion.div>

          {/* Accessibility & Interaction Hint */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-4 font-sans">
            <span>Use Left/Right arrow keys or drag handle to compare</span>
            <span className="font-mono">{Math.round(sliderPosition)}% View</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
