import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { FeaturedProjects } from '@/components/projects/FeaturedProjects';
import { getProjects, getProjectsPage } from '@/lib/api';

import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const bannerImage =
    pageConfig.bannerImage ||
    pageConfig.seoImage ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85';

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Cinematic Hero Banner */}
      <div className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden border-b border-[var(--border-subtle)] bg-[#111111]">
        <Image
          src={bannerImage}
          alt={pageConfig.heading || 'Architectural Portfolio'}
          fill
          priority
          className="object-cover opacity-50 filter grayscale contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />

        <Container className="relative z-10 py-16 md:py-20">
          <div className="max-w-4xl">
            <span className="text-xs uppercase tracking-[0.28em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
              Selected Works · 2018 — Present
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white mb-6 tracking-tight leading-[1.08]">
              {pageConfig.heading || 'Selected Architectural Portfolio'}
            </h1>
            <p className="text-lg md:text-2xl text-[#c7c2b8] font-sans font-light leading-relaxed max-w-2xl">
              {pageConfig.introduction ||
                'A curated archive of monolithic residences, heritage restorations, and bespoke spatial environments across India’s prime terrains.'}
            </p>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/10 text-white/90">
              <div>
                <div className="text-2xl md:text-3xl font-serif font-light text-white">40+</div>
                <div className="text-xs uppercase tracking-[0.14em] text-[#8c877e] mt-1 font-sans">
                  Built Commissions
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-light text-white">5 Hubs</div>
                <div className="text-xs uppercase tracking-[0.14em] text-[#8c877e] mt-1 font-sans">
                  Regional Ateliers
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl md:text-3xl font-serif font-light text-white">100%</div>
                <div className="text-xs uppercase tracking-[0.14em] text-[#8c877e] mt-1 font-sans">
                  Material Honesty
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Interactive Projects Grid with Categories & City Filters */}
      <FeaturedProjects initialProjects={projects} />
    </div>
  );
}
