import { Project } from '@/types';
import projectsData from '@/data/projects.json';

export async function getProjects(): Promise<Project[]> {
  // Phase 1: local mock data. Phase 2: fetch(`${process.env.STRAPI_API_URL}/api/projects?populate=*`)
  return (projectsData as Project[]).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getAdjacentProjects(currentSlug: string): Promise<{ prev: Project | null; next: Project | null }> {
  const projects = await getProjects();
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return { prev, next };
}
