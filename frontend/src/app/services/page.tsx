import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ProcessGrid } from '@/components/process/ProcessGrid';
import { InquirySection } from '@/components/contact/InquirySection';
import { getServices, getServicesPage, getProcessSteps, getStudioAbout } from '@/lib/api';

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

  return (
    <div className="py-16 md:py-24 bg-[var(--bg-primary)]">
      <Container className="mb-12">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
            Studio Capabilities
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[var(--text-primary)] mb-6 tracking-tight">
            {pageConfig.heading || 'Architectural Disciplines & Spatial Practice'}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-sans font-light leading-relaxed">
            {pageConfig.introduction}
          </p>
        </div>
      </Container>

      {/* Services Grid */}
      <ServicesGrid services={services} />

      {/* Process Grid */}
      <ProcessGrid steps={processSteps} />

      {/* Commission Inquiry Section */}
      <InquirySection aboutData={studioAbout} />
    </div>
  );
}
