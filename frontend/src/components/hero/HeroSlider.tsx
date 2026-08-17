'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Keyboard, A11y } from 'swiper/modules';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { EASE_EDITORIAL, EASE_CINEMATIC } from '@/lib/utils/animations';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string;
  headline: string;
  location: string;
  projectSlug: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Private Coastal Residence',
    headline: 'Architecture in Dialogue with Landscape & Sea',
    location: 'Anjuna, Goa',
    projectSlug: 'the-raw-stone-pavilion',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Heritage Interior Architecture',
    headline: 'Art Deco Proportions & Tactile Travertine Marble',
    location: 'Marine Drive, Mumbai',
    projectSlug: 'apartment-702-marine-drive',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Monolithic Courtyard Estate',
    headline: 'Monolithic Concrete & Shaded Spatial Flow',
    location: 'Awas, Alibaug',
    projectSlug: 'courtyard-house-of-light',
  },
];

export function HeroSlider() {
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
          delay: 7000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        keyboard={{ enabled: true }}
        pagination={{
          clickable: true,
          el: '.hero-pagination',
        }}
        onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = activeSlideIndex === index;
          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Background Image with Cinematic Settle & Scroll-Linked Parallax */}
              <motion.div
                style={{ scale: imageScale }}
                className="absolute inset-0 z-0 overflow-hidden"
              >
                <motion.div
                  initial={{ scale: 1.06, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1 : 1.04,
                    opacity: 1,
                  }}
                  transition={{ duration: 1.6, ease: EASE_CINEMATIC }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={slide.image}
                    alt={slide.headline}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                  {/* Subtle tonal gradient for editorial typography contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
                </motion.div>
              </motion.div>

              {/* Slide Content with Upward Stagger */}
              <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative z-10 w-full h-full flex flex-col justify-end pb-24 md:pb-28"
              >
                <Container>
                  <div className="max-w-4xl">
                    {/* Eyebrow & Location */}
                    <motion.div
                      key={`eyebrow-${slide.id}-${isActive}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL }}
                      className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-sans font-medium mb-4"
                    >
                      <span>{slide.eyebrow}</span>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="text-white/80">{slide.location}</span>
                    </motion.div>

                    {/* Headline with Masked Reveal */}
                    <div className="overflow-hidden mb-6">
                      <motion.h1
                        key={`title-${slide.id}-${isActive}`}
                        initial={{ y: 32, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: EASE_EDITORIAL }}
                        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] tracking-tight text-white"
                      >
                        {slide.headline}
                      </motion.h1>
                    </div>

                    {/* Editorial Brand Subtitle & Actions */}
                    <motion.div
                      key={`footer-${slide.id}-${isActive}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.35, ease: EASE_EDITORIAL }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-white/20"
                    >
                      <p className="text-sm sm:text-base text-white/80 max-w-lg font-light leading-relaxed font-sans">
                        Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor.
                      </p>

                      <div className="flex items-center gap-4">
                        <Link
                          href={`/projects/${slide.projectSlug}`}
                          data-cursor="view"
                          className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.14em] font-medium bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-sm border border-white/30 hover:border-white transition-all duration-300 group active:scale-95"
                        >
                          <span>View Project</span>
                          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>

                        <Link
                          href="/#projects"
                          className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.14em] font-medium bg-[var(--accent-terracotta)] hover:bg-[var(--accent-terracotta-hover)] text-white transition-all duration-300 active:scale-95"
                        >
                          All Works
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </Container>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Swiper Pagination & Delayed Scroll Cue */}
      <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
        <Container className="flex items-center justify-between pointer-events-auto">
          <div className="hero-pagination flex gap-2" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: EASE_EDITORIAL }}
          >
            <Link
              href="/#projects"
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
            >
              <span>Scroll to Explore</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </Link>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
