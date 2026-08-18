import { NavigationItem } from '@/types';
import { StrapiNavigationItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeNavigationItem } from './normalizers';

export async function getNavigation(): Promise<NavigationItem[]> {
  try {
    const res = await fetchAPI<StrapiNavigationItem[]>('/api/navigation-items', {
      params: {
        'sort[0]': 'sortOrder:asc',
        'filters[visible][$eq]': true,
      },
      tags: ['navigation'],
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data
        .map(normalizeNavigationItem)
        .filter((item) => item.visible !== false)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch (error) {
    console.error('Error fetching navigation from Strapi:', error);
  }

  // Safe fallback if CMS is unavailable
  return [
    { id: '1', label: 'Home', url: '/', type: 'internal', visible: true, sortOrder: 1, openInNewTab: false },
    { id: '2', label: 'Projects', url: '/projects', type: 'internal', visible: true, sortOrder: 2, openInNewTab: false },
    { id: '3', label: 'About', url: '/about', type: 'internal', visible: true, sortOrder: 3, openInNewTab: false },
    { id: '4', label: 'Services', url: '/services', type: 'internal', visible: true, sortOrder: 4, openInNewTab: false },
    { id: '5', label: 'Presence', url: '/presence', type: 'internal', visible: true, sortOrder: 5, openInNewTab: false },
    { id: '6', label: 'Contact', url: '/contact', type: 'internal', visible: true, sortOrder: 6, openInNewTab: false },
  ];
}
