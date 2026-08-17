'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
      className="group relative flex flex-col bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--border-subtle)] transition-colors duration-300 overflow-hidden"
    >
      {/* Image Container with strict aspect ratio */}
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="view"
        className="relative w-full aspect-[16/10] overflow-hidden bg-[#E8E4DC] block focus-visible:outline-none"
      >
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transform group-hover:scale-[1.05] transition-transform duration-700 ease-out"
        />

        {/* Hover overlay with upward text & arrow reveal */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div className="flex items-center justify-between w-full text-white transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <span className="text-xs uppercase tracking-[0.14em] font-medium font-sans">
              Explore Portfolio Detail
            </span>
            <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </span>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] uppercase tracking-[0.14em] font-sans mb-3">
            <span className="text-[var(--accent-terracotta)] font-medium">{project.category}</span>
            <span>{project.city} · {project.year}</span>
          </div>

          {/* Project Title */}
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[var(--text-primary)] group-hover:text-[var(--accent-terracotta)] transition-colors leading-snug mb-3">
            <Link href={`/projects/${project.slug}`} data-cursor="view">
              {project.title}
            </Link>
          </h3>

          {/* Short Narrative */}
          <p className="text-sm text-[var(--text-secondary)] font-light line-clamp-2 leading-relaxed mb-4 font-sans">
            {project.shortDescription}
          </p>
        </div>

        {/* Specs / Area tag if available */}
        {project.stats?.area && (
          <div className="pt-4 border-t border-[var(--border-light)] flex items-center justify-between text-xs text-[var(--text-muted)] font-sans">
            <span>Built Area</span>
            <span className="font-medium text-[var(--text-primary)]">{project.stats.area}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
