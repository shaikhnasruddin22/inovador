import { HeroSlide } from '@/types';
import { StrapiHeroSlideItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeHeroSlide } from './normalizers';

export const mockHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Private Coastal Residence',
    title: 'Architecture in Dialogue with Landscape & Sea',
    location: 'Anjuna, Goa',
    projectSlug: 'the-raw-stone-pavilion',
    mediaType: 'image',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Heritage Interior Architecture',
    title: 'Art Deco Proportions & Tactile Travertine Marble',
    location: 'Marine Drive, Mumbai',
    projectSlug: 'apartment-702-marine-drive',
    mediaType: 'image',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop',
    eyebrow: 'Monolithic Courtyard Estate',
    title: 'Monolithic Concrete & Shaded Spatial Flow',
    location: 'Awas, Alibaug',
    projectSlug: 'courtyard-house-of-light',
    mediaType: 'image',
    sortOrder: 3,
    active: true,
  },
];

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (USE_MOCK) {
    return mockHeroSlides.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  try {
    const response = await fetchAPI<StrapiHeroSlideItem[]>('/api/hero-slides', {
      params: {
        populate: '*',
        'sort[0]': 'sortOrder:asc',
      },
      tags: ['hero-slides'],
      revalidate: 3600,
    });

    if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data
        .map(normalizeHeroSlide)
        .filter((s) => s.active !== false)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch (e) {
    console.error('Error fetching hero slides from Strapi, using fallback:', e);
  }

  return mockHeroSlides.sort((a, b) => a.sortOrder - b.sortOrder);
}
