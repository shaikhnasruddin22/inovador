import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getPageBySlug,
  getPages,
  getProjects,
  getServices,
  getPresence,
  getTestimonials,
  getFAQs,
  getProcessSteps,
  getAwards,
} from '@/lib/api';
import { PageSectionRenderer } from '@/components/page-builder/PageSectionRenderer';

const RESERVED_SLUGS = [
  'home',
  'projects',
  'about',
  'services',
  'presence',
  'contact',
  'api',
  'admin',
  'sitemap.xml',
  'robots.txt',
];

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getPages().catch(() => []);
  return pages
    .filter((p) => !RESERVED_SLUGS.includes(p.slug.toLowerCase()))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
    return {};
  }

  const page = await getPageBySlug(slug);
  if (!page) return {};

  const title = page.seoTitle || `${page.title} | Inovador Design Studio`;
  const description =
    page.seoDescription ||
    'Bespoke architectural design, interior transformation, and spatial environments by Inovador Design Studio.';

  return {
    title,
    description,
    robots: page.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      images: page.seoImage ? [{ url: page.seoImage }] : undefined,
    },
  };
}

export default async function DynamicCMSPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  // Reject reserved routes
  if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
    notFound();
  }

  const [
    page,
    projects,
    services,
    presence,
    testimonials,
    faqs,
    processSteps,
    awards,
  ] = await Promise.all([
    getPageBySlug(slug),
    getProjects().catch(() => []),
    getServices().catch(() => []),
    getPresence().catch(() => []),
    getTestimonials().catch(() => []),
    getFAQs().catch(() => []),
    getProcessSteps().catch(() => []),
    getAwards().catch(() => []),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <div className="w-full bg-[var(--bg-primary)]">
      <PageSectionRenderer
        sections={page.sections}
        projects={projects}
        services={services}
        presence={presence}
        testimonials={testimonials}
        faqs={faqs}
        processSteps={processSteps}
        awards={awards}
      />
    </div>
  );
}
