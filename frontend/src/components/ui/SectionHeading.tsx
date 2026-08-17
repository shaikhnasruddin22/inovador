import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : '',
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-block text-[11px] sm:text-xs uppercase tracking-[0.2em] font-sans font-medium mb-3',
            dark ? 'text-[var(--accent-terracotta)]' : 'text-[var(--accent-terracotta)]'
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] mb-4',
          dark ? 'text-white' : 'text-[var(--text-primary)]'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-base sm:text-lg font-sans font-light leading-relaxed',
            dark ? 'text-[var(--text-inverse-muted)]' : 'text-[var(--text-secondary)]'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
