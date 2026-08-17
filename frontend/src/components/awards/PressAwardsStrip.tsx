'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AwardOrPress } from '@/types';
import { Container } from '@/components/layout/Container';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

interface PressAwardsStripProps {
  awards: AwardOrPress[];
}

export function PressAwardsStrip({ awards }: PressAwardsStripProps) {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-[var(--bg-primary)] border-b border-[var(--border-light)] overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="md:w-1/4"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-semibold block mb-1">
              Recognition
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-normal">
              Press &amp; Honors
            </h3>
          </motion.div>

          <div className="md:w-3/4 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {awards.map((award, idx) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.08,
                  ease: EASE_EDITORIAL,
                }}
                whileHover={{ y: -2, scale: 1.02 }}
                className="p-4 border border-[var(--border-light)] bg-[var(--bg-surface)] hover:border-[var(--accent-terracotta)]/40 hover:shadow-sm opacity-80 hover:opacity-100 transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-widest text-[var(--accent-terracotta)] font-mono block mb-1">
                  {award.year}
                </span>
                <h4 className="font-serif text-sm text-[var(--text-primary)] font-medium line-clamp-1 mb-1 group-hover:text-[var(--accent-terracotta)] transition-colors">
                  {award.badgeText}
                </h4>
                <p className="text-xs text-[var(--text-muted)] font-sans line-clamp-1">
                  {award.publication}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
