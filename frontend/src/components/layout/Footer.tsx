import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { StudioAbout, SiteSettings, NavigationItem } from '@/types';
import { STUDIO_INFO, NAV_LINKS } from '@/lib/constants';
import { Container } from './Container';

interface FooterProps {
  aboutData?: StudioAbout;
  siteSettings?: SiteSettings;
  navItems?: NavigationItem[];
}

export function Footer({ aboutData, siteSettings, navItems = [] }: FooterProps) {
  const studioName = siteSettings?.studioName || aboutData?.studioName || STUDIO_INFO.name;
  const footerHeadline = aboutData?.footerHeadline || "Let's formulate your next spatial sanctuary.";
  const footerDesc =
    siteSettings?.footerDescription ||
    aboutData?.footerDescription ||
    'We lead residential architecture, private estates, and luxury interior transformations across India and select international locales.';
  const locations = aboutData?.locations && aboutData.locations.length > 0 ? aboutData.locations : STUDIO_INFO.locations;

  const socials =
    siteSettings?.socialLinks && siteSettings.socialLinks.length > 0
      ? siteSettings.socialLinks.map((s) => ({ label: s.name, href: s.url }))
      : aboutData?.socials && aboutData.socials.length > 0
      ? aboutData.socials
      : STUDIO_INFO.socials;

  const activeNavLinks =
    navItems.length > 0
      ? navItems
          .filter((item) => item.visible !== false)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => ({
            label: item.label,
            href: item.url,
            openInNewTab: item.openInNewTab,
          }))
      : NAV_LINKS.map((l) => ({ label: l.label, href: l.href, openInNewTab: false }));

  const copyrightText =
    siteSettings?.copyrightText ||
    `© ${new Date().getFullYear()} ${studioName}. All rights reserved.`;

  return (
    <footer className="bg-[var(--bg-dark)] text-[var(--text-inverse)] pt-20 pb-12 border-t border-[var(--border-dark)]">
      <Container>
        {/* Top Big Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[var(--border-dark)]">
          <div className="lg:col-span-7">
            <span className="text-[var(--accent-terracotta)] text-xs uppercase tracking-[0.2em] font-sans font-semibold mb-3 block">
              {studioName}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight text-white mb-6">
              {footerHeadline}
            </h2>
            <p className="text-[var(--text-inverse-muted)] text-base md:text-lg max-w-xl font-sans font-light leading-relaxed mb-8">
              {footerDesc}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-[var(--accent-terracotta)] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[var(--accent-terracotta-hover)] transition-all duration-300 group"
            >
              <span>Initiate Studio Brief</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Quick Navigation & Cities */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.16em] text-[var(--text-inverse-muted)] font-medium mb-4">
                Navigation
              </h3>
              <ul className="space-y-2.5 text-sm text-[var(--text-inverse)]">
                {activeNavLinks.map((link, idx) => (
                  <li key={`${link.href}-${idx}`}>
                    <Link
                      href={link.href}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="hover:text-[var(--accent-terracotta)] transition-colors inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.16em] text-[var(--text-inverse-muted)] font-medium mb-4">
                Presence
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-inverse-muted)]">
                {locations.map((loc) => {
                  const locSlug = loc.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <li key={loc}>
                      <Link
                        href={`/presence/${locSlug}`}
                        className="hover:text-white transition-colors"
                      >
                        {loc}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <h3 className="text-xs uppercase tracking-[0.16em] text-[var(--text-inverse-muted)] font-medium mt-8 mb-4">
                Follow
              </h3>
              <div className="flex flex-col space-y-2 text-sm text-[var(--text-inverse-muted)]">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-inverse-muted)] font-sans">
          <div className="flex items-center gap-2">
            <span>{copyrightText}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px] tracking-wider uppercase">Editorial Architectural Practice</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
