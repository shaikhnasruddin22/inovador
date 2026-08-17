import { Project, Testimonial, Service, FAQItem, ProjectCategory } from '@/types';
import {
  StrapiProjectItem,
  StrapiTestimonialItem,
  StrapiServiceItem,
  StrapiFAQItem,
} from '@/types/strapi';
import { getMediaUrl, getMediaGalleryUrls } from './client';

export function normalizeProject(raw: StrapiProjectItem): Project {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || item.slug || Math.random());

  const defaultImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop';

  const coverImageUrl =
    (typeof item.coverImage === 'string' ? item.coverImage : getMediaUrl(item.coverImage)) ||
    defaultImage;
  const galleryUrls = getMediaGalleryUrls(item.gallery);

  return {
    id,
    title: item.title || 'Untitled Commission',
    slug: item.slug || 'untitled-commission',
    city: item.city || 'Mumbai',
    category: (item.category as ProjectCategory) || 'Architecture',
    year: Number(item.year) || new Date().getFullYear(),
    shortDescription: item.shortDescription || '',
    fullDescription: item.description || item.fullDescription || item.shortDescription || '',
    coverImage: coverImageUrl,
    gallery: galleryUrls.length > 0 ? galleryUrls : [coverImageUrl],
    beforeImage: typeof item.beforeImage === 'string' ? item.beforeImage : getMediaUrl(item.beforeImage),
    afterImage: typeof item.afterImage === 'string' ? item.afterImage : getMediaUrl(item.afterImage),
    featured: Boolean(item.featured),
    stats: item.stats || {
      location: item.city,
      year: item.year,
    },
    sortOrder: Number(item.sortOrder) || 0,
  };
}

export function normalizeTestimonial(raw: StrapiTestimonialItem): Testimonial {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  let projectReference: string | undefined = undefined;
  if (item.projectReference) {
    if (typeof item.projectReference === 'string') {
      projectReference = item.projectReference;
    } else if (typeof item.projectReference === 'object' && item.projectReference.title) {
      projectReference = item.projectReference.title;
    } else if (
      typeof item.projectReference === 'object' &&
      item.projectReference.data?.attributes?.title
    ) {
      projectReference = item.projectReference.data.attributes.title;
    }
  }

  return {
    id,
    clientName: item.clientName || 'Patron',
    roleOrLocation: item.roleOrLocation || 'Private Client',
    quote: item.quote || '',
    projectReference,
    avatar: typeof item.photo === 'string' ? item.photo : getMediaUrl(item.photo) || item.avatar,
    sortOrder: Number(item.sortOrder) || 0,
  };
}

export function normalizeService(raw: StrapiServiceItem): Service {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || item.slug || Math.random());

  let deliverables: string[] = [];
  if (Array.isArray(item.deliverables)) {
    deliverables = item.deliverables;
  } else if (typeof item.deliverables === 'string') {
    try {
      deliverables = JSON.parse(item.deliverables);
    } catch {
      deliverables = [item.deliverables];
    }
  }

  return {
    id,
    name: item.name || 'Studio Discipline',
    slug: item.slug || 'studio-discipline',
    iconName: item.iconName || 'Building2',
    shortDescription: item.shortDescription || '',
    deliverables,
    sortOrder: Number(item.sortOrder) || 0,
  };
}

export function normalizeFAQ(raw: StrapiFAQItem): FAQItem {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  return {
    id,
    question: item.question || '',
    answer: item.answer || '',
    category: item.category || 'General',
    sortOrder: Number(item.sortOrder) || 0,
  };
}
