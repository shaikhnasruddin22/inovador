import { PresenceLocation } from '@/types';
import { StrapiPresenceItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizePresence } from './normalizers';

export async function getPresence(): Promise<PresenceLocation[]> {
  try {
    const res = await fetchAPI<StrapiPresenceItem[]>('/api/presences', {
      params: {
        populate: '*',
        'sort[0]': 'sortOrder:asc',
        'filters[active][$eq]': true,
      },
      tags: ['presence'],
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data
        .map(normalizePresence)
        .filter((loc) => loc.active !== false)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch (error) {
    console.error('Error fetching presence locations from Strapi:', error);
  }
  return [];
}

export async function getPresenceBySlug(slug: string): Promise<PresenceLocation | null> {
  try {
    const res = await fetchAPI<StrapiPresenceItem[]>('/api/presences', {
      params: {
        populate: '*',
        'filters[slug][$eq]': slug,
        'filters[active][$eq]': true,
      },
      tags: ['presence', `presence-${slug}`],
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return normalizePresence(res.data[0]);
    }
  } catch (error) {
    console.error(`Error fetching presence slug "${slug}":`, error);
  }
  return null;
}

export async function getPresenceSlugs(): Promise<string[]> {
  const locations = await getPresence();
  return locations.map((l) => l.slug);
}
