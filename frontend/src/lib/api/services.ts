import { Service } from '@/types';
import { StrapiServiceItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeService } from './normalizers';
import mockServices from '@/data/services.json';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getServices(): Promise<Service[]> {
  if (USE_MOCK) {
    return (mockServices as Service[]).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  try {
    const response = await fetchAPI<StrapiServiceItem[]>('/api/services', {
      params: {
        'sort[0]': 'sortOrder:asc',
      },
      tags: ['services'],
      revalidate: 3600,
    });

    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map(normalizeService).sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch (e) {
    console.error('Error fetching services from Strapi, using fallback:', e);
  }

  return (mockServices as Service[]).sort((a, b) => a.sortOrder - b.sortOrder);
}
