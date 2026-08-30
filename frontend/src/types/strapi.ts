export interface StrapiMedia {
  id?: number | string;
  documentId?: string;
  name?: string;
  url?: string;
  width?: number;
  height?: number;
  mime?: string;
  data?: {
    attributes?: {
      url?: string;
      width?: number;
      height?: number;
      mime?: string;
      formats?: Record<string, unknown>;
    };
    url?: string;
  } | Array<{
    attributes?: {
      url?: string;
    };
    url?: string;
  }>;
  formats?: {
    thumbnail?: { url: string; width?: number; height?: number };
    small?: { url: string; width?: number; height?: number };
    medium?: { url: string; width?: number; height?: number };
    large?: { url: string; width?: number; height?: number };
  };
  attributes?: {
    url?: string;
    width?: number;
    height?: number;
    mime?: string;
    formats?: Record<string, unknown>;
  };
}

export interface StrapiHeroSlideItem {
  id?: number | string;
  documentId?: string;
  title?: string;
  eyebrow?: string;
  location?: string;
  projectSlug?: string;
  mediaType?: 'image' | 'video';
  image?: StrapiMedia | string;
  imageUrl?: string;
  desktopVideo?: StrapiMedia | string;
  mobileVideo?: StrapiMedia | string;
  posterImage?: StrapiMedia | string;
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
  posterImageUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  slideDuration?: number;
  sortOrder?: number;
  active?: boolean;
  attributes?: Omit<StrapiHeroSlideItem, 'attributes'>;
}

export interface StrapiProjectItem {
  id?: number | string;
  documentId?: string;
  title?: string;
  slug?: string;
  city?: string;
  category?: string;
  typology?: string;
  year?: string | number;
  shortDescription?: string;
  description?: string;
  fullDescription?: string;
  coverImage?: StrapiMedia | string;
  gallery?: (StrapiMedia | string)[] | { data: StrapiMedia[] };
  beforeImage?: StrapiMedia | string;
  afterImage?: StrapiMedia | string;
  featured?: boolean;
  sortOrder?: number;
  stats?: {
    area?: string;
    timeline?: string;
    location?: string;
    year?: number;
    completionYear?: string;
  };
  narrativeSections?: {
    concept?: string;
    materiality?: string;
    context?: string;
  };
  pressMentions?: {
    publication?: string;
    date?: string;
    url?: string;
  }[];
  attributes?: Omit<StrapiProjectItem, 'attributes'>;
}

export interface StrapiServiceItem {
  id?: number | string;
  documentId?: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  iconName?: string;
  sortOrder?: number;
  featured?: boolean;
  capabilities?: string[];
  deliverables?: string[];
  attributes?: Omit<StrapiServiceItem, 'attributes'>;
}

export interface StrapiTestimonialItem {
  id?: number | string;
  documentId?: string;
  clientName?: string;
  role?: string;
  roleOrLocation?: string;
  quote?: string;
  projectReference?: string;
  clientPhoto?: StrapiMedia | string;
  photo?: StrapiMedia | string;
  avatar?: StrapiMedia | string;
  rating?: number;
  featured?: boolean;
  sortOrder?: number;
  attributes?: Omit<StrapiTestimonialItem, 'attributes'>;
}

export interface StrapiFAQItem {
  id?: number | string;
  documentId?: string;
  question?: string;
  answer?: string;
  category?: string;
  sortOrder?: number;
  active?: boolean;
  attributes?: Omit<StrapiFAQItem, 'attributes'>;
}

export interface StrapiProcessStepItem {
  id?: number | string;
  documentId?: string;
  stepNumber?: number | string;
  title?: string;
  subtitle?: string;
  description?: string;
  duration?: string;
  deliverables?: string[];
  sortOrder?: number;
  active?: boolean;
  attributes?: Omit<StrapiProcessStepItem, 'attributes'>;
}

export interface StrapiAwardPressItem {
  id?: number | string;
  documentId?: string;
  title?: string;
  type?: 'award' | 'press';
  sourceOrJuror?: string;
  publication?: string;
  badgeText?: string;
  year?: string | number;
  url?: string;
  projectMentioned?: string;
  sortOrder?: number;
  active?: boolean;
  attributes?: Omit<StrapiAwardPressItem, 'attributes'>;
}

export interface StrapiStudioAboutItem {
  id?: number | string;
  documentId?: string;
  studioName?: string;
  tagline?: string;
  statement?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroSubtitle?: string;
  bannerImage?: StrapiMedia | string;
  manifesto?: string;
  history?: string;
  ethosEyebrow?: string;
  ethosHeadline?: string;
  ethosDescription1?: string;
  ethosDescription2?: string;
  yearsExperience?: number;
  worksCount?: number;
  hubsCount?: number;
  stats?: {
    yearsOfPractice?: string;
    completedProjects?: string;
    monolithicStructures?: string;
    architecturalAwards?: string;
  };
  pillars?: {
    number?: string;
    title?: string;
    description?: string;
  }[] | Array<{ title: string; description: string }> | string;
  leadership?: {
    name?: string;
    role?: string;
    bio?: string;
    portrait?: StrapiMedia | string;
    image?: string;
  }[] | Array<{ name: string; role: string; bio: string; image: string }> | string;
  locations?: string[] | string;
  socials?: {
    label?: string;
    href?: string;
  }[] | Array<{ label: string; href: string }> | string;
  mumbaiAddress?: string;
  goaAddress?: string;
  officeHours?: string;
  weekendHours?: string;
  advisoryProtocol?: string;
  phone?: string;
  email?: string;
  footerHeadline?: string;
  footerDescription?: string;
  ctaText?: string;
  ctaLink?: string;
  attributes?: Omit<StrapiStudioAboutItem, 'attributes'>;
}

export interface StrapiNavigationItem {
  id?: number | string;
  documentId?: string;
  label?: string;
  url?: string;
  type?: 'internal' | 'external';
  visible?: boolean;
  sortOrder?: number;
  openInNewTab?: boolean;
  parent?: string | null;
  attributes?: Omit<StrapiNavigationItem, 'attributes'>;
}

export interface StrapiPresenceItem {
  id?: number | string;
  documentId?: string;
  name?: string;
  slug?: string;
  city?: string;
  shortDescription?: string;
  description?: string;
  address?: string;
  email?: string;
  phone?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  featured?: boolean;
  active?: boolean;
  sortOrder?: number;
  heroImage?: StrapiMedia | string;
  gallery?: (StrapiMedia | string)[] | { data: StrapiMedia[] };
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: StrapiMedia | string;
  attributes?: Omit<StrapiPresenceItem, 'attributes'>;
}

export interface StrapiSiteSettingsItem {
  id?: number | string;
  documentId?: string;
  studioName?: string;
  tagline?: string;
  defaultEmail?: string;
  phone?: string;
  address?: string;
  logo?: StrapiMedia | string;
  favicon?: StrapiMedia | string;
  socialLinks?: {
    name?: string;
    url?: string;
  }[];
  copyrightText?: string;
  footerDescription?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultOgImage?: StrapiMedia | string;
  attributes?: Omit<StrapiSiteSettingsItem, 'attributes'>;
}

export interface StrapiHomePageItem {
  id?: number | string;
  documentId?: string;
  showHero?: boolean;
  showProjects?: boolean;
  showAboutTeaser?: boolean;
  showProcess?: boolean;
  showServices?: boolean;
  showBeforeAfter?: boolean;
  showTestimonials?: boolean;
  showAwards?: boolean;
  showFaq?: boolean;
  showInquiry?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: StrapiMedia | string;
  attributes?: Omit<StrapiHomePageItem, 'attributes'>;
}

export interface StrapiServicesPageItem {
  id?: number | string;
  documentId?: string;
  heading?: string;
  introduction?: string;
  ctaText?: string;
  ctaLink?: string;
  bannerImage?: StrapiMedia | string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: StrapiMedia | string;
  attributes?: Omit<StrapiServicesPageItem, 'attributes'>;
}

export interface StrapiProjectsPageItem {
  id?: number | string;
  documentId?: string;
  heading?: string;
  introduction?: string;
  ctaText?: string;
  ctaLink?: string;
  bannerImage?: StrapiMedia | string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: StrapiMedia | string;
  attributes?: Omit<StrapiProjectsPageItem, 'attributes'>;
}

export interface StrapiPresencePageItem {
  id?: number | string;
  documentId?: string;
  heading?: string;
  introduction?: string;
  ctaText?: string;
  ctaLink?: string;
  bannerImage?: StrapiMedia | string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: StrapiMedia | string;
  attributes?: Omit<StrapiPresencePageItem, 'attributes'>;
}

export interface StrapiContactPageItem {
  id?: number | string;
  documentId?: string;
  heading?: string;
  introduction?: string;
  email?: string;
  phone?: string;
  officeDetails?: string;
  officeHours?: string;
  advisoryProtocol?: string;
  ctaText?: string;
  bannerImage?: StrapiMedia | string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: StrapiMedia | string;
  attributes?: Omit<StrapiContactPageItem, 'attributes'>;
}

export interface StrapiPageSectionItem {
  __component: string;
  id?: number | string;
  eyebrow?: string;
  title?: string;
  heading?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  image?: StrapiMedia | string;
  mobileImage?: StrapiMedia | string;
  ctaText?: string;
  ctaUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
  width?: 'narrow' | 'medium' | 'wide' | 'full';
  imagePosition?: 'left' | 'right';
  aspectRatio?: '16:9' | '4:3' | '21:9' | 'auto';
  caption?: string;
  altText?: string;
  displayMode?: 'all' | 'featured' | 'category' | 'city';
  selectedCategory?: string;
  selectedCity?: string;
  category?: string;
  stats?: Array<{ label: string; value: string; description?: string }> | string;
  beforeImage?: StrapiMedia | string;
  afterImage?: StrapiMedia | string;
  beforeLabel?: string;
  afterLabel?: string;
  style?: 'dark' | 'terracotta' | 'light' | 'minimal';
}

export interface StrapiPageItem {
  id?: number | string;
  documentId?: string;
  title?: string;
  slug?: string;
  navigationLabel?: string;
  showInNavigation?: boolean;
  navigationOrder?: number;
  sections?: StrapiPageSectionItem[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: StrapiMedia | string;
  canonicalUrl?: string;
  noIndex?: boolean;
  attributes?: Omit<StrapiPageItem, 'attributes'>;
}
