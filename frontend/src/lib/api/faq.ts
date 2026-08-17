import { FAQItem } from '@/types';
import { StrapiFAQItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeFAQ } from './normalizers';
import mockFAQs from '@/data/faq.json';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getFAQs(): Promise<FAQItem[]> {
  if (USE_MOCK) {
    return (mockFAQs as FAQItem[]).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const response = await fetchAPI<StrapiFAQItem[]>('/api/faqs', {
    params: {
      'sort[0]': 'sortOrder:asc',
    },
    tags: ['faqs'],
    revalidate: 3600,
  });

  if (!response.data || !Array.isArray(response.data)) {
    return [];
  }

  return response.data.map(normalizeFAQ).sort((a, b) => a.sortOrder - b.sortOrder);
}
