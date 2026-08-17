import React from 'react';
import type { Metadata } from 'next';
import { AboutContent } from '@/components/about/AboutContent';
import { getStudioAbout } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const about = await getStudioAbout();
  return {
    title: `About The Studio | ${about.studioName}`,
    description: about.heroSubtitle || about.ethosDescription1,
  };
}

export default async function AboutPage() {
  const studioAbout = await getStudioAbout();
  return <AboutContent aboutData={studioAbout} />;
}
