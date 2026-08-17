export const STUDIO_INFO = {
  name: 'Inovador Design Studio',
  tagline: 'Architecture · Interiors · Landscapes · Spatial Identities',
  statement: 'Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor.',
  foundedYear: 2018,
  locations: ['Mumbai', 'Goa', 'Bengaluru', 'New Delhi', 'Alibaug'],
  emailPlaceholder: 'studio@example.com',
  phonePlaceholder: '+91 98765 43210',
  addressPlaceholder: 'Studio Inovador, Design District, Mumbai, Maharashtra 400001',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
    { label: 'Architectural Digest', href: 'https://architecturaldigest.in' }
  ]
};

export const NAV_LINKS = [
  { label: 'Projects', href: '/#projects' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/#process' },
  { label: 'Services', href: '/#services' },
  { label: 'Renovations', href: '/#renovations' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' }
];

export const PROJECT_CATEGORIES = ['All', 'Architecture', 'Interior', 'Landscape', 'Branding'] as const;

export const PROJECT_CITIES = ['All', 'Goa', 'Mumbai', 'Bengaluru', 'Alibaug', 'New Delhi'] as const;
