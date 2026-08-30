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
  NavigationItem,
  PresenceLocation,
  SiteSettings,
  HomePageData,
  ServicesPageData,
  ProjectsPageData,
  PresencePageData,
  ContactPageData,
  Page,
  PageSection,
} from '@/types';
import {
  StrapiMedia,
  StrapiProjectItem,
  StrapiTestimonialItem,
  StrapiServiceItem,
  StrapiFAQItem,
  StrapiHeroSlideItem,
  StrapiProcessStepItem,
  StrapiAwardPressItem,
  StrapiStudioAboutItem,
  StrapiNavigationItem,
  StrapiPresenceItem,
  StrapiSiteSettingsItem,
  StrapiHomePageItem,
  StrapiServicesPageItem,
  StrapiProjectsPageItem,
  StrapiPresencePageItem,
  StrapiContactPageItem,
  StrapiPageItem,
  StrapiPageSectionItem,
} from '@/types/strapi';
import { getMediaUrl, getMediaGalleryUrls } from './client';

export function normalizeProject(raw: StrapiProjectItem): Project {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || item.slug || Math.random());

  const defaultImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';

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
    stats: item.stats
      ? {
          ...item.stats,
          year: typeof item.stats.year === 'number' ? item.stats.year : Number(item.stats.year) || Number(item.year) || undefined,
        }
      : {
          location: item.city,
          year: Number(item.year) || undefined,
        },
    sortOrder: Number(item.sortOrder) || 0,
  };
}

export function normalizeTestimonial(raw: StrapiTestimonialItem): Testimonial {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  let projectReference: string | undefined = undefined;
  if (item.projectReference && typeof item.projectReference === 'string') {
    projectReference = item.projectReference;
  }

  const avatarUrl =
    (typeof item.clientPhoto === 'string' ? item.clientPhoto : getMediaUrl(item.clientPhoto)) ||
    (typeof item.photo === 'string' ? item.photo : getMediaUrl(item.photo)) ||
    (typeof item.avatar === 'string' ? item.avatar : getMediaUrl(item.avatar));

  return {
    id,
    clientName: item.clientName || 'Patron',
    roleOrLocation: item.role || item.roleOrLocation || 'Private Client',
    quote: item.quote || '',
    projectReference,
    avatar: avatarUrl,
    sortOrder: Number(item.sortOrder) || 0,
  };
}

export function normalizeService(raw: StrapiServiceItem): Service {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || item.slug || Math.random());

  const defaultCapabilities = [
    'Concept & Spatial Planning',
    '3D Volumetric Visualization',
    'Material Specification & Sourcing',
    'Site Supervision & Execution',
  ];

  return {
    id,
    name: item.name || 'Architectural Discipline',
    slug: item.slug || 'architectural-discipline',
    shortDescription:
      item.shortDescription || 'Holistic spatial formulations tailored to contextual living.',
    iconName: item.icon || item.iconName || 'Compass',
    deliverables: Array.isArray(item.deliverables) && item.deliverables.length > 0 ? item.deliverables : defaultCapabilities,
    sortOrder: Number(item.sortOrder) || 0,
  };
}

export function normalizeFAQ(raw: StrapiFAQItem): FAQItem {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  return {
    id,
    question: item.question || 'Studio Query',
    answer:
      item.answer ||
      'Please contact our studio drawing rooms for detailed project parameters and fee structures.',
    category: item.category || 'General',
    sortOrder: Number(item.sortOrder) || 0,
  };
}

export function normalizeHeroSlide(raw: StrapiHeroSlideItem): HeroSlide {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  const imageUrl =
    (typeof item.image === 'string' ? item.image : getMediaUrl(item.image)) ||
    item.imageUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85';

  const desktopVideoUrl =
    item.desktopVideoUrl || (typeof item.desktopVideo === 'string' ? item.desktopVideo : getMediaUrl(item.desktopVideo));
  const mobileVideoUrl =
    item.mobileVideoUrl || (typeof item.mobileVideo === 'string' ? item.mobileVideo : getMediaUrl(item.mobileVideo));
  const posterImageUrl =
    item.posterImageUrl || (typeof item.posterImage === 'string' ? item.posterImage : getMediaUrl(item.posterImage));

  return {
    id,
    title: item.title || 'Inovador Design Studio',
    eyebrow: item.eyebrow || 'Architecture · Interiors · Landscapes',
    location: item.location || 'Mumbai & Goa',
    projectSlug: item.projectSlug || 'the-raw-stone-pavilion',
    mediaType: item.mediaType || 'image',
    image: imageUrl,
    desktopVideo: desktopVideoUrl,
    mobileVideo: mobileVideoUrl,
    posterImage: posterImageUrl,
    autoplay: item.autoplay !== false,
    muted: item.muted !== false,
    loop: item.loop !== false,
    playsInline: item.playsInline !== false,
    slideDuration: Number(item.slideDuration) || 6,
    sortOrder: Number(item.sortOrder) || 0,
    active: item.active !== false,
  };
}

export function normalizeProcessStep(raw: StrapiProcessStepItem): ProcessStep {
  const item = raw.attributes || raw;

  return {
    number: String(item.stepNumber || '01'),
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
    publication: item.publication || item.sourceOrJuror || '',
    year: Number(item.year) || new Date().getFullYear(),
    badgeText: item.badgeText || (item.type === 'award' ? 'Design Distinction' : 'Editorial Feature'),
    url: item.url,
    sortOrder: Number(item.sortOrder) || 0,
    active: item.active !== false,
  };
}

export function normalizeStudioAbout(raw: StrapiStudioAboutItem): StudioAbout {
  const item = raw.attributes || raw;

  let pillars: Pillar[] = [];
  if (Array.isArray(item.pillars)) {
    pillars = (item.pillars as Record<string, unknown>[]).map((p, idx) => ({
      title: String(p.title || `Principle 0${idx + 1}`),
      description: String(p.description || ''),
    }));
  } else if (typeof item.pillars === 'string') {
    try {
      const parsed = JSON.parse(item.pillars);
      if (Array.isArray(parsed)) {
        pillars = parsed.map((p, idx) => ({
          title: String(p.title || `Principle 0${idx + 1}`),
          description: String(p.description || ''),
        }));
      }
    } catch {
      pillars = [];
    }
  }

  let leadership: Leader[] = [];
  if (Array.isArray(item.leadership)) {
    leadership = (item.leadership as Record<string, unknown>[]).map((l) => ({
      name: String(l.name || 'Studio Principal'),
      role: String(l.role || 'Design Director'),
      bio: String(l.bio || ''),
      image: typeof l.portrait === 'string' ? l.portrait : getMediaUrl(l.portrait as StrapiMedia) || String(l.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'),
    }));
  } else if (typeof item.leadership === 'string') {
    try {
      const parsed = JSON.parse(item.leadership);
      if (Array.isArray(parsed)) {
        leadership = parsed.map((l) => ({
          name: String(l.name || 'Studio Principal'),
          role: String(l.role || 'Design Director'),
          bio: String(l.bio || ''),
          image: String(l.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'),
        }));
      }
    } catch {
      leadership = [];
    }
  }

  let locations: string[] = ['Mumbai', 'Goa', 'Bengaluru', 'New Delhi', 'Alibaug'];
  if (Array.isArray(item.locations)) {
    locations = item.locations;
  } else if (typeof item.locations === 'string') {
    try {
      locations = JSON.parse(item.locations);
    } catch {
      locations = ['Mumbai', 'Goa', 'Bengaluru', 'New Delhi', 'Alibaug'];
    }
  }

  let socials: { label: string; href: string }[] = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
    { label: 'Architectural Digest', href: 'https://architecturaldigest.in' },
  ];
  if (Array.isArray(item.socials)) {
    socials = (item.socials as Record<string, unknown>[])
      .filter((s) => Boolean(s && (s.label || s.name) && (s.href || s.url)))
      .map((s) => ({
        label: String(s.label || s.name),
        href: String(s.href || s.url),
      }));
  } else if (typeof item.socials === 'string') {
    try {
      const parsed = JSON.parse(item.socials);
      if (Array.isArray(parsed)) {
        socials = parsed.map((s: Record<string, unknown>) => ({
          label: String(s.label || s.name),
          href: String(s.href || s.url),
        }));
      }
    } catch {
      // keep fallback
    }
  }

  return {
    studioName: item.studioName || 'Inovador Design Studio',
    tagline: item.tagline || 'Architecture · Interiors · Landscapes · Spatial Identities',
    statement: item.statement || 'Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor.',
    email: item.email || 'studio@example.com',
    phone: item.phone || '+91 98765 43210',
    mumbaiAddress: item.mumbaiAddress || 'Design District, Kala Ghoda, Mumbai 400001',
    goaAddress: item.goaAddress || 'Studio Pavilion, Anjuna Coastal Road, Goa 403509',
    officeHours: item.officeHours || 'Monday – Friday: 09:30 – 18:30 IST',
    weekendHours: item.weekendHours || 'Saturday: By Private Appointment',
    advisoryProtocol: item.advisoryProtocol || 'Initial consultations are conducted either at our Mumbai/Goa drawing rooms or via private video conference for overseas patrons.',
    locations,
    socials,
    heroHeadline:
      item.heroHeadline || 'Sculpting sanctuaries through raw materiality & contextual rigor.',
    heroSubtitle:
      item.heroSubtitle ||
      'We are an interdisciplinary studio of architects, interior designers, and landscape planners dedicated to creating enduring spaces that celebrate the ritual of daily dwelling.',
    bannerImage: typeof item.bannerImage === 'string' ? item.bannerImage : getMediaUrl(item.bannerImage),
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
    footerHeadline: item.footerHeadline || "Let's formulate your next spatial sanctuary.",
    footerDescription: item.footerDescription || 'We lead residential architecture, private estates, and luxury interior transformations across India and select international locales.',
    ctaText: item.ctaText || 'Start a Commission',
    ctaLink: item.ctaLink || '/#contact',
  };
}

// -------------------------------------------------------------
// Phase 4A & 4B Normalizers
// -------------------------------------------------------------

export function normalizeNavigationItem(raw: StrapiNavigationItem): NavigationItem {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || Math.random());

  return {
    id,
    label: item.label || 'Link',
    url: item.url || '/',
    type: item.type === 'external' ? 'external' : 'internal',
    visible: item.visible !== false,
    sortOrder: Number(item.sortOrder) || 0,
    openInNewTab: Boolean(item.openInNewTab),
    parent: item.parent || undefined,
  };
}

export function normalizePresence(raw: StrapiPresenceItem): PresenceLocation {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || item.slug || Math.random());

  const heroImageUrl =
    typeof item.heroImage === 'string' ? item.heroImage : getMediaUrl(item.heroImage);
  const galleryUrls = getMediaGalleryUrls(item.gallery);

  return {
    id,
    name: item.name || 'Studio Location',
    slug: item.slug || 'studio-location',
    city: item.city || item.name || 'Mumbai',
    shortDescription:
      item.shortDescription ||
      'Dedicated atelier exploring contextual materiality, bespoke residences, and ecological estates.',
    description:
      item.description ||
      item.shortDescription ||
      'Our atelier operates as an immersive design space where clients, master artisans, and architects converge.',
    address: item.address || 'Design District, Kala Ghoda, Mumbai 400001',
    email: item.email || 'studio@inovadordesign.com',
    phone: item.phone || '+91 98765 43210',
    mapUrl: item.mapUrl || 'https://maps.google.com',
    featured: Boolean(item.featured),
    active: item.active !== false,
    sortOrder: Number(item.sortOrder) || 0,
    heroImage:
      heroImageUrl ||
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    gallery: galleryUrls,
    seoTitle: item.seoTitle || `${item.name || 'Studio Atelier'} | Inovador Design Studio`,
    seoDescription:
      item.seoDescription ||
      item.shortDescription ||
      `Explore Inovador Design Studio architectural and interior commissions in ${item.name}.`,
    seoImage: typeof item.seoImage === 'string' ? item.seoImage : getMediaUrl(item.seoImage),
  };
}

export function normalizeSiteSettings(raw: StrapiSiteSettingsItem): SiteSettings {
  const item = raw.attributes || raw;

  let socialLinks: { name: string; url: string }[] = [
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Pinterest', url: 'https://pinterest.com' },
  ];

  if (Array.isArray(item.socialLinks)) {
    socialLinks = item.socialLinks
      .filter((s): s is { name: string; url: string } => Boolean(s && s.name && s.url))
      .map((s) => ({ name: String(s.name), url: String(s.url) }));
  } else if (typeof item.socialLinks === 'string') {
    try {
      const parsed = JSON.parse(item.socialLinks);
      if (Array.isArray(parsed)) {
        socialLinks = parsed
          .filter((s) => s && s.name && s.url)
          .map((s) => ({ name: String(s.name), url: String(s.url) }));
      }
    } catch {
      // keep fallback
    }
  }

  return {
    studioName: item.studioName || 'Inovador Design Studio',
    tagline: item.tagline || 'Architecture · Interiors · Landscapes',
    defaultEmail: item.defaultEmail || 'studio@inovadordesign.com',
    phone: item.phone || '+91 98765 43210',
    address: item.address || 'Kala Ghoda, Mumbai · Anjuna Coastal Road, Goa',
    logo: typeof item.logo === 'string' ? item.logo : getMediaUrl(item.logo),
    favicon: typeof item.favicon === 'string' ? item.favicon : getMediaUrl(item.favicon),
    socialLinks,
    copyrightText: item.copyrightText || `© ${new Date().getFullYear()} Inovador Design Studio. All rights reserved.`,
    footerDescription:
      item.footerDescription ||
      'An interdisciplinary architecture and interior practice sculpting timeless sanctuaries through raw materiality, natural daylight, and contextual rigor.',
    defaultSeoTitle: item.defaultSeoTitle || 'Inovador Design Studio | Architecture & Spatial Design',
    defaultSeoDescription:
      item.defaultSeoDescription ||
      'Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor across Mumbai, Goa, Bengaluru, and Alibaug.',
    defaultOgImage:
      typeof item.defaultOgImage === 'string' ? item.defaultOgImage : getMediaUrl(item.defaultOgImage),
  };
}

export function normalizeHomePage(raw: StrapiHomePageItem): HomePageData {
  const item = raw.attributes || raw;

  return {
    showHero: item.showHero !== false,
    showProjects: item.showProjects !== false,
    showAboutTeaser: item.showAboutTeaser !== false,
    showProcess: item.showProcess !== false,
    showServices: item.showServices !== false,
    showBeforeAfter: Boolean(item.showBeforeAfter),
    showTestimonials: item.showTestimonials !== false,
    showAwards: item.showAwards !== false,
    showFaq: item.showFaq !== false,
    showInquiry: item.showInquiry !== false,
    seoTitle: item.seoTitle || 'Inovador Design Studio | Architecture & Spatial Design',
    seoDescription: item.seoDescription || 'Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor.',
    seoImage: typeof item.seoImage === 'string' ? item.seoImage : getMediaUrl(item.seoImage),
  };
}

export function normalizeServicesPage(raw: StrapiServicesPageItem): ServicesPageData {
  const item = raw.attributes || raw;

  return {
    heading: item.heading || 'Disciplines & Spatial Capabilities',
    introduction:
      item.introduction ||
      'From monolithic residential architecture to bespoke private interior environments, our practice is defined by material honesty and structural stillness.',
    ctaText: item.ctaText || 'Commission a Spatial Brief',
    ctaLink: item.ctaLink || '/#contact',
    bannerImage: typeof item.bannerImage === 'string' ? item.bannerImage : getMediaUrl(item.bannerImage),
    seoTitle: item.seoTitle || 'Disciplines & Capabilities | Inovador Design Studio',
    seoDescription:
      item.seoDescription ||
      'Explore architectural, interior, landscape, and spatial identity services by Inovador Design Studio.',
    seoImage: typeof item.seoImage === 'string' ? item.seoImage : getMediaUrl(item.seoImage),
  };
}

export function normalizeProjectsPage(raw: StrapiProjectsPageItem): ProjectsPageData {
  const item = raw.attributes || raw;

  return {
    heading: item.heading || 'Selected Works & Commissions',
    introduction:
      item.introduction ||
      'A curated collection of residential sanctuaries, coastal retreats, and commercial ateliers sculpted with raw materiality.',
    ctaText: item.ctaText || 'Discuss a Project Commission',
    ctaLink: item.ctaLink || '/#contact',
    bannerImage: typeof item.bannerImage === 'string' ? item.bannerImage : getMediaUrl(item.bannerImage),
    seoTitle: item.seoTitle || 'Selected Works & Architecture Portfolio | Inovador Design Studio',
    seoDescription:
      item.seoDescription ||
      'Explore the architectural and interior portfolio of Inovador Design Studio across Mumbai, Goa, and Alibaug.',
    seoImage: typeof item.seoImage === 'string' ? item.seoImage : getMediaUrl(item.seoImage),
  };
}

export function normalizePresencePage(raw: StrapiPresencePageItem): PresencePageData {
  const item = raw.attributes || raw;

  return {
    heading: item.heading || 'Studio Presence & Regional Ateliers',
    introduction:
      item.introduction ||
      'Operating from our primary drawing rooms in Mumbai and Goa, we orchestrate residential commissions, private estates, and hospitality retreats across India’s most distinctive topographies.',
    ctaText: item.ctaText || 'Inquire Regarding Studio Presence',
    ctaLink: item.ctaLink || '/contact',
    bannerImage: typeof item.bannerImage === 'string' ? item.bannerImage : getMediaUrl(item.bannerImage),
    seoTitle: item.seoTitle || 'Studio Presence & Atelier Locations | Inovador Design Studio',
    seoDescription:
      item.seoDescription ||
      'Explore our geographic presence and regional architectural practices across Mumbai, Goa, Bengaluru, New Delhi, and Alibaug.',
    seoImage: typeof item.seoImage === 'string' ? item.seoImage : getMediaUrl(item.seoImage),
  };
}

export function normalizeContactPage(raw: StrapiContactPageItem): ContactPageData {
  const item = raw.attributes || raw;

  return {
    heading: item.heading || 'Initiate a Commission Brief',
    introduction:
      item.introduction ||
      'We welcome inquiries for private residences, luxury hospitality, spatial identity, and bespoke interior commissions.',
    email: item.email || 'studio@inovadordesign.com',
    phone: item.phone || '+91 98765 43210',
    officeDetails: item.officeDetails || 'Ateliers in Mumbai (Kala Ghoda) & Goa (Anjuna)',
    officeHours: item.officeHours || 'Monday – Friday: 09:30 – 18:30 IST',
    advisoryProtocol:
      item.advisoryProtocol ||
      'Initial consultations are conducted by appointment at our studio drawing rooms or via secure video conference for international patrons.',
    ctaText: item.ctaText || 'Submit Spatial Inquiry',
    bannerImage: typeof item.bannerImage === 'string' ? item.bannerImage : getMediaUrl(item.bannerImage),
    seoTitle:
      item.seoTitle ||
      'Contact & Commission Inquiries | Inovador Design Studio',
    seoDescription:
      item.seoDescription ||
      'Get in touch with Inovador Design Studio to initiate your residential architecture or interior transformation project.',
    seoImage: typeof item.seoImage === 'string' ? item.seoImage : getMediaUrl(item.seoImage),
  };
}

export function normalizePageSection(raw: StrapiPageSectionItem): PageSection | null {
  if (!raw || !raw.__component) return null;

  switch (raw.__component) {
    case 'sections.hero':
      return {
        __component: 'sections.hero',
        id: raw.id,
        eyebrow: raw.eyebrow,
        title: raw.title || 'Architectural Journey',
        description: raw.description,
        image: typeof raw.image === 'string' ? raw.image : getMediaUrl(raw.image),
        mobileImage: typeof raw.mobileImage === 'string' ? raw.mobileImage : getMediaUrl(raw.mobileImage),
        ctaText: raw.ctaText,
        ctaUrl: raw.ctaUrl,
        alignment: raw.alignment || 'left',
        overlay: raw.overlay !== false,
      };

    case 'sections.rich-text':
      return {
        __component: 'sections.rich-text',
        id: raw.id,
        eyebrow: raw.eyebrow,
        heading: raw.heading,
        content: raw.content || '',
        alignment: raw.alignment || 'left',
        width: raw.width || 'medium',
      };

    case 'sections.image-text':
      return {
        __component: 'sections.image-text',
        id: raw.id,
        eyebrow: raw.eyebrow,
        heading: raw.heading || '',
        content: raw.content,
        image: typeof raw.image === 'string' ? raw.image : getMediaUrl(raw.image),
        imagePosition: raw.imagePosition || 'left',
        ctaText: raw.ctaText,
        ctaUrl: raw.ctaUrl,
      };

    case 'sections.full-width-image':
      return {
        __component: 'sections.full-width-image',
        id: raw.id,
        image: (typeof raw.image === 'string' ? raw.image : getMediaUrl(raw.image)) || '',
        caption: raw.caption,
        altText: raw.altText,
        aspectRatio: raw.aspectRatio || '21:9',
      };

    case 'sections.project-grid':
      return {
        __component: 'sections.project-grid',
        id: raw.id,
        heading: raw.heading || 'Featured Works',
        subtitle: raw.subtitle,
        displayMode: raw.displayMode || 'featured',
        selectedCategory: raw.selectedCategory,
        selectedCity: raw.selectedCity,
      };

    case 'sections.services-grid':
      return {
        __component: 'sections.services-grid',
        id: raw.id,
        heading: raw.heading || 'Disciplines & Practices',
        subtitle: raw.subtitle,
      };

    case 'sections.presence-grid':
      return {
        __component: 'sections.presence-grid',
        id: raw.id,
        heading: raw.heading || 'Geographic Presence',
        subtitle: raw.subtitle,
      };

    case 'sections.statistics':
      let stats: Array<{ label: string; value: string; description?: string }> = [];
      if (Array.isArray(raw.stats)) {
        stats = raw.stats;
      } else if (typeof raw.stats === 'string') {
        try {
          stats = JSON.parse(raw.stats);
        } catch {
          stats = [];
        }
      }
      return {
        __component: 'sections.statistics',
        id: raw.id,
        heading: raw.heading,
        stats: Array.isArray(stats) ? stats : [],
      };

    case 'sections.process':
      return {
        __component: 'sections.process',
        id: raw.id,
        heading: raw.heading || 'Methodology & Precision',
        subtitle: raw.subtitle,
      };

    case 'sections.testimonials':
      return {
        __component: 'sections.testimonials',
        id: raw.id,
        heading: raw.heading || 'Client Endorsements',
        subtitle: raw.subtitle,
      };

    case 'sections.before-after':
      return {
        __component: 'sections.before-after',
        id: raw.id,
        heading: raw.heading || 'Spatial Metamorphosis',
        description: raw.description,
        beforeImage: typeof raw.beforeImage === 'string' ? raw.beforeImage : getMediaUrl(raw.beforeImage),
        afterImage: typeof raw.afterImage === 'string' ? raw.afterImage : getMediaUrl(raw.afterImage),
        beforeLabel: raw.beforeLabel || 'Before',
        afterLabel: raw.afterLabel || 'After',
      };

    case 'sections.awards':
      return {
        __component: 'sections.awards',
        id: raw.id,
        heading: raw.heading || 'Distinctions & Editorial',
        subtitle: raw.subtitle,
      };

    case 'sections.faq':
      return {
        __component: 'sections.faq',
        id: raw.id,
        heading: raw.heading || 'Frequently Inquired',
        subtitle: raw.subtitle,
        category: raw.category,
      };

    case 'sections.cta':
      return {
        __component: 'sections.cta',
        id: raw.id,
        eyebrow: raw.eyebrow,
        heading: raw.heading || 'Initiate Studio Brief',
        description: raw.description,
        buttonText: raw.buttonText || 'Initiate Studio Brief',
        buttonUrl: raw.buttonUrl || '/contact',
        image: typeof raw.image === 'string' ? raw.image : getMediaUrl(raw.image),
        style: raw.style || 'dark',
      };

    case 'sections.inquiry-form':
      return {
        __component: 'sections.inquiry-form',
        id: raw.id,
        heading: raw.heading || 'Commission an Inquiry',
        subtitle: raw.subtitle || 'Tell us about your spatial aspirations, site coordinates, and timeline.',
      };

    default:
      return null;
  }
}

export function normalizePage(raw: StrapiPageItem): Page {
  const item = raw.attributes || raw;
  const id = String(raw.id || raw.documentId || item.slug || Math.random());

  const sections: PageSection[] = [];
  if (Array.isArray(item.sections)) {
    item.sections.forEach((sectionRaw) => {
      const sec = normalizePageSection(sectionRaw);
      if (sec) sections.push(sec);
    });
  }

  return {
    id,
    title: item.title || 'Studio Page',
    slug: item.slug || 'page',
    navigationLabel: item.navigationLabel,
    showInNavigation: Boolean(item.showInNavigation),
    navigationOrder: Number(item.navigationOrder) || 0,
    sections,
    seoTitle: item.seoTitle || `${item.title || 'Page'} | Inovador Design Studio`,
    seoDescription:
      item.seoDescription ||
      `Explore ${item.title || 'Inovador Design Studio'} architectural practices and portfolio.`,
    seoImage: typeof item.seoImage === 'string' ? item.seoImage : getMediaUrl(item.seoImage),
    canonicalUrl: item.canonicalUrl,
    noIndex: Boolean(item.noIndex),
  };
}
