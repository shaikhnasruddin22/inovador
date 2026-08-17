import {
  Project,
  Testimonial,
  Service,
  FAQItem,
  HeroSlide,
  ProcessStep,
  AwardOrPress,
  StudioAbout,
  ProjectCategory,
  Pillar,
  Leader,
} from '@/types';
import {
  StrapiProjectItem,
  StrapiTestimonialItem,
  StrapiServiceItem,
  StrapiFAQItem,
  StrapiHeroSlideItem,
  StrapiProcessStepItem,
  StrapiAwardPressItem,
  StrapiStudioAboutItem,
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

export function normalizeHeroSlide(raw: StrapiHeroSlideItem): HeroSlide {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  const defaultImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop';

  const imageUrl =
    (typeof item.image === 'string' ? item.image : getMediaUrl(item.image)) ||
    item.imageUrl ||
    defaultImage;

  return {
    id,
    title: item.title || 'Architecture in Dialogue with Landscape & Sea',
    eyebrow: item.eyebrow || 'Private Residence',
    location: item.location || 'Goa',
    projectSlug: item.projectSlug || 'the-raw-stone-pavilion',
    image: imageUrl,
    sortOrder: Number(item.sortOrder) || 0,
    active: item.active !== false,
  };
}

export function normalizeProcessStep(raw: StrapiProcessStepItem): ProcessStep {
  const item = raw.attributes || raw;

  return {
    number: item.stepNumber || '01',
    title: item.title || '',
    subtitle: item.subtitle || '',
    description: item.description || '',
    sortOrder: Number(item.sortOrder) || 0,
    active: item.active !== false,
  };
}

export function normalizeAwardPress(raw: StrapiAwardPressItem): AwardOrPress {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  return {
    id,
    title: item.title || '',
    publication: item.publication || '',
    year: Number(item.year) || new Date().getFullYear(),
    badgeText: item.badgeText || '',
    url: item.url,
    sortOrder: Number(item.sortOrder) || 0,
    active: item.active !== false,
  };
}

export function normalizeStudioAbout(raw: StrapiStudioAboutItem): StudioAbout {
  const item = raw.attributes || raw;

  let pillars: Pillar[] = [];
  if (Array.isArray(item.pillars)) {
    pillars = item.pillars;
  } else if (typeof item.pillars === 'string') {
    try {
      pillars = JSON.parse(item.pillars);
    } catch {
      pillars = [];
    }
  }

  let leadership: Leader[] = [];
  if (Array.isArray(item.leadership)) {
    leadership = item.leadership;
  } else if (typeof item.leadership === 'string') {
    try {
      leadership = JSON.parse(item.leadership);
    } catch {
      leadership = [];
    }
  }

  return {
    studioName: item.studioName || 'Inovador Design Studio',
    tagline: item.tagline || 'Architecture · Interiors · Landscapes · Spatial Identities',
    heroHeadline:
      item.heroHeadline || 'Sculpting sanctuaries through raw materiality & contextual rigor.',
    heroSubtitle:
      item.heroSubtitle ||
      'We are an interdisciplinary studio of architects, interior designers, and landscape planners dedicated to creating enduring spaces that celebrate the ritual of daily dwelling.',
    ethosEyebrow: item.ethosEyebrow || 'The Inovador Ethos',
    ethosHeadline:
      item.ethosHeadline || 'Architecture grounded in material honesty & spatial stillness.',
    ethosDescription1:
      item.ethosDescription1 ||
      'Founded in 2018, Inovador Design Studio is an architecture and spatial practice operating across Mumbai, Goa, Bengaluru, and Alibaug. We reject arbitrary decoration in favor of structural clarity, native masonry, and the tactile poetry of natural daylight.',
    ethosDescription2:
      item.ethosDescription2 ||
      'Every project is approached as an ecological and cultural artifact—forged through deep collaboration with master craftsmen, stone masons, and local fabricators.',
    yearsExperience: Number(item.yearsExperience) || 6,
    worksCount: Number(item.worksCount) || 40,
    hubsCount: Number(item.hubsCount) || 5,
    pillars: pillars.length > 0 ? pillars : [],
    leadership: leadership.length > 0 ? leadership : [],
    ctaText: item.ctaText || 'Start a Commission',
    ctaLink: item.ctaLink || '/#contact',
  };
}
