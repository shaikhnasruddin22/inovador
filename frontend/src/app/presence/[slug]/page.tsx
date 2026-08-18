import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { getPresenceBySlug, getPresenceSlugs, getProjects, getStudioAbout } from '@/lib/api';
import { InquirySection } from '@/components/contact/InquirySection';
import { ProjectCard } from '@/components/projects/ProjectCard';

interface PresenceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPresenceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PresenceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getPresenceBySlug(slug);
  if (!location) return { title: 'Presence Not Found' };

  return {
    title: location.seoTitle || `${location.name} Architecture Studio | Inovador Design Studio`,
    description: location.seoDescription || location.shortDescription,
    openGraph: {
      title: location.seoTitle || `${location.name} Studio`,
      description: location.seoDescription || location.shortDescription,
      images: location.heroImage ? [{ url: location.heroImage }] : undefined,
    },
  };
}

export default async function PresenceDetailPage({ params }: PresenceDetailPageProps) {
  const { slug } = await params;
  const [location, allProjects, studioAbout] = await Promise.all([
    getPresenceBySlug(slug),
    getProjects(),
    getStudioAbout(),
  ]);

  if (!location) {
    notFound();
  }

  // Derive projects in this location
  const cityProjects = allProjects.filter(
    (p) => p.city.toLowerCase() === location.city.toLowerCase() || p.city.toLowerCase() === location.name.toLowerCase()
  );

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[450px] max-h-[650px] bg-[#121212] text-white overflow-hidden flex items-end">
        {location.heroImage && (
          <Image
            src={location.heroImage}
            alt={location.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        <Container className="relative z-10 pb-16">
          <Link
            href="/presence"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4CEC5] hover:text-[var(--accent-terracotta)] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            <span>All Studio Locations</span>
          </Link>

          <span className="text-xs uppercase tracking-[0.24em] font-sans font-medium text-[var(--accent-terracotta)] mb-3 block">
            Regional Presence
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#FAF8F5] tracking-tight">
            {location.name}
          </h1>
        </Container>
      </section>

      {/* Overview & Studio Narrative */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
                Regional Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] mb-6 leading-tight">
                {location.shortDescription}
              </h2>
              <div className="prose prose-lg text-[var(--text-secondary)] font-sans font-light leading-relaxed space-y-6">
                {location.description.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right Contact Card */}
            <div className="lg:col-span-5">
              <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-light)] shadow-sm">
                <h3 className="font-serif text-2xl font-light text-[var(--text-primary)] mb-6">
                  {location.name} Atelier
                </h3>

                <div className="space-y-5 text-sm text-[var(--text-secondary)]">
                  {location.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[var(--accent-terracotta)] flex-shrink-0 mt-1" />
                      <span>{location.address}</span>
                    </div>
                  )}

                  {location.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[var(--accent-terracotta)] flex-shrink-0" />
                      <span>{location.phone}</span>
                    </div>
                  )}

                  {location.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[var(--accent-terracotta)] flex-shrink-0" />
                      <a
                        href={`mailto:${location.email}`}
                        className="hover:text-[var(--accent-terracotta)] transition-colors"
                      >
                        {location.email}
                      </a>
                    </div>
                  )}

                  {location.mapUrl && (
                    <div className="pt-4 border-t border-[var(--border-light)]">
                      <a
                        href={location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[var(--accent-terracotta)] hover:text-[var(--accent-terracotta-hover)] transition-colors"
                      >
                        <span>View on Google Maps</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Derived Projects for this Location */}
      {cityProjects.length > 0 && (
        <section className="py-20 bg-[var(--bg-secondary)] border-t border-[var(--border-light)]">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[var(--accent-terracotta)] mb-2 block">
                  Regional Works
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)]">
                  Commissions in {location.name}
                </h2>
              </div>
              <Link
                href="/projects"
                className="mt-4 sm:mt-0 text-xs uppercase tracking-[0.16em] text-[var(--accent-terracotta)] hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Portfolio</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cityProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Commission Inquiry Section */}
      <InquirySection aboutData={studioAbout} />
    </div>
  );
}
