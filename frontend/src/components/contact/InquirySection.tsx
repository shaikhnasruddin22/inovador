'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { STUDIO_INFO } from '@/lib/constants';
import { InquiryForm } from './InquiryForm';
import { EASE_EDITORIAL } from '@/lib/utils/animations';

export function InquirySection() {
  return (
    <section id="contact" className="section-spacing bg-[var(--bg-primary)] scroll-mt-20 border-t border-[var(--border-light)] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Studio Information & Office Details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <SectionHeading
                eyebrow="Initiate A Commission"
                title="Begin Your Spatial Dialogue"
                subtitle="We accept a limited number of residential and spatial commissions annually to ensure uncompromising directorial oversight."
                className="mb-8"
              />

              <div className="space-y-6 text-sm text-[var(--text-secondary)] font-light font-sans mb-10">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[var(--accent-terracotta)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block mb-1">
                      Main Studios
                    </span>
                    <p>Mumbai: Design District, Kala Ghoda, Mumbai 400001</p>
                    <p className="mt-1">Goa: Studio Pavilion, Anjuna Coastal Road, Goa 403509</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[var(--accent-terracotta)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block mb-1">
                      Direct Studio Contact
                    </span>
                    <p>{STUDIO_INFO.emailPlaceholder}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-[var(--accent-terracotta)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block mb-1">
                      Studio Telephone
                    </span>
                    <p>{STUDIO_INFO.phonePlaceholder}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[var(--accent-terracotta)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block mb-1">
                      Studio Consultation Hours
                    </span>
                    <p>Monday – Friday: 09:30 – 18:30 IST</p>
                    <p>Saturday: By Private Appointment</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-light)]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-terracotta)] font-mono block mb-1">
                Advisory Protocol
              </span>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed font-sans">
                Initial consultations are conducted either at our Mumbai/Goa drawing rooms or via private video conference for overseas patrons.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_EDITORIAL }}
            className="lg:col-span-7"
          >
            <InquiryForm />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
