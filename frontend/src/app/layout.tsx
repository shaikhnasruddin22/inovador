import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { getStudioAbout, getNavigation, getSiteSettings } from '@/lib/api';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Inovador Design Studio | Architecture & Interiors',
    template: '%s | Inovador Design Studio',
  },
  description: 'Inovador Design Studio creates monolithic residences, serene interiors, and biophilic landscapes across Mumbai, Goa, Bengaluru, and Alibaug.',
  keywords: [
    'Architecture Studio Mumbai',
    'Luxury Villa Architecture Goa',
    'Interior Architecture Studio',
    'Landscape Planning Bengaluru',
    'Heritage Renovation India',
    'Bespoke Residential Design',
  ],
  authors: [{ name: 'Inovador Design Studio' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Inovador Design Studio | Architecture & Interiors',
    description: 'Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor.',
    url: '/',
    siteName: 'Inovador Design Studio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
        width: 1600,
        height: 900,
        alt: 'Inovador Design Studio Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inovador Design Studio',
    description: 'Architecture · Interiors · Landscapes · Spatial Identities',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [aboutData, navItems, siteSettings] = await Promise.all([
    getStudioAbout().catch(() => null),
    getNavigation().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const studioName = siteSettings?.studioName || aboutData?.studioName || 'Inovador Design Studio';
  const phone = siteSettings?.phone || aboutData?.phone || '+91 22 6984 3200';
  const address = siteSettings?.address || aboutData?.mumbaiAddress || 'Studio 04, The Mill District, Lower Parel, Mumbai, Maharashtra 400013';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: studioName,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telephone: phone,
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400013',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.9986,
      longitude: 72.8258,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:30',
      closes: '18:30',
    },
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased selection:bg-[var(--accent-terracotta)] selection:text-white">
        <CustomCursor />
        <Header navItems={navItems} siteSettings={siteSettings || undefined} />
        <main className="flex-grow pt-[80px] lg:pt-[90px]">
          {children}
        </main>
        <Footer
          aboutData={aboutData || undefined}
          siteSettings={siteSettings || undefined}
          navItems={navItems}
        />
      </body>
    </html>
  );
}
