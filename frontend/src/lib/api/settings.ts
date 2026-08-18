import { SiteSettings } from '@/types';
import { StrapiSiteSettingsItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeSiteSettings } from './normalizers';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetchAPI<StrapiSiteSettingsItem>('/api/site-setting', {
      params: {
        populate: '*',
      },
      tags: ['site-settings'],
    });

    if (res && res.data) {
      return normalizeSiteSettings(res.data);
    }
  } catch (error) {
    console.error('Error fetching site settings from Strapi:', error);
  }

  // Safe fallback
  return {
    studioName: 'Inovador Design Studio',
    tagline: 'Architecture & Spatial Transformation',
    defaultEmail: 'contact@inovadordesign.com',
    phone: '+91 22 6984 3200',
    address: 'Studio 04, The Mill District, Lower Parel, Mumbai, Maharashtra 400013',
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com' },
      { name: 'LinkedIn', url: 'https://linkedin.com' },
      { name: 'Pinterest', url: 'https://pinterest.com' },
    ],
    copyrightText: '© 2026 Inovador Design Studio. All rights reserved.',
    footerDescription: 'We lead residential architecture, private estates, and luxury interior transformations across India and select international locales.',
    defaultSeoTitle: 'Inovador Design Studio | Architecture & Spatial Design',
    defaultSeoDescription: 'A bespoke architecture and spatial design practice crafting monolithic residences, refined interiors, and branded spatial environments.',
  };
}
