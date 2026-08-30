export type ProjectCategory = 'Architecture' | 'Interior' | 'Landscape' | 'Branding';

export interface ProjectStats {
  area?: string;
  scope?: string;
  location?: string;
  year?: number;
  timeline?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  city: string;
  category: ProjectCategory;
  year: number;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  gallery: string[];
  beforeImage?: string;
  afterImage?: string;
  featured: boolean;
  stats?: ProjectStats;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  roleOrLocation: string;
  quote: string;
  projectReference?: string;
  avatar?: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  shortDescription: string;
  deliverables: string[];
  sortOrder: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  eyebrow: string;
  location: string;
  projectSlug: string;
  image: string;
  mediaType?: 'image' | 'video';
  desktopVideo?: string;
  mobileVideo?: string;
  posterImage?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  slideDuration?: number;
  sortOrder: number;
  active: boolean;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  sortOrder?: number;
  active?: boolean;
}

export interface AwardOrPress {
  id: string;
  title: string;
  publication: string;
  year: number;
  badgeText: string;
  url?: string;
  sortOrder?: number;
  active?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface Pillar {
  title: string;
  description: string;
}

export interface Leader {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface StudioAbout {
  studioName: string;
  tagline: string;
  statement: string;
  email: string;
  phone: string;
  mumbaiAddress: string;
  goaAddress: string;
  officeHours: string;
  weekendHours: string;
  advisoryProtocol: string;
  locations: string[];
  socials: SocialLink[];
  heroHeadline: string;
  heroSubtitle: string;
  ethosEyebrow: string;
  ethosHeadline: string;
  ethosDescription1: string;
  ethosDescription2: string;
  yearsExperience: number;
  worksCount: number;
  hubsCount: number;
  pillars: Pillar[];
  leadership: Leader[];
  footerHeadline: string;
  footerDescription: string;
  ctaText: string;
  ctaLink: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  timeline?: string;
  message: string;
  honeypot?: string;
  turnstileToken?: string;
}

// -------------------------------------------------------------
// Phase 4A & 4B Domain Models
// -------------------------------------------------------------

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  type: 'internal' | 'external' | 'anchor';
  visible: boolean;
  sortOrder: number;
  openInNewTab: boolean;
  parent?: string;
}

export interface PresenceLocation {
  id: string;
  name: string;
  slug: string;
  city: string;
  shortDescription: string;
  description: string;
  heroImage?: string;
  gallery: string[];
  address: string;
  email: string;
  phone: string;
  mapUrl: string;
  latitude?: number;
  longitude?: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

export interface SiteSettings {
  studioName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  defaultEmail: string;
  phone: string;
  address: string;
  socialLinks: Array<{ name: string; url: string }>;
  copyrightText: string;
  footerDescription: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImage?: string;
}

export interface HomePageData {
  showHero: boolean;
  showProjects: boolean;
  showAboutTeaser: boolean;
  showProcess: boolean;
  showServices: boolean;
  showBeforeAfter: boolean;
  showTestimonials: boolean;
  showAwards: boolean;
  showFaq: boolean;
  showInquiry: boolean;
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
}

export interface ServicesPageData {
  heading: string;
  introduction: string;
  ctaText: string;
  ctaLink: string;
  bannerImage?: string;
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
}

export interface ProjectsPageData {
  heading: string;
  introduction: string;
  ctaText: string;
  ctaLink: string;
  bannerImage?: string;
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
}

export interface ContactPageData {
  heading: string;
  introduction: string;
  email: string;
  phone: string;
  officeDetails: string;
  officeHours: string;
  advisoryProtocol: string;
  ctaText: string;
  bannerImage?: string;
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
}

// -------------------------------------------------------------
// Dynamic Page Builder Section Interfaces
// -------------------------------------------------------------

export interface HeroSection {
  __component: 'sections.hero';
  id?: string | number;
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  mobileImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
}

export interface RichTextSection {
  __component: 'sections.rich-text';
  id?: string | number;
  eyebrow?: string;
  heading?: string;
  content: string;
  alignment?: 'left' | 'center' | 'right';
  width?: 'narrow' | 'medium' | 'wide' | 'full';
}

export interface ImageTextSection {
  __component: 'sections.image-text';
  id?: string | number;
  eyebrow?: string;
  heading: string;
  content?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaUrl?: string;
}

export interface FullWidthImageSection {
  __component: 'sections.full-width-image';
  id?: string | number;
  image: string;
  caption?: string;
  altText?: string;
  aspectRatio?: '16:9' | '21:9' | '4:3' | 'auto';
}

export interface ProjectGridSection {
  __component: 'sections.project-grid';
  id?: string | number;
  heading?: string;
  subtitle?: string;
  displayMode?: 'featured' | 'all' | 'category' | 'city';
  selectedCategory?: string;
  selectedCity?: string;
}

export interface ServicesGridSection {
  __component: 'sections.services-grid';
  id?: string | number;
  heading?: string;
  subtitle?: string;
}

export interface PresenceGridSection {
  __component: 'sections.presence-grid';
  id?: string | number;
  heading?: string;
  subtitle?: string;
}

export interface StatisticsSection {
  __component: 'sections.statistics';
  id?: string | number;
  heading?: string;
  stats?: Array<{ value: string; label: string; description?: string }>;
}

export interface ProcessSection {
  __component: 'sections.process';
  id?: string | number;
  heading?: string;
  subtitle?: string;
}

export interface TestimonialsSection {
  __component: 'sections.testimonials';
  id?: string | number;
  heading?: string;
  subtitle?: string;
}

export interface BeforeAfterSection {
  __component: 'sections.before-after';
  id?: string | number;
  heading?: string;
  description?: string;
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export interface AwardsSection {
  __component: 'sections.awards';
  id?: string | number;
  heading?: string;
  subtitle?: string;
}

export interface FAQSection {
  __component: 'sections.faq';
  id?: string | number;
  heading?: string;
  subtitle?: string;
  category?: string;
}

export interface CTASection {
  __component: 'sections.cta';
  id?: string | number;
  eyebrow?: string;
  heading: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  style?: 'dark' | 'terracotta' | 'light' | 'minimal';
}

export interface InquirySection {
  __component: 'sections.inquiry-form';
  id?: string | number;
  heading?: string;
  subtitle?: string;
}

export type PageSection =
  | HeroSection
  | RichTextSection
  | ImageTextSection
  | FullWidthImageSection
  | ProjectGridSection
  | ServicesGridSection
  | PresenceGridSection
  | StatisticsSection
  | ProcessSection
  | TestimonialsSection
  | BeforeAfterSection
  | AwardsSection
  | FAQSection
  | CTASection
  | InquirySection;

export interface Page {
  id: string;
  title: string;
  slug: string;
  navigationLabel?: string;
  showInNavigation: boolean;
  navigationOrder: number;
  sections: PageSection[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  canonicalUrl?: string;
  noIndex: boolean;
}
