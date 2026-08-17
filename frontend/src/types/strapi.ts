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
