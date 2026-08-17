'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQItem } from '@/types';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="section-spacing bg-[var(--bg-primary)] scroll-mt-20 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Eyebrow & Description */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="lg:col-span-5"
          >
            <SectionHeading
              eyebrow="Advisory &amp; Protocol"
              title="Frequently Addressed Inquiries"
              subtitle="Common questions regarding our architectural commissions, geographical scope, turnkey execution, and project programming."
              className="mb-8"
            />

            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-light)] hidden lg:block">
              <h4 className="font-serif text-lg text-[var(--text-primary)] mb-2 font-normal">
                Have a bespoke commission brief?
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 font-sans">
                Our studio partners are available to evaluate unique architectural challenges, site constraints, and masterplanning queries.
              </p>
              <a
                href="#contact"
                className="text-xs uppercase tracking-wider text-[var(--accent-terracotta)] font-medium hover:underline font-sans"
              >
                Schedule an exploratory dialogue &rarr;
              </a>
            </div>
          </motion.div>

          {/* Right Column: Accordion Items with Staggered Entrance */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item, idx) => {
              const isOpen = openId === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.07,
                    ease: EASE_EDITORIAL,
                  }}
                  className={`border transition-all duration-300 ${
                    isOpen
                      ? 'border-[var(--accent-terracotta)]/60 bg-[var(--bg-surface)] shadow-sm'
                      : 'border-[var(--border-light)] bg-[var(--bg-surface)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-terracotta)] group"
                  >
                    <span className={`font-serif text-lg sm:text-xl font-normal leading-snug transition-colors duration-200 ${
                      isOpen ? 'text-[var(--accent-terracotta)]' : 'text-[var(--text-primary)] group-hover:text-[var(--accent-terracotta)]'
                    }`}>
                      {item.question}
                    </span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? 'bg-[var(--accent-terracotta)] text-white rotate-45'
                          : 'bg-[var(--bg-secondary)] text-[var(--accent-terracotta)] group-hover:bg-[var(--accent-terracotta)] group-hover:text-white rotate-0'
                      }`}
                    >
                      <Plus className="w-4 h-4 transition-transform duration-300" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_EDITORIAL }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: 8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 8, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed border-t border-[var(--border-light)]/60 font-sans"
                        >
                          {item.answer}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
