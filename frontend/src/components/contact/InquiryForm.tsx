'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';
import { InquiryFormData } from '@/types';
import { EASE_EDITORIAL, EASE_SMOOTH } from '@/lib/utils/animations';

export function InquiryForm() {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: 'Architecture & Residential Villa',
    timeline: 'Within 6 Months',
    message: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('An error occurred during submission. Please try again or reach out directly.');
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] p-8 sm:p-10 md:p-12 border border-[var(--border-light)] shadow-sm">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
            className="py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 25 }}
              className="w-16 h-16 bg-[var(--bg-secondary)] text-[var(--accent-terracotta)] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-8 h-8" />
            </motion.div>
            <h3 className="font-serif text-3xl font-normal text-[var(--text-primary)] mb-3">
              Inquiry Received
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-md mx-auto mb-8 font-sans">
              Thank you for considering Inovador Design Studio. Our studio directors will review your project brief and connect within 48 business hours.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  projectType: 'Architecture & Residential Villa',
                  timeline: 'Within 6 Months',
                  message: '',
                  honeypot: '',
                });
              }}
              className="px-6 py-3 bg-[var(--text-primary)] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[var(--accent-terracotta)] transition-colors active:scale-95"
            >
              Submit Another Brief
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Error Notification */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_field">Do not fill this</label>
              <input
                type="text"
                id="hp_field"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="inquiry-name"
                  className="block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mb-2 font-sans"
                >
                  Your Name *
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rohini & Siddharth Verma"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:bg-white focus:border-[var(--accent-terracotta)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="inquiry-email"
                  className="block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mb-2 font-sans"
                >
                  Email Address *
                </label>
                <input
                  id="inquiry-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:bg-white focus:border-[var(--accent-terracotta)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone & Typology Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="inquiry-phone"
                  className="block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mb-2 font-sans"
                >
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  id="inquiry-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:bg-white focus:border-[var(--accent-terracotta)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="inquiry-projectType"
                  className="block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mb-2 font-sans"
                >
                  Project Typology
                </label>
                <select
                  id="inquiry-projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:bg-white focus:border-[var(--accent-terracotta)] focus:outline-none transition-colors"
                >
                  <option value="Architecture & Residential Villa">Architecture &amp; Residential Villa</option>
                  <option value="Luxury Interior Architecture">Luxury Interior Architecture</option>
                  <option value="Landscape & Estate Masterplanning">Landscape &amp; Estate Masterplanning</option>
                  <option value="Heritage Renovation & Adaptive Reuse">Heritage Renovation &amp; Adaptive Reuse</option>
                  <option value="Bespoke Hospitality / Brand Space">Bespoke Hospitality / Brand Space</option>
                </select>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label
                htmlFor="inquiry-timeline"
                className="block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mb-2 font-sans"
              >
                Anticipated Timeline
              </label>
              <select
                id="inquiry-timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:bg-white focus:border-[var(--accent-terracotta)] focus:outline-none transition-colors"
              >
                <option value="Immediate (Within 1-3 Months)">Immediate (Within 1-3 Months)</option>
                <option value="Within 6 Months">Within 6 Months</option>
                <option value="Planning for Next Year">Planning for Next Year</option>
                <option value="Conceptual / Feasibility Stage">Conceptual / Feasibility Stage</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="inquiry-message"
                className="block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mb-2 font-sans"
              >
                Brief Project Narrative &amp; Location *
              </label>
              <textarea
                id="inquiry-message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Share your site location, approximate area (sq.ft), lifestyle rituals, or key architectural aspirations..."
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:bg-white focus:border-[var(--accent-terracotta)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--text-primary)] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[var(--accent-terracotta)] transition-colors duration-300 group disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Brief...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Studio Inquiry</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
