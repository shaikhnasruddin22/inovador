import React from 'react';
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
} from '@/lib/api';

export default async function HomePage() {
  const [projects, testimonials, faqs, awards, processSteps, services] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getFAQs(),
    getAwards(),
    getProcessSteps(),
    getServices(),
  ]);

  return (
    <>
      {/* 1. Hero Slider with Cinematic Motion */}
      <HeroSlider />

      {/* 2. Featured Projects with Layout Animations */}
      <FeaturedProjects initialProjects={projects} />

      {/* 3. About Studio Teaser with Animated Counters */}
      <AboutTeaser />

      {/* 4. Architectural Process with Progressive Reveal */}
      <ProcessGrid steps={processSteps} />

      {/* 5. Services & Capabilities with Refined Hover */}
      <ServicesGrid services={services} />

      {/* 6. Before / After Renovation Widget with Drag Hint */}
      <BeforeAfterSlider />

      {/* 7. Testimonials Carousel with Sequential Stagger */}
      <TestimonialsCarousel testimonials={testimonials} />

      {/* 8. Recognition & Press Strip with Grayscale-to-Color */}
      <PressAwardsStrip awards={awards} />

      {/* 9. FAQ Accordion with Smooth Morph */}
      <FAQAccordion items={faqs} />

      {/* 10. Inquiry & Contact with Micro-Interactions */}
      <InquirySection />
    </>
  );
}
