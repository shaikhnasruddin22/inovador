import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PresenceLocation } from '@/types';
import { getPresence, getStudioAbout, getPresencePage } from '@/lib/api';
import { InquirySection } from '@/components/contact/InquirySection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const pageConfig = await getPresencePage().catch(() => null);
  if (!pageConfig) return { title: 'Studio Presence & Locations | Inovador Design Studio' };

  return {
    title: pageConfig.seoTitle || 'Studio Presence & Locations | Inovador Design Studio',
    description: pageConfig.seoDescription,
    openGraph: {
      title: pageConfig.seoTitle,
      description: pageConfig.seoDescription,
      images: pageConfig.seoImage ? [{ url: pageConfig.seoImage }] : undefined,
    },
  };
}

export default async function PresenceDirectoryPage() {
  const [locations, studioAbout, pageConfig] = await Promise.all([
    getPresence(),
    getStudioAbout(),
    getPresencePage(),
  ]);

  const bannerImage =
    pageConfig.bannerImage ||
    pageConfig.seoImage ||
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=85';

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Cinematic Hero Banner */}
      <div className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden border-b border-[var(--border-subtle)] bg-[#111111]">
        <Image
          src={bannerImage}
          alt={pageConfig.heading || 'Studio Presence'}
          fill
          priority
          className="object-cover opacity-50 filter grayscale contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />

        <Container className="relative z-10 py-16 md:py-20">
          <div className="max-w-4xl">
            <span className="text-xs uppercase tracking-[0.28em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
              Geographic Footprint · Prime Terrains
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white mb-6 tracking-tight leading-[1.08]">
              {pageConfig.heading || 'Studio Presence & Regional Ateliers'}
            </h1>
            <p className="text-lg md:text-2xl text-[#c7c2b8] font-sans font-light leading-relaxed max-w-2xl">
              {pageConfig.introduction}
            </p>
          </div>
        </Container>
      </div>

      {/* Locations Grid */}
      <div className="py-16 md:py-24">

      {/* Locations Grid */}
      <Container className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc: PresenceLocation) => (
            <Link
              key={loc.id}
              href={`/presence/${loc.slug}`}
              className="group flex flex-col bg-[var(--bg-secondary)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
            >
              {loc.heroImage && (
                <div className="relative aspect-[16/10] overflow-hidden bg-[#121212]">
                  <Image
                    src={loc.heroImage}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              )}

              <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-2xl font-light text-[var(--text-primary)] group-hover:text-[var(--accent-terracotta)] transition-colors">
                    {loc.name}
                  </h2>
                  <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-terracotta)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-sm text-[var(--text-secondary)] font-light line-clamp-3 leading-relaxed mb-6 flex-grow">
                  {loc.shortDescription}
                </p>

                <div className="pt-4 border-t border-[var(--border-light)] flex flex-col gap-2 text-xs text-[var(--text-muted)]">
                  {loc.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent-terracotta)] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{loc.address}</span>
                    </div>
                  )}
                  {loc.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[var(--accent-terracotta)] flex-shrink-0" />
                      <span>{loc.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* Inquiry Section */}
      <InquirySection aboutData={studioAbout} />
      </div>
    </div>
  );
}
