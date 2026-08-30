import { StudioAbout } from '@/types';
import { StrapiStudioAboutItem } from '@/types/strapi';
import { fetchAPI } from './client';
import { normalizeStudioAbout } from './normalizers';

export const defaultStudioAbout: StudioAbout = {
  studioName: 'Inovador Design Studio',
  tagline: 'Architecture · Interiors · Landscapes · Spatial Identities',
  statement: 'Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor.',
  email: 'studio@example.com',
  phone: '+91 98765 43210',
  mumbaiAddress: 'Design District, Kala Ghoda, Mumbai 400001',
  goaAddress: 'Studio Pavilion, Anjuna Coastal Road, Goa 403509',
  officeHours: 'Monday – Friday: 09:30 – 18:30 IST',
  weekendHours: 'Saturday: By Private Appointment',
  advisoryProtocol: 'Initial consultations are conducted either at our Mumbai/Goa drawing rooms or via private video conference for overseas patrons.',
  locations: ['Mumbai', 'Goa', 'Bengaluru', 'New Delhi', 'Alibaug'],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
    { label: 'Architectural Digest', href: 'https://architecturaldigest.in' },
  ],
  heroHeadline: 'Sculpting sanctuaries through raw materiality & contextual rigor.',
  heroSubtitle:
    'We are an interdisciplinary studio of architects, interior designers, and landscape planners dedicated to creating enduring spaces that celebrate the ritual of daily dwelling.',
  ethosEyebrow: 'The Inovador Ethos',
  ethosHeadline: 'Architecture grounded in material honesty & spatial stillness.',
  ethosDescription1:
    'Founded in 2018, Inovador Design Studio is an architecture and spatial practice operating across Mumbai, Goa, Bengaluru, and Alibaug. We reject arbitrary decoration in favor of structural clarity, native masonry, and the tactile poetry of natural daylight.',
  ethosDescription2:
    'Every project is approached as an ecological and cultural artifact—forged through deep collaboration with master craftsmen, stone masons, and local fabricators.',
  yearsExperience: 6,
  worksCount: 40,
  hubsCount: 5,
  pillars: [
    {
      title: 'Material Honesty & Structural Clarity',
      description:
        'We let materials speak their natural dialect. Basalt stone remains textured, lime-plaster breathes with the seasons, and raw timber patinas gracefully over decades.',
    },
    {
      title: 'Contextual & Biophilic Architecture',
      description:
        'Every building is an organic extension of its landscape. We study sun paths, monsoon wind corridors, and topography to craft passive microclimates that reduce ecological footprint.',
    },
    {
      title: 'Artisanal Craft & Millimeter Tolerances',
      description:
        'We bridge architectural design with traditional master craftsmanship. Every joint, reveal, and bespoke brass fixture is engineered with couture precision.',
    },
    {
      title: 'Spatial Restraint & Quiet Luxury',
      description:
        'We avoid transient trends and superfluous ornamentation. True luxury is found in generous proportions, rhythmic daylight, and spaces that invite quiet reflection.',
    },
  ],
  leadership: [
    {
      name: 'Aarav Mehta',
      role: 'Principal Architect & Founder',
      bio: 'Trained at the Architectural Association (AA London) and CEPT Ahmedabad, Aarav brings over 14 years of experience formulating monolithic residential villas and public pavilions across South Asia.',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Rhea Sengupta',
      role: 'Director of Interior Architecture & Spatial Identity',
      bio: 'Specializing in heritage restoration and bespoke material curation, Rhea oversees all interior joinery, bespoke lighting engineering, and art advisory commissions at Inovador.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    },
  ],
  footerHeadline: "Let's formulate your next spatial sanctuary.",
  footerDescription:
    'We lead residential architecture, private estates, and luxury interior transformations across India and select international locales.',
  ctaText: 'Start a Commission',
  ctaLink: '/#contact',
};

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function getStudioAbout(): Promise<StudioAbout> {
  if (USE_MOCK) {
    return defaultStudioAbout;
  }

  try {
    const response = await fetchAPI<StrapiStudioAboutItem>('/api/studio-about', {
      tags: ['studio-about'],
      revalidate: 3600,
    });

    if (response && response.data) {
      return normalizeStudioAbout(response.data);
    }
  } catch (error) {
    console.error('Error fetching StudioAbout from Strapi:', error);
  }

  return defaultStudioAbout;
}
