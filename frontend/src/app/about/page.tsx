import React from 'react';
import type { Metadata } from 'next';
import { AboutContent } from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About The Studio | Ethos, Leadership & Architectural Philosophy',
  description: 'Inovador Design Studio is an architectural and interior practice founded on material honesty, contextual responsiveness, and spatial stillness.',
};

export default function AboutPage() {
  return <AboutContent />;
}
