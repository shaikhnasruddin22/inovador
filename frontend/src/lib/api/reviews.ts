import { Testimonial } from '@/types';
import testimonialsData from '@/data/testimonials.json';

export async function getTestimonials(): Promise<Testimonial[]> {
  return (testimonialsData as Testimonial[]).sort((a, b) => a.sortOrder - b.sortOrder);
}
