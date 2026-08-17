import { ProcessStep } from '@/types';
import { StrapiProcessStepItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeProcessStep } from './normalizers';
import mockProcess from '@/data/process.json';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getProcessSteps(): Promise<ProcessStep[]> {
  if (USE_MOCK) {
    return mockProcess as ProcessStep[];
  }

  const response = await fetchAPI<StrapiProcessStepItem[]>('/api/process-steps', {
    params: {
      'sort[0]': 'sortOrder:asc',
    },
    tags: ['process-steps'],
    revalidate: 3600,
  });

  if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
    return [];
  }

  return response.data
    .map(normalizeProcessStep)
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}
