import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { getPresence, getStudioAbout } from '@/lib/api';
import { InquirySection } from '@/components/contact/InquirySection';

export const metadata: Metadata = {
  title: 'Studio Presence & Locations | Inovador Design Studio',
  description: 'Our architectural studios and presence across Mumbai, Goa, Bengaluru, New Delhi, and Alibaug.',
  openGraph: {
    title: 'Studio Presence & Locations | Inovador Design Studio',
    description: 'Explore our geographic presence and regional architectural practices across India.',
  },
};

export default async function PresenceDirectoryPage() {
  const [locations, studioAbout] = await Promise.all([
    getPresence(),
    getStudioAbout(),
  ]);

  return (
    <div className="py-16 md:py-24 bg-[var(--bg-primary)]">
      <Container className="mb-16">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
            Geographic Footprint
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[var(--text-primary)] mb-6 tracking-tight">
            Studio Presence & Regional Ateliers
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-sans font-light leading-relaxed">
            Operating from our primary drawing rooms in Mumbai and Goa, we orchestrate residential commissions, private estates, and hospitality retreats across India’s most distinctive topographies.
          </p>
        </div>
      </Container>

      {/* Locations Grid */}
      <Container className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc) => (
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
  );
}
