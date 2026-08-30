'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { StudioAbout, Pillar, Leader } from '@/types';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_EDITORIAL, EASE_CINEMATIC } from '@/lib/utils/animations';

const DEFAULT_PILLARS: Pillar[] = [
  {
    title: 'Material Honesty & Structural Clarity',
    description:
      'We let materials speak their natural dialect. Basalt stone remains textured, lime-plaster breathes with the seasons, and raw timber patinas gracefully over decades.',
  },
  {
    title: 'Contextual & Biophilic Architecture',
    description:
      'Every building is an organic extension of its landscape. We study sun paths, monsoon wind corridors, and topography to craft passive microclimates that reduce ecological footprint.',
  },
  {
    title: 'Artisanal Craft & Millimeter Tolerances',
    description:
      'We bridge architectural design with traditional master craftsmanship. Every joint, reveal, and bespoke brass fixture is engineered with couture precision.',
  },
  {
    title: 'Spatial Restraint & Quiet Luxury',
    description:
      'We avoid transient trends and superfluous ornamentation. True luxury is found in generous proportions, rhythmic daylight, and spaces that invite quiet reflection.',
  },
];

const DEFAULT_LEADERSHIP: Leader[] = [
  {
    name: 'Aarav Mehta',
    role: 'Principal Architect & Founder',
    bio: 'Trained at the Architectural Association (AA London) and CEPT Ahmedabad, Aarav brings over 14 years of experience formulating monolithic residential villas and public pavilions across South Asia.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Rhea Sengupta',
    role: 'Director of Interior Architecture & Spatial Identity',
    bio: 'Specializing in heritage restoration and bespoke material curation, Rhea oversees all interior joinery, bespoke lighting engineering, and art advisory commissions at Inovador.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  },
];

interface AboutContentProps {
  aboutData?: StudioAbout;
}

export function AboutContent({ aboutData }: AboutContentProps) {
  const heroHeadline =
    aboutData?.heroHeadline ||
    'Sculpting sanctuaries through raw materiality & contextual rigor.';
  const heroSubtitle =
    aboutData?.heroSubtitle ||
    'We are an interdisciplinary studio of architects, interior designers, and landscape planners dedicated to creating enduring spaces that celebrate the ritual of daily dwelling.';
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

  const pillars =
    aboutData?.pillars && aboutData.pillars.length > 0
      ? aboutData.pillars
      : DEFAULT_PILLARS;
  const leadership =
    aboutData?.leadership && aboutData.leadership.length > 0
      ? aboutData.leadership
      : DEFAULT_LEADERSHIP;

  const bannerImage =
    aboutData?.bannerImage ||
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85';

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Cinematic Hero Banner */}
      <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden border-b border-[var(--border-subtle)] bg-[#111111]">
        <Image
          src={bannerImage}
          alt={heroHeadline}
          fill
          priority
          className="object-cover opacity-50 filter grayscale contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />

        <Container className="relative z-10 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="max-w-4xl"
          >
            <span className="text-xs uppercase tracking-[0.28em] text-[var(--accent-terracotta)] font-sans font-semibold mb-4 block">
              About Inovador Design Studio · Founded 2018
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light leading-[1.08] tracking-tight text-white mb-6">
              {heroHeadline}
            </h1>
            <p className="text-lg md:text-2xl text-[#c7c2b8] font-light leading-relaxed font-sans max-w-3xl">
              {heroSubtitle}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Studio Manifesto / Vision Section */}
      <section className="section-spacing">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Narrative */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
              className="lg:col-span-6 space-y-6 text-[var(--text-secondary)] font-light leading-relaxed font-sans"
            >
              <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal leading-snug">
                {ethosHeadline}
              </h2>
              <p className="text-base sm:text-lg text-[var(--text-primary)] font-normal">
                {ethosDesc1}
              </p>
              <p className="text-base">
                {ethosDesc2}
              </p>
              <p className="text-base">
                From cliffside residences in Goa to historic apartment renovations along Mumbai’s Art Deco waterfront, our architecture establishes a quiet dialogue with time, sun, and shadow.
              </p>
            </motion.div>

            {/* Right: Architectural Detail Imagery Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                  alt="Inovador Studio Material Research"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
                    alt="Bespoke Joinery Details"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=600&auto=format&fit=crop"
                    alt="Laterite and Daylight Studies"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Four Core Architectural Pillars */}
      <section className="section-spacing bg-[var(--bg-secondary)] border-y border-[var(--border-light)]">
        <Container>
          <SectionHeading
            eyebrow={ethosEyebrow}
            title="The Four Studio Pillars"
            subtitle="The non-negotiable principles that govern every spatial intervention we undertake."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE_EDITORIAL }}
                className="p-8 bg-white border border-[var(--border-light)] relative group hover:border-[var(--accent-terracotta)] transition-colors duration-300"
              >
                <span className="font-serif text-3xl text-[var(--accent-terracotta)]/40 font-light block mb-4">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-terracotta)] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed font-sans">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Studio Leadership Section */}
      <section className="section-spacing">
        <Container>
          <SectionHeading
            eyebrow="Studio Direction"
            title="Leadership & Principals"
            subtitle="Led by architects with international pedigree and deep regional grounding."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {leadership.map((leader, idx) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: EASE_EDITORIAL }}
                className="flex flex-col sm:flex-row gap-6 items-start"
              >
                <div className="relative aspect-[3/4] w-full sm:w-48 flex-shrink-0 overflow-hidden bg-neutral-100">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 200px"
                    className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-normal text-[var(--text-primary)]">
                    {leader.name}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.14em] text-[var(--accent-terracotta)] font-medium block">
                    {leader.role}
                  </span>
                  <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed font-sans pt-2 border-t border-[var(--border-light)]">
                    {leader.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Commission Banner */}
      <section className="py-20 bg-[#141414] text-white text-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-medium">
              Start a Dialogue
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light">
              Ready to sculpt your next spatial sanctuary?
            </h2>
            <p className="text-sm text-neutral-400 font-light max-w-lg mx-auto">
              We accept a limited number of residential, interior, and hospitality commissions per calendar year.
            </p>
            <div className="pt-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent-terracotta)] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#8e4a1f] transition-colors"
              >
                <span>Initiate Project Brief</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
