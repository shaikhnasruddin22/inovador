import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[var(--bg-primary)] py-20">
      <Container className="text-center max-w-xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-terracotta)] block mb-4">
          Error 404
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[var(--text-primary)] mb-6">
          Spatial Void
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed mb-10 font-sans">
          The architectural coordinate or project record you are seeking does not exist or has been relocated within our archives.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[var(--text-primary)] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[var(--accent-terracotta)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Return to Studio Homepage</span>
        </Link>
      </Container>
    </div>
  );
}
