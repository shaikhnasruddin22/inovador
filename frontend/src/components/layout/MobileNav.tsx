'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { NavigationItem, SiteSettings } from '@/types';
import { NAV_LINKS, STUDIO_INFO } from '@/lib/constants';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: NavigationItem[];
  siteSettings?: SiteSettings;
}

export function MobileNav({ isOpen, onClose, navItems = [], siteSettings }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const studioName = siteSettings?.studioName || 'INOVADOR';
  const tagline = siteSettings?.tagline || STUDIO_INFO.tagline;
  const socials =
    siteSettings?.socialLinks && siteSettings.socialLinks.length > 0
      ? siteSettings.socialLinks
      : STUDIO_INFO.socials.map((s) => ({ name: s.label, url: s.href }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#121212] text-[#F8F5F0] flex flex-col justify-between p-6 sm:p-10 lg:hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-6">
            <Link href="/" onClick={onClose} className="font-serif text-xl tracking-tight uppercase">
              {studioName.replace(/ Design Studio/i, '').replace(/ Studio/i, '')}
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-[#A8A29A] hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="my-auto py-8 flex flex-col gap-5">
            {activeNavLinks.map((link, idx) => (
              <motion.div
                key={`${link.href}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="font-serif text-3xl sm:text-4xl text-[#F8F5F0] hover:text-[var(--accent-terracotta)] transition-colors flex items-center justify-between group"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity transform -rotate-45 group-hover:rotate-0 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom Studio Info */}
          <div className="border-t border-[#2A2A2A] pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#958F86]">
            <div>
              <p className="font-medium text-white mb-1">Architecture & Spatial Practice</p>
              <p>{tagline}</p>
            </div>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
