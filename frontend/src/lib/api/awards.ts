import { AwardOrPress } from '@/types';
import { StrapiAwardPressItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeAwardPress } from './normalizers';
import mockAwards from '@/data/awards.json';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getAwards(): Promise<AwardOrPress[]> {
  if (USE_MOCK) {
    return mockAwards as AwardOrPress[];
  }

  try {
    const response = await fetchAPI<StrapiAwardPressItem[]>('/api/award-presses', {
      params: {
        'sort[0]': 'sortOrder:asc',
      },
      tags: ['awards-press'],
      revalidate: 3600,
    });

    if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data
        .map(normalizeAwardPress)
        .filter((a) => a.active !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
  } catch (e) {
    console.error('Error fetching awards from Strapi, using fallback:', e);
  }

  return (mockAwards as AwardOrPress[])
    .filter((a) => a.active !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}
