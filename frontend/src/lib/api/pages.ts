import {
  HomePageData,
  ServicesPageData,
  ProjectsPageData,
  ContactPageData,
  Page,
} from '@/types';
import {
  StrapiHomePageItem,
  StrapiServicesPageItem,
  StrapiProjectsPageItem,
  StrapiContactPageItem,
  StrapiPageItem,
} from '@/types/strapi';
import { fetchAPI } from './client';
import {
  normalizeHomePage,
  normalizeServicesPage,
  normalizeProjectsPage,
  normalizeContactPage,
  normalizePage,
} from './normalizers';

export async function getHomePage(): Promise<HomePageData> {
  try {
    const res = await fetchAPI<StrapiHomePageItem>('/api/home-page', {
      params: { populate: '*' },
      tags: ['home-page'],
    });
    if (res && res.data) return normalizeHomePage(res.data);
  } catch (e) {
    console.error('Error fetching HomePage configuration:', e);
  }
  return {
    showHero: true,
    showProjects: true,
    showAboutTeaser: true,
    showProcess: true,
    showServices: true,
    showBeforeAfter: true,
    showTestimonials: true,
    showAwards: true,
    showFaq: true,
    showInquiry: true,
    seoTitle: 'Inovador Design Studio | Luxury Architecture & Interior Practice',
    seoDescription: 'Bespoke residential architecture, private estates, and luxury interior transformations across Mumbai, Goa, Bengaluru, and New Delhi.',
  };
}

export async function getServicesPage(): Promise<ServicesPageData> {
  try {
    const res = await fetchAPI<StrapiServicesPageItem>('/api/services-page', {
      params: { populate: '*' },
      tags: ['services-page'],
    });
    if (res && res.data) return normalizeServicesPage(res.data);
  } catch (e) {
    console.error('Error fetching ServicesPage configuration:', e);
  }
  return {
    heading: 'Architectural Disciplines & Spatial Practice',
    introduction: 'From master-planned residences and private sanctuaries to holistic brand identities, we orchestrate enduring spatial environments with uncompromising material precision.',
    ctaText: 'Initiate Studio Commission',
    ctaLink: '/contact',
    seoTitle: 'Architecture & Interior Design Services | Inovador Design Studio',
    seoDescription: 'Comprehensive architectural design, interior transformation, landscape curation, and spatial branding practices.',
  };
}

export async function getProjectsPage(): Promise<ProjectsPageData> {
  try {
    const res = await fetchAPI<StrapiProjectsPageItem>('/api/projects-page', {
      params: { populate: '*' },
      tags: ['projects-page'],
    });
    if (res && res.data) return normalizeProjectsPage(res.data);
  } catch (e) {
    console.error('Error fetching ProjectsPage configuration:', e);
  }
  return {
    heading: 'Selected Architectural Portfolio',
    introduction: 'A curated archive of monolithic residences, heritage restorations, and bespoke spatial environments across India\'s prime terrains.',
    ctaText: 'Inquire Regarding a Project',
    ctaLink: '/contact',
    seoTitle: 'Architectural Portfolio & Selected Works | Inovador Design Studio',
    seoDescription: 'Explore our portfolio of private sanctuaries, luxury coastal villas, urban residences, and hospitality spaces across Mumbai, Goa, and Bengaluru.',
  };
}

export async function getContactPage(): Promise<ContactPageData> {
  try {
    const res = await fetchAPI<StrapiContactPageItem>('/api/contact-page', {
      params: { populate: '*' },
      tags: ['contact-page'],
    });
    if (res && res.data) return normalizeContactPage(res.data);
  } catch (e) {
    console.error('Error fetching ContactPage configuration:', e);
  }
  return {
    heading: 'Initiate a Spatial Commission',
    introduction: 'We welcome conversations regarding private residential commissions, architectural master planning, and transformative interior projects across India and abroad.',
    email: 'commissions@inovadordesign.com',
    phone: '+91 22 6984 3200',
    officeDetails: 'Mumbai Studio: The Mill District, Lower Parel | Goa Studio: Assagao Heritage Enclave',
    officeHours: 'Monday – Friday: 09:30 – 18:30 IST (By Prior Appointment Only)',
    advisoryProtocol: 'Every commission begins with a comprehensive site appraisal and architectural brief alignment session with our principal partners.',
    ctaText: 'Schedule Advisory Consultation',
    seoTitle: 'Contact & Commission Inquiries | Inovador Design Studio',
    seoDescription: 'Initiate a conversation with our architectural and spatial design studio in Mumbai and Goa.',
  };
}

export async function getPages(): Promise<Page[]> {
  try {
    const res = await fetchAPI<StrapiPageItem[]>('/api/pages', {
      params: {
        'populate[sections][populate]': '*',
        'populate[seoImage]': true,
      },
      tags: ['pages'],
    });
    if (res && Array.isArray(res.data)) {
      return res.data.map(normalizePage);
    }
  } catch (e) {
    console.error('Error fetching dynamic pages:', e);
  }
  return [];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await fetchAPI<StrapiPageItem[]>('/api/pages', {
      params: {
        'populate[sections][populate]': '*',
        'populate[seoImage]': true,
        'filters[slug][$eq]': slug,
      },
      tags: ['pages', `page-${slug}`],
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return normalizePage(res.data[0]);
    }
  } catch (e) {
    console.error(`Error fetching page with slug "${slug}":`, e);
  }
  return null;
}
