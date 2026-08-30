import React from 'react';
import type { Metadata } from 'next';
import { HeroSlider } from '@/components/hero/HeroSlider';
import { FeaturedProjects } from '@/components/projects/FeaturedProjects';
import { AboutTeaser } from '@/components/about/AboutTeaser';
import { ProcessGrid } from '@/components/process/ProcessGrid';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { BeforeAfterSlider } from '@/components/before-after/BeforeAfterSlider';
import { TestimonialsCarousel } from '@/components/testimonials/TestimonialsCarousel';
import { PressAwardsStrip } from '@/components/awards/PressAwardsStrip';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { InquirySection } from '@/components/contact/InquirySection';
import {
  getProjects,
  getTestimonials,
  getFAQs,
  getAwards,
  getProcessSteps,
  getServices,
  getHeroSlides,
  getStudioAbout,
  getHomePage,
} from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getHomePage().catch(() => null);
  if (!homeData) return {};

  return {
    title: homeData.seoTitle || 'Inovador Design Studio | Luxury Architecture & Interior Practice',
    description: homeData.seoDescription,
    openGraph: {
      title: homeData.seoTitle,
      description: homeData.seoDescription,
      images: homeData.seoImage ? [{ url: homeData.seoImage }] : undefined,
    },
  };
}

export default async function HomePage() {
  const [
    homeConfig,
    heroSlides,
    projects,
    studioAbout,
    processSteps,
    services,
    testimonials,
    awards,
    faqs,
  ] = await Promise.all([
    getHomePage().catch(() => ({
      showHero: true,
      showProjects: true,
      showAboutTeaser: true,
      showProcess: true,
      showServices: true,
      showBeforeAfter: true,
      showTestimonials: true,
      showAwards: true,
      showFaq: true,
      showInquiry: true,
      seoTitle: '',
      seoDescription: '',
    })),
    getHeroSlides(),
    getProjects(),
    getStudioAbout(),
    getProcessSteps(),
    getServices(),
    getTestimonials(),
    getAwards(),
    getFAQs(),
  ]);

  const renovationProject =
    projects.find((p) => Boolean(p.beforeImage && p.afterImage)) ||
    projects[1] ||
    null;

  return (
    <>
      {/* 1. Hero Slider with Cinematic Motion (Image & Video) */}
      {homeConfig.showHero !== false && <HeroSlider slides={heroSlides} />}

      {/* 2. Featured Projects with Layout Animations */}
      {homeConfig.showProjects !== false && <FeaturedProjects initialProjects={projects} />}

      {/* 3. About Studio Teaser with Animated Counters */}
      {homeConfig.showAboutTeaser !== false && <AboutTeaser aboutData={studioAbout} />}

      {/* 4. Architectural Process with Progressive Reveal */}
      {homeConfig.showProcess !== false && <ProcessGrid steps={processSteps} />}

      {/* 5. Services & Capabilities with Refined Hover */}
      {homeConfig.showServices !== false && <ServicesGrid services={services} />}

      {/* 6. Before / After Renovation Widget with Drag Hint */}
      {homeConfig.showBeforeAfter !== false && <BeforeAfterSlider project={renovationProject} />}

      {/* 7. Testimonials Carousel with Sequential Stagger */}
      {homeConfig.showTestimonials !== false && <TestimonialsCarousel testimonials={testimonials} />}

      {/* 8. Recognition & Press Strip with Grayscale-to-Color */}
      {homeConfig.showAwards !== false && <PressAwardsStrip awards={awards} />}

      {/* 9. FAQ Accordion with Smooth Morph */}
      {homeConfig.showFaq !== false && <FAQAccordion items={faqs} />}

      {/* 10. Inquiry & Contact with Micro-Interactions */}
      {homeConfig.showInquiry !== false && <InquirySection aboutData={studioAbout} />}
    </>
  );
}
