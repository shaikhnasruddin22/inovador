'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Layers, Trees, RefreshCw, Compass, Sparkles, Check, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Service } from '@/types';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  Layers,
  Trees,
  RefreshCw,
  Compass,
  Sparkles,
};

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section id="services" className="section-spacing bg-[var(--bg-secondary)] scroll-mt-20 border-t border-[var(--border-light)] overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        >
          <SectionHeading
            eyebrow="Capabilities &amp; Disciplines"
            title="Studio Practice &amp; Services"
            subtitle="We offer end-to-end architectural, interior, landscape, and turnkey services tailored to discerning residential and commercial patrons."
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const IconComponent = ICON_MAP[service.iconName] || Building2;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.08,
                  ease: EASE_EDITORIAL,
                }}
                whileHover={{ y: -4 }}
                className="flex flex-col justify-between p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)]/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  {/* Icon Header with Subtle Hover Scale */}
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--accent-terracotta)] mb-6 group-hover:bg-[var(--accent-terracotta)] group-hover:text-white transition-colors duration-300">
                    <IconComponent className="w-6 h-6 transform group-hover:scale-105 transition-transform duration-300" strokeWidth={1.5} />
                  </div>

                  {/* Service Title with subtle translate */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-serif text-2xl font-normal text-[var(--text-primary)] transform group-hover:translate-x-1 transition-transform duration-300">
                      {service.name}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-[var(--accent-terracotta)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>

                  {/* Short Narrative */}
                  <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-6 font-sans">
                    {service.shortDescription}
                  </p>

                  {/* Deliverables List */}
                  <div className="pt-6 border-t border-[var(--border-light)]">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] font-medium block mb-3 font-sans">
                      Scope Deliverables
                    </span>
                    <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-sans">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[var(--accent-terracotta)] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--border-light)] flex items-center justify-between text-xs text-[var(--text-muted)] font-sans">
                  <span className="uppercase tracking-widest text-[10px]">Turnkey &amp; Consultancy</span>
                  <span className="text-[var(--accent-terracotta)] font-mono">0{service.sortOrder}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
