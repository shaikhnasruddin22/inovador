'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PROJECT_CATEGORIES, PROJECT_CITIES } from '@/lib/constants';
import { EASE_SMOOTH } from '@/lib/utils/animations';

interface ProjectFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  totalCount?: number;
}

export function ProjectFilter({
  selectedCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-light)] mb-10">
      {/* Category Tabs with Animated Pill */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mr-2 hidden sm:inline-block">
          Typology:
        </span>
        {PROJECT_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="relative px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors duration-200 z-10 focus-visible:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                  className="absolute inset-0 bg-[var(--text-primary)] -z-10"
                />
              )}
              <span className={isActive ? 'text-[var(--bg-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}>
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* City Filter Dropdown / Pills with Animated Underline */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] hidden sm:inline-block">
          Location:
        </span>
        <div className="flex items-center flex-wrap gap-1.5">
          {PROJECT_CITIES.map((city) => {
            const isActive = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className="relative px-3 py-1 text-xs tracking-wider transition-colors duration-200 focus-visible:outline-none"
              >
                <span className={isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}>
                  {city}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeCityUnderline"
                    transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--accent-terracotta)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
