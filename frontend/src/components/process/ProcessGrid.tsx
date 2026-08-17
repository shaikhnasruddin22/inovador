'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProcessStep } from '@/types';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

interface ProcessGridProps {
  steps: ProcessStep[];
}

export function ProcessGrid({ steps }: ProcessGridProps) {
  return (
    <section id="process" className="section-spacing bg-[var(--bg-primary)] scroll-mt-20 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        >
          <SectionHeading
            eyebrow="Architectural Methodology"
            title="Our Four-Step Process"
            subtitle="From the preliminary solar study to the final artisan joinery handover, our structured workflow ensures architectural integrity and transparent progress."
          />
        </motion.div>

        {/* Animated Connecting Architectural Line (Desktop) */}
        <div className="relative mb-8 hidden lg:block">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: EASE_EDITORIAL }}
            style={{ transformOrigin: 'left' }}
            className="h-[1.5px] bg-[var(--border-subtle)] w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.7,
                delay: idx * 0.12,
                ease: EASE_EDITORIAL,
              }}
              whileHover={{ y: -4 }}
              className="relative flex flex-col justify-between p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)]/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                {/* Step Number */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--border-light)]">
                  <span className="font-serif text-3xl sm:text-4xl text-[var(--accent-terracotta)] font-light group-hover:scale-105 transition-transform duration-300 inline-block">
                    {step.number}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-mono">
                    Phase 0{idx + 1}
                  </span>
                </div>

                {/* Step Titles */}
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-terracotta)] transition-colors">
                  {step.title}
                </h3>
                <h4 className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] font-sans mb-4">
                  {step.subtitle}
                </h4>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border-light)] flex items-center justify-between text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-sans">
                <span>Rigor &amp; Craft</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-terracotta)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
