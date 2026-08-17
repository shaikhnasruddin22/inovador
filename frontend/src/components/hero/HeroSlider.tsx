'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Keyboard, A11y } from 'swiper/modules';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HeroSlide } from '@/types';
import { Container } from '@/components/layout/Container';
import { EASE_EDITORIAL, EASE_CINEMATIC } from '@/lib/utils/animations';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Private Coastal Residence',
    title: 'Architecture in Dialogue with Landscape & Sea',
    location: 'Anjuna, Goa',
    projectSlug: 'the-raw-stone-pavilion',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Heritage Interior Architecture',
    title: 'Art Deco Proportions & Tactile Travertine Marble',
    location: 'Marine Drive, Mumbai',
    projectSlug: 'apartment-702-marine-drive',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Monolithic Courtyard Estate',
    title: 'Monolithic Concrete & Shaded Spatial Flow',
    location: 'Awas, Alibaug',
    projectSlug: 'courtyard-house-of-light',
    sortOrder: 3,
    active: true,
  },
];

interface HeroSliderProps {
  slides?: HeroSlide[];
}

export function HeroSlider({ slides = [] }: HeroSliderProps) {
  const heroSlides = slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Subtle scroll-linked parallax for cinematic exit
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[92vh] min-h-[660px] max-h-[1000px] bg-[#121212] text-white overflow-hidden"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Keyboard, A11y]}
        effect="fade"
        speed={1200}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.hero-custom-pagination',
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
        keyboard={{ enabled: true }}
        loop={heroSlides.length > 1}
        onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            {/* Background Image Container with Cinematic Pan/Zoom */}
            <motion.div
              style={{ scale: imageScale }}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover object-center transition-transform duration-[8000ms] ease-out will-change-transform ${
                  activeSlideIndex === index ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Refined Architectural Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            {/* Slide Content Layer */}
            <Container className="relative h-full flex flex-col justify-end pb-24 sm:pb-28 lg:pb-32 z-10">
              <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="max-w-4xl"
              >
                {/* Eyebrow / Typology Badge */}
                <div className="overflow-hidden mb-4">
                  <motion.div
                    key={`eyebrow-${activeSlideIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
                    className="inline-flex items-center gap-3"
                  >
                    <span className="w-6 h-[1px] bg-[var(--accent-terracotta)]" />
                    <span className="text-xs uppercase tracking-[0.24em] font-sans font-medium text-[var(--accent-terracotta)]">
                      {slide.eyebrow}
                    </span>
                    <span className="text-xs text-[#A8A29A] font-sans font-light">·</span>
                    <span className="text-xs tracking-wider uppercase font-sans text-[#D4CEC5]">
                      {slide.location}
                    </span>
                  </motion.div>
                </div>

                {/* Primary Editorial Headline */}
                <div className="overflow-hidden mb-8">
                  <motion.h1
                    key={`headline-${activeSlideIndex}`}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: EASE_CINEMATIC }}
                    className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-[-0.02em] text-[#FAF8F5]"
                  >
                    {slide.title}
                  </motion.h1>
                </div>

                {/* Interactive Action Link with Micro-Interactions */}
                <div className="overflow-hidden">
                  <motion.div
                    key={`cta-${activeSlideIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: EASE_EDITORIAL }}
                  >
                    <Link
                      href={slide.projectSlug ? `/projects/${slide.projectSlug}` : '/#projects'}
                      className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] font-sans font-medium text-white/90 hover:text-[var(--accent-terracotta)] transition-colors py-2"
                    >
                      <span className="relative">
                        Explore Commission
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 group-hover:bg-[var(--accent-terracotta)] transition-colors duration-300" />
                      </span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </Container>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Bar: Slide Counter, Custom Bullets, and Scroll Indicator */}
      <Container className="absolute bottom-8 left-0 right-0 z-20 pointer-events-none flex items-center justify-between">
        {/* Slide Counter / Index */}
        <div className="flex items-center gap-3 text-xs font-sans tracking-widest text-[#A8A29A]">
          <span className="text-white font-medium">0{activeSlideIndex + 1}</span>
          <span className="w-8 h-[1px] bg-white/30" />
          <span>0{heroSlides.length}</span>
        </div>

        {/* Custom Pagination Bullets (Interactive) */}
        <div className="hero-custom-pagination pointer-events-auto flex items-center gap-2" />

        {/* Scroll Prompt */}
        <a
          href="#projects"
          className="pointer-events-auto hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#D4CEC5] hover:text-white transition-colors group"
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
          </motion.div>
        </a>
      </Container>
    </section>
  );
}
