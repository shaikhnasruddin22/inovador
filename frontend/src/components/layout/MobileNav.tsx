'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { NAV_LINKS, STUDIO_INFO } from '@/lib/constants';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
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
            <Link href="/" onClick={onClose} className="font-serif text-xl tracking-tight">
              INOVADOR
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
            {NAV_LINKS.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.3 }}
              >
                <Link
                  href={link.href}
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
              <p className="font-medium text-white mb-1">Mumbai & Goa Studio</p>
              <p>{STUDIO_INFO.tagline}</p>
            </div>
            <div className="flex gap-4">
              {STUDIO_INFO.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
