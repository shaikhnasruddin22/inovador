'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { Container } from './Container';
import { MobileNav } from './MobileNav';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[var(--border-light)] py-3.5 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex flex-col focus-visible:outline-none"
            aria-label="Inovador Design Studio Homepage"
          >
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_EDITORIAL }}
              className="font-serif text-2xl tracking-[-0.03em] font-light text-[var(--text-primary)] group-hover:text-[var(--accent-terracotta)] transition-colors"
            >
              INOVADOR
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_EDITORIAL }}
              className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] -mt-1 font-sans"
            >
              Design Studio
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.08em] uppercase font-sans font-medium text-[var(--text-secondary)]">
            {NAV_LINKS.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + idx * 0.05,
                  ease: EASE_EDITORIAL,
                }}
              >
                <Link
                  href={link.href}
                  className="relative py-1 hover:text-[var(--text-primary)] transition-colors group block"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--accent-terracotta)] group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Action */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_EDITORIAL }}
            className="flex items-center gap-4"
          >
            <Link
              href="/#contact"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-[0.12em] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 active:scale-95"
            >
              Start an Inquiry
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 text-[var(--text-primary)] hover:text-[var(--accent-terracotta)] lg:hidden focus-visible:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </motion.div>
        </Container>
      </motion.header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
}
