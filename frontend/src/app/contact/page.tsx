import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { InquirySection } from '@/components/contact/InquirySection';
import { getContactPage, getStudioAbout } from '@/lib/api';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const pageConfig = await getContactPage().catch(() => null);
  if (!pageConfig) return { title: 'Contact & Inquiries | Inovador Design Studio' };

  return {
    title: pageConfig.seoTitle || 'Contact & Commission Inquiries | Inovador Design Studio',
    description: pageConfig.seoDescription,
    openGraph: {
      title: pageConfig.seoTitle,
      description: pageConfig.seoDescription,
      images: pageConfig.seoImage ? [{ url: pageConfig.seoImage }] : undefined,
    },
  };
}

export default async function ContactPage() {
  const [pageConfig, studioAbout] = await Promise.all([
    getContactPage(),
    getStudioAbout(),
  ]);

  return (
    <div className="py-16 md:py-24 bg-[var(--bg-primary)]">
      <Container className="mb-16">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[var(--accent-terracotta)] mb-4 block">
            Studio Communications
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[var(--text-primary)] mb-6 tracking-tight">
            {pageConfig.heading || 'Initiate a Spatial Commission'}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-sans font-light leading-relaxed">
            {pageConfig.introduction}
          </p>
        </div>
      </Container>

      {/* Advisory Protocol & Office Details */}
      <Container className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-light)]">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-6 text-[var(--accent-terracotta)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-light text-[var(--text-primary)] mb-3">
              Advisory Protocol
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              {pageConfig.advisoryProtocol}
            </p>
          </div>

          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-light)]">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-6 text-[var(--accent-terracotta)]">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-light text-[var(--text-primary)] mb-3">
              Drawing Rooms
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              {pageConfig.officeDetails}
            </p>
            <div className="text-xs text-[var(--text-muted)] space-y-1">
              <div>Email: {pageConfig.email}</div>
              <div>Direct: {pageConfig.phone}</div>
            </div>
          </div>

          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-light)]">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-6 text-[var(--accent-terracotta)]">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-light text-[var(--text-primary)] mb-3">
              Operating Hours
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              {pageConfig.officeHours}
            </p>
          </div>
        </div>
      </Container>

      {/* Commission Inquiry Form Section */}
      <InquirySection aboutData={studioAbout} />
    </div>
  );
}
