import { MetadataRoute } from 'next';
import { getProjects, getPresence, getPages } from '@/lib/api';

const RESERVED_SLUGS = [
  'home',
  'projects',
  'about',
  'services',
  'presence',
  'contact',
  'api',
  'admin',
  'sitemap.xml',
  'robots.txt',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [projects, presenceList, pages] = await Promise.all([
    getProjects().catch(() => []),
    getPresence().catch(() => []),
    getPages().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/presence`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const presenceRoutes: MetadataRoute.Sitemap = presenceList.map((loc) => ({
    url: `${baseUrl}/presence/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((p) => !p.noIndex && !RESERVED_SLUGS.includes(p.slug.toLowerCase()))
    .map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes, ...presenceRoutes, ...pageRoutes];
}
