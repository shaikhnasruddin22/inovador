'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectFilter } from './ProjectFilter';
import { ProjectCard } from './ProjectCard';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

interface FeaturedProjectsProps {
  initialProjects: Project[];
}

export function FeaturedProjects({ initialProjects }: FeaturedProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchCategory =
        selectedCategory === 'All' || project.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchCity =
        selectedCity === 'All' || project.city.toLowerCase() === selectedCity.toLowerCase();
      return matchCategory && matchCity;
    });
  }, [initialProjects, selectedCategory, selectedCity]);

  return (
    <section id="projects" className="section-spacing bg-[var(--bg-primary)] scroll-mt-20">
      <Container>
        {/* Section Header with Fade Up */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <SectionHeading
            eyebrow="Selected Works &amp; Monolithic Living"
            title="Featured Projects"
            subtitle="Explore our portfolio of private residential estates, serene interior sanctuaries, and contextual landscapes."
            className="mb-0"
          />

          <div className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] font-mono pb-4">
            Showing {filteredProjects.length} of {initialProjects.length} Works
          </div>
        </motion.div>

        {/* Filter Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL }}
        >
          <ProjectFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
          />
        </motion.div>

        {/* Animated Project Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.06, 0.3),
                    ease: EASE_EDITORIAL,
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Filter State */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-20 text-center border border-dashed border-[var(--border-subtle)] p-8"
          >
            <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-2 font-normal">
              No projects found
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto font-sans">
              We do not currently have any published works matching the selected &ldquo;{selectedCategory}&rdquo; typology in {selectedCity}.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCity('All');
              }}
              className="px-5 py-2.5 bg-[var(--text-primary)] text-white text-xs uppercase tracking-[0.12em] font-medium hover:bg-[var(--accent-terracotta)] transition-colors active:scale-95"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
