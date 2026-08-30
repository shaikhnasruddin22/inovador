import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BeforeAfterSlider } from '@/components/before-after/BeforeAfterSlider';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { getProjects, getProjectBySlug, getAdjacentProjects } from '@/lib/api';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Inovador Design Studio',
    };
  }

  return {
    title: `${project.title} | ${project.city} ${project.category} Architecture`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Inovador Design Studio`,
      description: project.shortDescription,
      images: [
        {
          url: project.coverImage,
          width: 1600,
          height: 1000,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = await getAdjacentProjects(slug);
  const narrativeParagraphs = project.fullDescription.split('\n\n').filter(Boolean);

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Top Breadcrumbs & Back Bar */}
      <section className="py-6 bg-[var(--bg-secondary)] border-b border-[var(--border-light)]">
        <Container>
          <div className="flex items-center justify-between">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:text-[var(--accent-terracotta)] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Selected Works</span>
            </Link>

            <span className="text-xs uppercase tracking-[0.16em] text-[var(--accent-terracotta)] font-mono">
              {project.category} · {project.city}
            </span>
          </div>
        </Container>
      </section>

      {/* Hero Image Section */}
      <section className="relative w-full aspect-[21/9] min-h-[400px] max-h-[680px] bg-[#121212] overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 py-10 sm:py-16 text-white">
          <Container>
            <div className="max-w-4xl">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-sans font-medium mb-3 block">
                {project.category} Practice · {project.city}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
                {project.title}
              </h1>
            </div>
          </Container>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-spacing">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Architectural Specifications */}
            <div className="lg:col-span-4">
              <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] sticky top-28 shadow-sm">
                <h3 className="font-serif text-xl text-[var(--text-primary)] font-normal pb-4 mb-6 border-b border-[var(--border-light)]">
                  Project Specifications
                </h3>

                <dl className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between py-2 border-b border-[var(--border-light)]/60">
                    <dt className="text-[var(--text-muted)] uppercase tracking-wider">Typology</dt>
                    <dd className="font-medium text-[var(--text-primary)]">{project.category}</dd>
                  </div>

                  <div className="flex justify-between py-2 border-b border-[var(--border-light)]/60">
                    <dt className="text-[var(--text-muted)] uppercase tracking-wider">Location</dt>
                    <dd className="font-medium text-[var(--text-primary)]">
                      {project.stats?.location || project.city}
                    </dd>
                  </div>

                  <div className="flex justify-between py-2 border-b border-[var(--border-light)]/60">
                    <dt className="text-[var(--text-muted)] uppercase tracking-wider">Year Completed</dt>
                    <dd className="font-medium text-[var(--text-primary)]">{project.year}</dd>
                  </div>

                  {project.stats?.area && (
                    <div className="flex justify-between py-2 border-b border-[var(--border-light)]/60">
                      <dt className="text-[var(--text-muted)] uppercase tracking-wider">Built Area</dt>
                      <dd className="font-medium text-[var(--text-primary)]">{project.stats.area}</dd>
                    </div>
                  )}

                  {project.stats?.scope && (
                    <div className="flex justify-between py-2 border-b border-[var(--border-light)]/60">
                      <dt className="text-[var(--text-muted)] uppercase tracking-wider">Scope of Work</dt>
                      <dd className="font-medium text-[var(--text-primary)]">{project.stats.scope}</dd>
                    </div>
                  )}

                  {project.stats?.timeline && (
                    <div className="flex justify-between py-2">
                      <dt className="text-[var(--text-muted)] uppercase tracking-wider">Timeline</dt>
                      <dd className="font-medium text-[var(--text-primary)]">{project.stats.timeline}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                  <Link
                    href="/#contact"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[var(--text-primary)] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[var(--accent-terracotta)] transition-colors group active:scale-95"
                  >
                    <span>Inquire About A Similar Work</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Narrative & Gallery */}
            <div className="lg:col-span-8 space-y-16">
              {/* Narrative */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-medium mb-3 block">
                  Design Narrative
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)] mb-6 leading-snug">
                  {project.shortDescription}
                </h2>

                <div className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] font-light leading-relaxed font-sans">
                  {narrativeParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Conditional Before / After Slider for this specific project */}
              {project.beforeImage && project.afterImage && (
                <div className="pt-8 border-t border-[var(--border-light)]">
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    title={`${project.title} — Restoration Reveal`}
                    location={project.city}
                    description="Interactive comparison revealing the raw structural fabric and the completed architectural execution."
                  />
                </div>
              )}

              {/* High-Resolution Gallery */}
              <div className="pt-8 border-t border-[var(--border-light)]">
                <SectionHeading
                  eyebrow="Visual Record"
                  title="Gallery &amp; Material Details"
                  subtitle="Explore the tectonic joints, material palettes, and lighting studies of this project."
                  className="mb-8"
                />

                <ProjectGallery images={project.gallery} projectTitle={project.title} />
              </div>
            </div>
          </div>

          {/* Adjacent Project Navigation with Hover Animation */}
          <div className="mt-24 pt-12 border-t border-[var(--border-light)] grid grid-cols-1 sm:grid-cols-2 gap-8">
            {prev && (
              <Link
                href={`/projects/${prev.slug}`}
                data-cursor="view"
                className="p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)]/40 hover:shadow-sm transition-all group"
              >
                <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 mb-2 font-sans">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Project</span>
                </span>
                <h4 className="font-serif text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-terracotta)] transition-colors">
                  {prev.title}
                </h4>
                <span className="text-xs text-[var(--text-muted)] mt-1 block font-sans">
                  {prev.city} · {prev.category}
                </span>
              </Link>
            )}

            {next && (
              <Link
                href={`/projects/${next.slug}`}
                data-cursor="view"
                className="p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--accent-terracotta)]/40 hover:shadow-sm transition-all text-right group"
              >
                <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] flex items-center justify-end gap-1.5 mb-2 font-sans">
                  <span>Next Project</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <h4 className="font-serif text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-terracotta)] transition-colors">
                  {next.title}
                </h4>
                <span className="text-xs text-[var(--text-muted)] mt-1 block font-sans">
                  {next.city} · {next.category}
                </span>
              </Link>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
