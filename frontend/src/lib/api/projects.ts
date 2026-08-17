import { Project } from '@/types';
import { StrapiProjectItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeProject } from './normalizers';
import mockProjects from '@/data/projects.json';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getProjects(): Promise<Project[]> {
  if (USE_MOCK) {
    return (mockProjects as Project[]).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const response = await fetchAPI<StrapiProjectItem[]>('/api/projects', {
    params: {
      populate: '*',
      'sort[0]': 'sortOrder:asc',
    },
    tags: ['projects'],
    revalidate: 3600,
  });

  if (!response.data || !Array.isArray(response.data)) {
    return [];
  }

  return response.data.map(normalizeProject).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (USE_MOCK) {
    return (mockProjects as Project[]).find((p) => p.slug === slug) || null;
  }

  const response = await fetchAPI<StrapiProjectItem[]>('/api/projects', {
    params: {
      'filters[slug][$eq]': slug,
      populate: '*',
    },
    tags: ['projects', `project-${slug}`],
    revalidate: 3600,
  });

  if (response.data && response.data.length > 0) {
    return normalizeProject(response.data[0]);
  }

  return null;
}

export async function getAdjacentProjects(
  currentSlug: string
): Promise<{ prev: Project | null; next: Project | null }> {
  const projects = await getProjects();
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return { prev, next };
}
