'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import {
  PageSection,
  Project,
  Service,
  PresenceLocation,
  Testimonial,
  FAQItem,
  ProcessStep,
  AwardOrPress,
} from '@/types';
import { Container } from '@/components/layout/Container';
import { EASE_EDITORIAL } from '@/lib/utils/animations';
import { FeaturedProjects } from '@/components/projects/FeaturedProjects';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ProcessGrid } from '@/components/process/ProcessGrid';
import { TestimonialsCarousel } from '@/components/testimonials/TestimonialsCarousel';
import { BeforeAfterSlider } from '@/components/before-after/BeforeAfterSlider';
import { PressAwardsStrip } from '@/components/awards/PressAwardsStrip';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { InquirySection } from '@/components/contact/InquirySection';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface PageSectionRendererProps {
  sections: PageSection[];
  projects?: Project[];
  services?: Service[];
  presence?: PresenceLocation[];
  testimonials?: Testimonial[];
  faqs?: FAQItem[];
  processSteps?: ProcessStep[];
  awards?: AwardOrPress[];
}

export function PageSectionRenderer({
  sections,
  projects = [],
  services = [],
  presence = [],
  testimonials = [],
  faqs = [],
  processSteps = [],
  awards = [],
}: PageSectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {sections.map((section, index) => {
        const key = `${section.__component}-${section.id || index}`;

        switch (section.__component) {
          case 'sections.hero':
            return (
              <section
                key={key}
                className={`relative w-full py-32 md:py-44 bg-[#121212] text-white overflow-hidden ${
                  section.alignment === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {section.image && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      priority
                      className="object-cover object-center"
                    />
                    {section.overlay && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                    )}
                  </div>
                )}
                <Container className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
                    className="max-w-4xl mx-auto"
                  >
                    {section.eyebrow && (
                      <span className="text-xs uppercase tracking-[0.24em] font-sans font-medium text-[var(--accent-terracotta)] mb-4 block">
                        {section.eyebrow}
                      </span>
                    )}
                    <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light leading-[1.1] tracking-[-0.02em] text-[#FAF8F5] mb-6">
                      {section.title}
                    </h1>
                    {section.description && (
                      <p className="text-lg md:text-xl text-[#D4CEC5] font-light leading-relaxed mb-8 max-w-2xl">
                        {section.description}
                      </p>
                    )}
                    {section.ctaText && (
                      <Link
                        href={section.ctaUrl || '/contact'}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent-terracotta)] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[var(--accent-terracotta-hover)] transition-all duration-300 group"
                      >
                        <span>{section.ctaText}</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    )}
                  </motion.div>
                </Container>
              </section>
            );

          case 'sections.rich-text':
            return (
              <section key={key} className="py-20 md:py-28 bg-[var(--bg-primary)]">
                <Container>
                  <div
                    className={`mx-auto ${
                      section.width === 'narrow'
                        ? 'max-w-2xl'
                        : section.width === 'wide'
                        ? 'max-w-5xl'
                        : 'max-w-3xl'
                    } ${section.alignment === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {section.eyebrow && (
                      <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[var(--accent-terracotta)] mb-3 block">
                        {section.eyebrow}
                      </span>
                    )}
                    {section.heading && (
                      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--text-primary)] mb-8 tracking-tight">
                        {section.heading}
                      </h2>
                    )}
                    <div className="prose prose-lg text-[var(--text-secondary)] font-sans font-light leading-relaxed space-y-6">
                      {(section.content || '').split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </Container>
              </section>
            );

          case 'sections.image-text':
            return (
              <section key={key} className="py-20 md:py-28 bg-[var(--bg-primary)]">
                <Container>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div
                      className={`lg:col-span-6 ${
                        section.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      {section.image && (
                        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)] shadow-sm">
                          <Image
                            src={section.image}
                            alt={section.heading}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className={`lg:col-span-6 ${
                        section.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      {section.eyebrow && (
                        <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[var(--accent-terracotta)] mb-3 block">
                          {section.eyebrow}
                        </span>
                      )}
                      <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] mb-6 leading-tight">
                        {section.heading}
                      </h2>
                      {section.content && (
                        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-sans font-light leading-relaxed mb-8">
                          {section.content}
                        </p>
                      )}
                      {section.ctaText && (
                        <Link
                          href={section.ctaUrl || '/contact'}
                          className="inline-flex items-center gap-3 px-7 py-3.5 bg-[var(--accent-terracotta)] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[var(--accent-terracotta-hover)] transition-all duration-300 group"
                        >
                          <span>{section.ctaText}</span>
                          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                </Container>
              </section>
            );

          case 'sections.full-width-image':
            return (
              <section key={key} className="w-full bg-[#121212] overflow-hidden">
                <div
                  className={`relative w-full ${
                    section.aspectRatio === '16:9'
                      ? 'aspect-[16/9]'
                      : section.aspectRatio === '4:3'
                      ? 'aspect-[4/3]'
                      : 'aspect-[21/9]'
                  } min-h-[380px] max-h-[700px]`}
                >
                  <Image
                    src={section.image}
                    alt={section.altText || section.caption || 'Architectural Showcase'}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  {section.caption && (
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 text-xs text-white/90 font-sans tracking-wide">
                      {section.caption}
                    </div>
                  )}
                </div>
              </section>
            );

          case 'sections.project-grid':
            let filteredProjects = projects;
            if (section.displayMode === 'featured') {
              filteredProjects = projects.filter((p) => p.featured);
            } else if (section.displayMode === 'category' && section.selectedCategory) {
              filteredProjects = projects.filter((p) => p.category === section.selectedCategory);
            } else if (section.displayMode === 'city' && section.selectedCity) {
              filteredProjects = projects.filter(
                (p) => p.city.toLowerCase() === section.selectedCity?.toLowerCase()
              );
            }
            return (
              <div key={key}>
                <FeaturedProjects initialProjects={filteredProjects.length > 0 ? filteredProjects : projects} />
              </div>
            );

          case 'sections.services-grid':
            return (
              <div key={key}>
                <ServicesGrid services={services} />
              </div>
            );

          case 'sections.presence-grid':
            return (
              <section key={key} className="py-20 md:py-28 bg-[var(--bg-secondary)]">
                <Container>
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[var(--accent-terracotta)] mb-3 block">
                      Geographic Studios
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--text-primary)]">
                      {section.heading || 'Studio Presence'}
                    </h2>
                    {section.subtitle && (
                      <p className="mt-4 text-base text-[var(--text-secondary)] font-sans font-light">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {presence.map((loc) => (
                      <Link
                        key={loc.id}
                        href={`/presence/${loc.slug}`}
                        className="group flex flex-col bg-[var(--bg-primary)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)] transition-all duration-300 overflow-hidden"
                      >
                        {loc.heroImage && (
                          <div className="relative aspect-[16/10] overflow-hidden bg-[#121212]">
                            <Image
                              src={loc.heroImage}
                              alt={loc.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-serif text-2xl font-light text-[var(--text-primary)] group-hover:text-[var(--accent-terracotta)] transition-colors">
                              {loc.name}
                            </h3>
                            <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-terracotta)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] font-light line-clamp-3 leading-relaxed mb-4 flex-grow">
                            {loc.shortDescription}
                          </p>
                          <div className="pt-4 border-t border-[var(--border-light)] flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <MapPin className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
                            <span className="truncate">{loc.city}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Container>
              </section>
            );

          case 'sections.statistics':
            const statsArray = Array.isArray(section.stats) ? section.stats : [];
            return (
              <section key={key} className="py-20 bg-[var(--bg-dark)] text-white">
                <Container>
                  {section.heading && (
                    <h2 className="font-serif text-3xl sm:text-4xl text-center font-light mb-16 text-[#FAF8F5]">
                      {section.heading}
                    </h2>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                    {statsArray.map((st, sIdx) => {
                      const numericVal = parseInt(st.value, 10) || 0;
                      const suffix = st.value.replace(/^[0-9]+/, '');
                      return (
                        <div key={sIdx} className="flex flex-col items-center">
                          <div className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[var(--accent-terracotta)] mb-2">
                            <AnimatedCounter value={numericVal} suffix={suffix} />
                          </div>
                          <div className="text-xs uppercase tracking-[0.18em] font-sans text-[#D4CEC5] mb-1">
                            {st.label}
                          </div>
                          {st.description && (
                            <div className="text-xs text-[#8C877E] font-light max-w-[180px]">
                              {st.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Container>
              </section>
            );

          case 'sections.process':
            return (
              <div key={key}>
                <ProcessGrid steps={processSteps} />
              </div>
            );

          case 'sections.testimonials':
            return (
              <div key={key}>
                <TestimonialsCarousel testimonials={testimonials} />
              </div>
            );

          case 'sections.before-after':
            if (!section.beforeImage || !section.afterImage) return null;
            return (
              <div key={key}>
                <BeforeAfterSlider
                  beforeImage={section.beforeImage}
                  afterImage={section.afterImage}
                  title={section.heading}
                  description={section.description}
                />
              </div>
            );

          case 'sections.awards':
            return (
              <div key={key}>
                <PressAwardsStrip awards={awards} />
              </div>
            );

          case 'sections.faq':
            return (
              <div key={key}>
                <FAQAccordion items={faqs} />
              </div>
            );

          case 'sections.cta':
            const isDark = section.style === 'dark';
            const isTerracotta = section.style === 'terracotta';
            return (
              <section
                key={key}
                className={`py-20 md:py-28 relative overflow-hidden ${
                  isTerracotta
                    ? 'bg-[var(--accent-terracotta)] text-white'
                    : isDark
                    ? 'bg-[var(--bg-dark)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                }`}
              >
                <Container className="relative z-10 text-center max-w-3xl mx-auto">
                  {section.eyebrow && (
                    <span
                      className={`text-xs uppercase tracking-[0.2em] font-sans font-semibold mb-3 block ${
                        isTerracotta || isDark ? 'text-[#FAF8F5]/80' : 'text-[var(--accent-terracotta)]'
                      }`}
                    >
                      {section.eyebrow}
                    </span>
                  )}
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light mb-6 tracking-tight">
                    {section.heading}
                  </h2>
                  {section.description && (
                    <p
                      className={`text-base sm:text-lg font-light leading-relaxed mb-8 ${
                        isTerracotta || isDark ? 'text-[#D4CEC5]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {section.description}
                    </p>
                  )}
                  <Link
                    href={section.buttonUrl || '/contact'}
                    className={`inline-flex items-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 group ${
                      isTerracotta
                        ? 'bg-white text-[var(--accent-terracotta)] hover:bg-[#FAF8F5]'
                        : isDark
                        ? 'bg-[var(--accent-terracotta)] text-white hover:bg-[var(--accent-terracotta-hover)]'
                        : 'bg-[var(--bg-dark)] text-white hover:bg-black'
                    }`}
                  >
                    <span>{section.buttonText || 'Initiate Studio Brief'}</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </Container>
              </section>
            );

          case 'sections.inquiry-form':
            return (
              <div key={key}>
                <InquirySection />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
