'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { EASE_EDITORIAL, EASE_CINEMATIC } from '@/lib/utils/animations';

export function AboutTeaser() {
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
                The Inovador Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] text-[var(--text-primary)] mb-6">
                Architecture grounded in material honesty &amp; spatial stillness.
              </h2>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] font-light leading-relaxed mb-6 font-sans">
                Founded in 2018, Inovador Design Studio is an architecture and spatial practice operating across Mumbai, Goa, Bengaluru, and Alibaug. We reject arbitrary decoration in favor of structural clarity, native masonry, and the tactile poetry of natural daylight.
              </p>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed mb-10 font-sans">
                Every project is approached as an ecological and cultural artifact—forged through deep collaboration with master craftsmen, stone masons, and local fabricators.
              </p>
            </div>

            {/* Studio Key Stats with Animated Counter */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[var(--border-subtle)]">
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] block">
                  <AnimatedCounter value={6} suffix="+" />
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-1 block font-sans">
                  Years of Practice
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] block">
                  <AnimatedCounter value={40} suffix="+" />
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-1 block font-sans">
                  Completed Works
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] block">
                  <AnimatedCounter value={5} />
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-1 block font-sans">
                  Studio Hubs
                </span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[var(--text-primary)] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[var(--accent-terracotta)] transition-colors duration-300 group active:scale-95"
              >
                <span>Read Full Studio Philosophy</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Architectural Photography with Subtle Parallax / Settle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE_CINEMATIC }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] bg-[#E8E4DC] overflow-hidden border border-[var(--border-subtle)] group">
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop"
                alt="Inovador Studio Material Craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-serif italic text-lg sm:text-xl font-light mb-1">
                  &ldquo;A building should feel like it was grown from its soil, not imposed upon it.&rdquo;
                </p>
                <span className="text-xs uppercase tracking-[0.16em] text-white/80 font-sans">
                  Principal Architect Manifesto
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
