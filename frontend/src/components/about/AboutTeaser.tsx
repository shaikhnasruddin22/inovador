'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { StudioAbout } from '@/types';
import { Container } from '@/components/layout/Container';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { EASE_EDITORIAL, EASE_CINEMATIC } from '@/lib/utils/animations';

interface AboutTeaserProps {
  aboutData?: StudioAbout;
}

export function AboutTeaser({ aboutData }: AboutTeaserProps) {
  const ethosEyebrow = aboutData?.ethosEyebrow || 'The Inovador Ethos';
  const ethosHeadline =
    aboutData?.ethosHeadline ||
    'Architecture grounded in material honesty & spatial stillness.';
  const ethosDesc1 =
    aboutData?.ethosDescription1 ||
    'Founded in 2018, Inovador Design Studio is an architecture and spatial practice operating across Mumbai, Goa, Bengaluru, and Alibaug. We reject arbitrary decoration in favor of structural clarity, native masonry, and the tactile poetry of natural daylight.';
  const ethosDesc2 =
    aboutData?.ethosDescription2 ||
    'Every project is approached as an ecological and cultural artifact—forged through deep collaboration with master craftsmen, stone masons, and local fabricators.';
  const years = aboutData?.yearsExperience || 6;
  const works = aboutData?.worksCount || 40;
  const hubs = aboutData?.hubsCount || 5;

  return (
    <section className="section-spacing bg-[var(--bg-secondary)] border-y border-[var(--border-light)] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative & Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-sans font-medium mb-3 block">
                {ethosEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] text-[var(--text-primary)] mb-6">
                {ethosHeadline}
              </h2>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] font-light leading-relaxed mb-6 font-sans">
                {ethosDesc1}
              </p>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed mb-10 font-sans">
                {ethosDesc2}
              </p>
            </div>

            {/* Studio Key Stats with Animated Counter */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[var(--border-subtle)]">
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] block">
                  <AnimatedCounter value={years} suffix="+" />
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-1 block font-sans">
                  Years of Practice
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] block">
                  <AnimatedCounter value={works} suffix="+" />
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-1 block font-sans">
                  Completed Works
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] block">
                  <AnimatedCounter value={hubs} />
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-1 block font-sans">
                  Regional Studios
                </span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] font-medium text-[var(--text-primary)] hover:text-[var(--accent-terracotta)] transition-colors"
              >
                <span>Read Full Studio Manifesto</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Editorial Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full overflow-hidden shadow-sm group">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                alt="Inovador Design Studio architectural exploration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Floating Editorial Quote Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: EASE_EDITORIAL }}
              className="absolute -bottom-6 -left-6 sm:bottom-8 sm:-left-8 bg-white/95 backdrop-blur-sm p-6 sm:p-8 max-w-[280px] sm:max-w-xs border border-[var(--border-light)] shadow-lg"
            >
              <p className="font-serif italic text-sm text-[var(--text-primary)] leading-relaxed">
                &ldquo;Form follows ritual. We do not design shells; we craft atmospheres for contemplation.&rdquo;
              </p>
              <span className="block mt-3 text-[10px] uppercase tracking-[0.16em] text-[var(--accent-terracotta)] font-medium">
                Design Philosophy
              </span>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
