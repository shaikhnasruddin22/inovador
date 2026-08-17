export interface StrapiMedia {
  id?: number | string;
  documentId?: string;
  url?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width: number; height: number }>;
  attributes?: {
    url?: string;
    alternativeText?: string;
    caption?: string;
  };
  data?: {
    id?: number | string;
    attributes?: {
      url?: string;
      alternativeText?: string;
      caption?: string;
    };
    url?: string;
  } | Array<{
    id?: number | string;
    attributes?: {
      url?: string;
      alternativeText?: string;
    };
    url?: string;
  }>;
}

export interface StrapiProjectItem {
  id?: number | string;
  documentId?: string;
  title?: string;
  slug?: string;
  city?: string;
  category?: string;
  year?: number;
  shortDescription?: string;
  description?: string;
  fullDescription?: string;
  coverImage?: StrapiMedia | string;
  gallery?: StrapiMedia[] | { data: StrapiMedia[] } | string[];
  beforeImage?: StrapiMedia | string;
  afterImage?: StrapiMedia | string;
  featured?: boolean;
  sortOrder?: number;
  stats?: {
    area?: string;
    scope?: string;
    location?: string;
    year?: number;
    timeline?: string;
  };
  attributes?: Omit<StrapiProjectItem, 'attributes'>;
}

export interface StrapiTestimonialItem {
  id?: number | string;
  documentId?: string;
  clientName?: string;
  roleOrLocation?: string;
  quote?: string;
  projectReference?: string | { title?: string; data?: { attributes?: { title?: string } } };
  photo?: StrapiMedia | string;
  avatar?: string;
  sortOrder?: number;
  attributes?: Omit<StrapiTestimonialItem, 'attributes'>;
}

export interface StrapiServiceItem {
  id?: number | string;
  documentId?: string;
  name?: string;
  slug?: string;
  iconName?: string;
  shortDescription?: string;
  deliverables?: string[] | string;
  sortOrder?: number;
  attributes?: Omit<StrapiServiceItem, 'attributes'>;
}

export interface StrapiFAQItem {
  id?: number | string;
  documentId?: string;
  question?: string;
  answer?: string;
  category?: string;
  sortOrder?: number;
  attributes?: Omit<StrapiFAQItem, 'attributes'>;
}

export interface StrapiHeroSlideItem {
  id?: number | string;
  documentId?: string;
  title?: string;
  eyebrow?: string;
  location?: string;
  projectSlug?: string;
  image?: StrapiMedia | string;
  imageUrl?: string;
  sortOrder?: number;
  active?: boolean;
  attributes?: Omit<StrapiHeroSlideItem, 'attributes'>;
}

export interface StrapiProcessStepItem {
  id?: number | string;
  documentId?: string;
  stepNumber?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  sortOrder?: number;
  active?: boolean;
  attributes?: Omit<StrapiProcessStepItem, 'attributes'>;
}

export interface StrapiAwardPressItem {
  id?: number | string;
  documentId?: string;
  title?: string;
  publication?: string;
  year?: number;
  badgeText?: string;
  url?: string;
  logo?: StrapiMedia | string;
  sortOrder?: number;
  active?: boolean;
  attributes?: Omit<StrapiAwardPressItem, 'attributes'>;
}

export interface StrapiStudioAboutItem {
  id?: number | string;
  documentId?: string;
  studioName?: string;
  tagline?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  ethosEyebrow?: string;
  ethosHeadline?: string;
  ethosDescription1?: string;
  ethosDescription2?: string;
  yearsExperience?: number;
  worksCount?: number;
  hubsCount?: number;
  pillars?: Array<{ title: string; description: string }> | string;
  leadership?: Array<{ name: string; role: string; bio: string; image: string }> | string;
  ctaText?: string;
  ctaLink?: string;
  attributes?: Omit<StrapiStudioAboutItem, 'attributes'>;
}
