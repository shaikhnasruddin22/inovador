import { Testimonial } from '@/types';
import { StrapiTestimonialItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeTestimonial } from './normalizers';
import mockTestimonials from '@/data/testimonials.json';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getTestimonials(): Promise<Testimonial[]> {
  if (USE_MOCK) {
    return (mockTestimonials as Testimonial[]).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  try {
    const response = await fetchAPI<StrapiTestimonialItem[]>('/api/testimonials', {
      params: {
        populate: '*',
        'sort[0]': 'sortOrder:asc',
      },
      tags: ['testimonials'],
      revalidate: 3600,
    });

    if (!response.data || !Array.isArray(response.data)) {
      return (mockTestimonials as Testimonial[]).sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return response.data.map(normalizeTestimonial).sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error('[CMS getTestimonials failed, using fallback data]:', error);
    return (mockTestimonials as Testimonial[]).sort((a, b) => a.sortOrder - b.sortOrder);
  }
}
