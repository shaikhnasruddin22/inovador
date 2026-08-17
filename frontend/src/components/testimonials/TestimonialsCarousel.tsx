'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Keyboard, A11y } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '@/types';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="section-spacing bg-[var(--bg-secondary)] border-t border-[var(--border-light)] overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <SectionHeading
            eyebrow="Patron Perspectives"
            title="Words from Our Clients"
            subtitle="Reflections on spatial transformation, material honesty, and the ritual of dwelling."
            className="mb-0"
          />

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              id="testimonial-prev"
              className="w-12 h-12 flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--text-primary)] hover:text-white transition-all duration-200 active:scale-95 focus-visible:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="testimonial-next"
              className="w-12 h-12 flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--text-primary)] hover:text-white transition-all duration-200 active:scale-95 focus-visible:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Swiper Slider with Sequential Card Reveals */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_EDITORIAL }}
          className="relative"
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation, Keyboard, A11y]}
            speed={900}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={testimonials.length > 1}
            keyboard={{ enabled: true }}
            navigation={{
              prevEl: '#testimonial-prev',
              nextEl: '#testimonial-next',
            }}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
            }}
            className="w-full"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-[var(--bg-surface)] p-8 sm:p-12 md:p-16 border border-[var(--border-light)] shadow-sm">
                  {/* Subtle quote icon */}
                  <Quote className="w-10 h-10 text-[var(--accent-terracotta)]/40 mb-6" />

                  {/* Serif Italic Quote */}
                  <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl font-light text-[var(--text-primary)] leading-relaxed mb-8">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* Client Identification */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[var(--border-light)] font-sans">
                    <div>
                      <cite className="not-italic font-medium text-base text-[var(--text-primary)] block">
                        {t.clientName}
                      </cite>
                      <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mt-0.5 block">
                        {t.roleOrLocation}
                      </span>
                    </div>

                    {t.projectReference && (
                      <span className="inline-block px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider font-mono">
                        Ref: {t.projectReference}
                      </span>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="testimonial-pagination flex justify-center gap-2 mt-8" />
        </motion.div>
      </Container>
    </section>
  );
}
