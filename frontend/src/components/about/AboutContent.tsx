'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_EDITORIAL, EASE_CINEMATIC } from '@/lib/utils/animations';

interface Pillar {
  title: string;
  description: string;
}

interface Leader {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const PILLARS: Pillar[] = [
  {
    title: 'Material Honesty & Structural Clarity',
    description: 'We let materials speak their natural dialect. Basalt stone remains textured, lime-plaster breathes with the seasons, and raw timber patinas gracefully over decades.',
  },
  {
    title: 'Contextual & Biophilic Architecture',
    description: 'Every building is an organic extension of its landscape. We study sun paths, monsoon wind corridors, and topography to craft passive microclimates that reduce ecological footprint.',
  },
  {
    title: 'Artisanal Craft & Millimeter Tolerances',
    description: 'We bridge architectural design with traditional master craftsmanship. Every joint, reveal, and bespoke brass fixture is engineered with couture precision.',
  },
  {
    title: 'Spatial Restraint & Quiet Luxury',
    description: 'We avoid transient trends and superfluous ornamentation. True luxury is found in generous proportions, rhythmic daylight, and spaces that invite quiet reflection.',
  },
];

const LEADERSHIP: Leader[] = [
  {
    name: 'Aarav Mehta',
    role: 'Principal Architect & Founder',
    bio: 'Trained at the Architectural Association (AA London) and CEPT Ahmedabad, Aarav brings over 14 years of experience formulating monolithic residential villas and public pavilions across South Asia.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Rhea Sengupta',
    role: 'Director of Interior Architecture & Spatial Identity',
    bio: 'Specializing in heritage restoration and bespoke material curation, Rhea oversees all interior joinery, bespoke lighting engineering, and art advisory commissions at Inovador.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  },
];

export function AboutContent() {
  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-[var(--bg-secondary)] border-b border-[var(--border-light)] overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="max-w-4xl"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-sans font-medium mb-4 block">
              About Inovador Design Studio
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight text-[var(--text-primary)] mb-6">
              Sculpting sanctuaries through raw materiality &amp; contextual rigor.
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] font-light leading-relaxed font-sans max-w-3xl">
              We are an interdisciplinary studio of architects, interior designers, and landscape planners dedicated to creating enduring spaces that celebrate the ritual of daily dwelling.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main Philosophy & Studio Narrative */}
      <section className="section-spacing overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
              className="lg:col-span-6"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-medium mb-3 block">
                Foundational Thesis
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] leading-snug mb-6">
                Architecture should not conquer the site—it should complete it.
              </h2>
              <div className="space-y-4 text-base text-[var(--text-secondary)] font-light leading-relaxed font-sans">
                <p>
                  Established in 2018 in Mumbai, Inovador was conceived in response to the homogenizing effects of rapid commercial construction. We believe that true architectural value resides in permanence, bespoke materiality, and environmental sensitivity.
                </p>
                <p>
                  Whether sculpting a coastal pavilion in Goa, restoring a 1930s Art Deco residence on Marine Drive, or developing a biophilic terrace in Bengaluru, we immerse ourselves in the geological, historical, and climatic narratives of the location.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: EASE_CINEMATIC }}
              className="lg:col-span-6"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#E8E4DC] overflow-hidden border border-[var(--border-subtle)] group">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                  alt="Inovador Design Studio Philosophy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>
          </div>

          {/* Design Pillars Grid */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            >
              <SectionHeading
                eyebrow="Core Tenets"
                title="Our Architectural Pillars"
                subtitle="The four foundational principles that guide every sketch, detail drawing, and site inspection across our practice."
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PILLARS.map((pillar, idx) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.1,
                    ease: EASE_EDITORIAL,
                  }}
                  whileHover={{ y: -4 }}
                  className="p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)]/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-light)]">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-terracotta)]">
                      Principle 0{idx + 1}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-terracotta)]" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[var(--text-primary)] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leadership & Principals */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            >
              <SectionHeading
                eyebrow="Studio Leadership"
                title="Principals &amp; Directorial Team"
                subtitle="Guided by over two decades of combined experience across luxury residential, heritage restoration, and landscape planning."
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {LEADERSHIP.map((leader, idx) => (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.15,
                    ease: EASE_EDITORIAL,
                  }}
                  className="bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)]/40 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative aspect-[4/3] bg-[#E8E4DC] overflow-hidden">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transform group-hover:scale-104 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-8">
                    <span className="text-xs uppercase tracking-[0.14em] text-[var(--accent-terracotta)] font-medium block mb-1">
                      {leader.role}
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-[var(--text-primary)] mb-4">
                      {leader.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed font-sans">
                      {leader.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="p-10 sm:p-14 bg-[var(--bg-dark)] text-white text-center max-w-4xl mx-auto border border-[var(--border-dark)] shadow-xl"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-medium block mb-3">
              Collaborate With Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light mb-4">
              Begin a collaborative commission dialogue.
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto font-light mb-8">
              We look forward to understanding your lifestyle rituals and formulating a bespoke architectural presence.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent-terracotta)] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[var(--accent-terracotta-hover)] transition-all duration-300 group active:scale-95"
            >
              <span>Initiate Studio Brief</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
