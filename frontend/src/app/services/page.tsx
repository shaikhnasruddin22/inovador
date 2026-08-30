import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ProcessGrid } from '@/components/process/ProcessGrid';
import { InquirySection } from '@/components/contact/InquirySection';
import { getServices, getServicesPage, getProcessSteps, getStudioAbout } from '@/lib/api';

import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const pageConfig = await getServicesPage().catch(() => null);
  if (!pageConfig) return { title: 'Disciplines & Services | Inovador Design Studio' };

  return {
    title: pageConfig.seoTitle || 'Disciplines & Services | Inovador Design Studio',
    description: pageConfig.seoDescription,
    openGraph: {
      title: pageConfig.seoTitle,
      description: pageConfig.seoDescription,
      images: pageConfig.seoImage ? [{ url: pageConfig.seoImage }] : undefined,
    },
  };
}

export default async function ServicesOverviewPage() {
  const [services, pageConfig, processSteps, studioAbout] = await Promise.all([
    getServices(),
    getServicesPage(),
    getProcessSteps(),
    getStudioAbout(),
  ]);

  const bannerImage =
    pageConfig.bannerImage ||
    pageConfig.seoImage ||
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85';

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Cinematic Hero Banner */}
      <div className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden border-b border-[var(--border-subtle)] bg-[#111111]">
        <Image
          src={bannerImage}
          alt={pageConfig.heading || 'Architectural Disciplines'}
          fill
          priority
          className="object-cover opacity-50 filter grayscale contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />

        <Container className="relative z-10 py-16 md:py-20">
          <div className="max-w-4xl">
            <span className="text-xs uppercase tracking-[0.28em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
              Studio Capabilities · Enduring Spatial Design
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white mb-6 tracking-tight leading-[1.08]">
              {pageConfig.heading || 'Architectural Disciplines & Spatial Practice'}
            </h1>
            <p className="text-lg md:text-2xl text-[#c7c2b8] font-sans font-light leading-relaxed max-w-2xl">
              {pageConfig.introduction}
            </p>
          </div>
        </Container>
      </div>

      {/* Services Grid */}
      <div className="py-16 md:py-24 space-y-24">
        <ServicesGrid services={services} />
        <ProcessGrid steps={processSteps} />
        <InquirySection aboutData={studioAbout} />
      </div>
    </div>
  );
}
