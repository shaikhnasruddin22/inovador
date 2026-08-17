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

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface AwardOrPress {
  id: string;
  title: string;
  publication: string;
  year: number;
  badgeText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
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
