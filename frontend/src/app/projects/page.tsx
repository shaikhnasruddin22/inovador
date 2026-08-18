import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { FeaturedProjects } from '@/components/projects/FeaturedProjects';
import { getProjects, getProjectsPage } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const pageConfig = await getProjectsPage().catch(() => null);
  if (!pageConfig) return { title: 'Architectural Portfolio | Inovador Design Studio' };

  return {
    title: pageConfig.seoTitle || 'Architectural Portfolio | Inovador Design Studio',
    description: pageConfig.seoDescription,
    openGraph: {
      title: pageConfig.seoTitle,
      description: pageConfig.seoDescription,
      images: pageConfig.seoImage ? [{ url: pageConfig.seoImage }] : undefined,
    },
  };
}

export default async function ProjectsArchivePage() {
  const [projects, pageConfig] = await Promise.all([
    getProjects(),
    getProjectsPage(),
  ]);

  return (
    <div className="py-16 md:py-24 bg-[var(--bg-primary)]">
      <Container className="mb-12">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
            Portfolio Archive
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[var(--text-primary)] mb-6 tracking-tight">
            {pageConfig.heading || 'Selected Architectural Portfolio'}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-sans font-light leading-relaxed">
            {pageConfig.introduction}
          </p>
        </div>
      </Container>

      {/* Interactive Projects Grid with Categories & City Filters */}
      <FeaturedProjects initialProjects={projects} />
    </div>
  );
}
