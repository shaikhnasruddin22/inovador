const jwt = require('../node_modules/jsonwebtoken');
const path = require('path');
const fs = require('fs');

async function repairAllStrapiDocuments() {
  console.log('======================================================');
  console.log('  PHASE 3.8 — REPAIR STRAPI V5 ADMIN CONTENT MANAGER  ');
  console.log('======================================================\n');

  const STRAPI_URL = 'http://localhost:1337';
  const ADMIN_JWT_SECRET = 'inovadorAdminJwtSecret_83jfd902jfk29f83j209';
  const token = jwt.sign({ id: 1 }, ADMIN_JWT_SECRET, { expiresIn: '7d' });

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const frontendDataDir = path.resolve(__dirname, '../../frontend/src/data');

  // Cache for uploaded media files by URL
  const mediaCache = new Map();

  // Helper to fetch an image and upload to Strapi Media Library
  async function uploadImageFromUrl(imageUrl, filename) {
    if (!imageUrl) return null;
    if (mediaCache.has(imageUrl)) {
      return mediaCache.get(imageUrl);
    }

    try {
      console.log(`Downloading and uploading media: ${filename}...`);
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());

      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('files', blob, filename);

      const uploadRes = await fetch(`${STRAPI_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await uploadRes.json();
      if (data && data[0]?.id) {
        mediaCache.set(imageUrl, data[0]);
        console.log(`✓ Uploaded media "${filename}" (id: ${data[0].id}, documentId: ${data[0].documentId})`);
        return data[0];
      }
    } catch (e) {
      console.error(`Media upload error for ${filename}:`, e.message);
    }
    return null;
  }

  // Helper to clear existing documents in a collection via Content Manager
  async function clearCollection(uid) {
    const listRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}?page=1&pageSize=100`, { headers });
    const listData = await listRes.json();
    if (listData.results && listData.results.length > 0) {
      console.log(`Clearing ${listData.results.length} existing documents in ${uid}...`);
      for (const doc of listData.results) {
        if (doc.documentId) {
          await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}/${doc.documentId}`, {
            method: 'DELETE',
            headers,
          });
        }
      }
    }
  }

  // Helper to create and publish a collection document
  async function createAndPublish(uid, itemData, label) {
    const createRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(itemData),
    });
    const createJson = await createRes.json();

    if (!createRes.ok || !createJson.data?.documentId) {
      console.error(`Failed to create item in ${uid} (${label}):`, JSON.stringify(createJson, null, 2));
      return null;
    }

    const documentId = createJson.data.documentId;

    // Publish document
    const pubRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}/${documentId}/actions/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    const pubJson = await pubRes.json();

    console.log(`✓ [${uid}] Created & Published: "${label}" (documentId: ${documentId})`);
    return documentId;
  }

  // ----------------------------------------------------
  // 1. REPAIR PROJECTS (6 Records)
  // ----------------------------------------------------
  console.log('\n--- 1. Repairing Projects ---');
  await clearCollection('api::project.project');
  const rawProjects = JSON.parse(fs.readFileSync(path.join(frontendDataDir, 'projects.json'), 'utf8'));
  const projectDocMap = new Map();

  for (const p of rawProjects) {
    const coverMedia = await uploadImageFromUrl(p.coverImage, `${p.slug}-cover.jpg`);
    const galleryMedia = [];
    if (p.gallery && Array.isArray(p.gallery)) {
      for (let i = 0; i < p.gallery.length; i++) {
        const gMedia = await uploadImageFromUrl(p.gallery[i], `${p.slug}-gallery-${i + 1}.jpg`);
        if (gMedia) galleryMedia.push(gMedia.id);
      }
    }
    const beforeMedia = p.beforeImage ? await uploadImageFromUrl(p.beforeImage, `${p.slug}-before.jpg`) : null;
    const afterMedia = p.afterImage ? await uploadImageFromUrl(p.afterImage, `${p.slug}-after.jpg`) : null;

    const docId = await createAndPublish(
      'api::project.project',
      {
        title: p.title,
        slug: p.slug,
        city: p.city,
        category: p.category,
        year: p.year,
        shortDescription: p.shortDescription,
        description: p.fullDescription,
        coverImage: coverMedia?.id,
        gallery: galleryMedia,
        beforeImage: beforeMedia?.id,
        afterImage: afterMedia?.id,
        featured: p.featured ?? false,
        sortOrder: p.sortOrder ?? 0,
        stats: p.stats ?? {},
      },
      p.title
    );
    if (docId) {
      projectDocMap.set(p.title, docId);
      projectDocMap.set(p.slug, docId);
    }
  }

  // ----------------------------------------------------
  // 2. REPAIR SERVICES (6 Records)
  // ----------------------------------------------------
  console.log('\n--- 2. Repairing Services ---');
  await clearCollection('api::service.service');
  const rawServices = JSON.parse(fs.readFileSync(path.join(frontendDataDir, 'services.json'), 'utf8'));
  for (const s of rawServices) {
    await createAndPublish(
      'api::service.service',
      {
        name: s.name,
        slug: s.slug,
        iconName: s.iconName,
        shortDescription: s.shortDescription,
        deliverables: s.deliverables,
        sortOrder: s.sortOrder ?? 0,
      },
      s.name
    );
  }

  // ----------------------------------------------------
  // 3. REPAIR TESTIMONIALS (3 Records)
  // ----------------------------------------------------
  console.log('\n--- 3. Repairing Testimonials ---');
  await clearCollection('api::testimonial.testimonial');
  const rawTestimonials = JSON.parse(fs.readFileSync(path.join(frontendDataDir, 'testimonials.json'), 'utf8'));
  for (const t of rawTestimonials) {
    const avatarMedia = t.avatar ? await uploadImageFromUrl(t.avatar, `${t.clientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-avatar.jpg`) : null;
    const targetProjectDocId = projectDocMap.get(t.projectReference);

    await createAndPublish(
      'api::testimonial.testimonial',
      {
        clientName: t.clientName,
        quote: t.quote,
        roleOrLocation: t.roleOrLocation,
        projectReference: targetProjectDocId || null,
        photo: avatarMedia?.id,
        sortOrder: t.sortOrder ?? 0,
      },
      t.clientName
    );
  }

  // ----------------------------------------------------
  // 4. REPAIR FAQS (5 Records)
  // ----------------------------------------------------
  console.log('\n--- 4. Repairing FAQs ---');
  await clearCollection('api::faq.faq');
  const rawFaqs = JSON.parse(fs.readFileSync(path.join(frontendDataDir, 'faq.json'), 'utf8'));
  for (const f of rawFaqs) {
    await createAndPublish(
      'api::faq.faq',
      {
        question: f.question,
        answer: f.answer,
        category: f.category ?? 'General',
        sortOrder: f.sortOrder ?? 0,
      },
      f.question
    );
  }

  // ----------------------------------------------------
  // 5. REPAIR HERO SLIDES (3 Records)
  // ----------------------------------------------------
  console.log('\n--- 5. Repairing Hero Slides ---');
  await clearCollection('api::hero-slide.hero-slide');
  const heroSlides = [
    {
      title: 'Architecture in Dialogue with Landscape & Sea',
      eyebrow: 'Private Coastal Residence',
      location: 'Anjuna, Goa',
      projectSlug: 'the-raw-stone-pavilion',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
      sortOrder: 1,
      active: true,
    },
    {
      title: 'Art Deco Proportions & Tactile Travertine Marble',
      eyebrow: 'Heritage Interior Architecture',
      location: 'Marine Drive, Mumbai',
      projectSlug: 'apartment-702-marine-drive',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
      sortOrder: 2,
      active: true,
    },
    {
      title: 'Monolithic Courtyard Estate',
      eyebrow: 'Monolithic Courtyard Estate',
      location: 'Awas, Alibaug',
      projectSlug: 'courtyard-house-of-light',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop',
      sortOrder: 3,
      active: true,
    },
  ];
  for (let i = 0; i < heroSlides.length; i++) {
    const s = heroSlides[i];
    const heroMedia = await uploadImageFromUrl(s.image, `hero-slide-${i + 1}.jpg`);
    await createAndPublish(
      'api::hero-slide.hero-slide',
      {
        title: s.title,
        eyebrow: s.eyebrow,
        location: s.location,
        projectSlug: s.projectSlug,
        image: heroMedia?.id,
        imageUrl: s.image,
        sortOrder: s.sortOrder,
        active: s.active,
      },
      s.title
    );
  }

  // ----------------------------------------------------
  // 6. REPAIR PROCESS STEPS (4 Records)
  // ----------------------------------------------------
  console.log('\n--- 6. Repairing Process Steps ---');
  await clearCollection('api::process-step.process-step');
  const rawProcess = JSON.parse(fs.readFileSync(path.join(frontendDataDir, 'process.json'), 'utf8'));
  for (let i = 0; i < rawProcess.length; i++) {
    const p = rawProcess[i];
    await createAndPublish(
      'api::process-step.process-step',
      {
        stepNumber: p.number,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        sortOrder: i + 1,
        active: true,
      },
      p.title
    );
  }

  // ----------------------------------------------------
  // 7. REPAIR AWARDS & PRESS (4 Records)
  // ----------------------------------------------------
  console.log('\n--- 7. Repairing Awards & Press ---');
  await clearCollection('api::award-press.award-press');
  const rawAwards = JSON.parse(fs.readFileSync(path.join(frontendDataDir, 'awards.json'), 'utf8'));
  for (let i = 0; i < rawAwards.length; i++) {
    const a = rawAwards[i];
    await createAndPublish(
      'api::award-press.award-press',
      {
        title: a.title,
        publication: a.publication,
        year: a.year,
        badgeText: a.badgeText,
        sortOrder: i + 1,
        active: true,
      },
      a.title
    );
  }

  // ----------------------------------------------------
  // 8. REPAIR STUDIO / ABOUT SINGLE TYPE (1 Record)
  // ----------------------------------------------------
  console.log('\n--- 8. Repairing Studio / About Single Type ---');
  const studioAboutData = {
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
    heroSubtitle: 'We are an interdisciplinary studio of architects, interior designers, and landscape planners dedicated to creating enduring spaces that celebrate the ritual of daily dwelling.',
    ethosEyebrow: 'The Inovador Ethos',
    ethosHeadline: 'Architecture grounded in material honesty & spatial stillness.',
    ethosDescription1: 'Founded in 2018, Inovador Design Studio is an architecture and spatial practice operating across Mumbai, Goa, Bengaluru, and Alibaug. We reject arbitrary decoration in favor of structural clarity, native masonry, and the tactile poetry of natural daylight.',
    ethosDescription2: 'Every project is approached as an ecological and cultural artifact—forged through deep collaboration with master craftsmen, stone masons, and local fabricators.',
    yearsExperience: 6,
    worksCount: 40,
    hubsCount: 5,
    pillars: [
      {
        title: 'Material Honesty & Structural Clarity',
        description: 'We let materials speak their natural dialect. Basalt stone remains textured, lime-plaster breathes with the seasons, and raw timber patinas gracefully over decades.',
      },
      {
        title: 'Contextual & Biophilic Architecture',
        description: 'Every building is an organic extension of its landscape. We study sun paths, monsoon wind corridors, and topography to craft passive microclimates that reduce ecological footprint.',
      },
      {
        title: 'Artisanal Craft & Millimeter Tolerances',
        description: 'We bridge architectural design with traditional master craftsmanship. Every joint, reveal, and bespoke brass fixture is engineered with couture precision.',
      },
      {
        title: 'Spatial Restraint & Quiet Luxury',
        description: 'We avoid transient trends and superfluous ornamentation. True luxury is found in generous proportions, rhythmic daylight, and spaces that invite quiet reflection.',
      },
    ],
    leadership: [
      {
        name: 'Aarav Mehta',
        role: 'Principal Architect & Founder',
        bio: 'Trained at the Architectural Association (AA London) and CEPT Ahmedabad, Aarav brings over 14 years of experience formulating monolithic residential villas and public pavilions across South Asia.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Rhea Sengupta',
        role: 'Director of Interior Architecture & Spatial Identity',
        bio: 'Specializing in heritage restoration and bespoke material curation, Rhea oversees all interior joinery, bespoke lighting engineering, and art advisory commissions at Inovador.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      },
    ],
    footerHeadline: "Let's formulate your next spatial sanctuary.",
    footerDescription: 'We lead residential architecture, private estates, and luxury interior transformations across India and select international locales.',
    ctaText: 'Start a Commission',
    ctaLink: '/#contact',
  };

  const aboutPutRes = await fetch(`${STRAPI_URL}/content-manager/single-types/api::studio-about.studio-about`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(studioAboutData),
  });
  const aboutJson = await aboutPutRes.json();
  if (aboutJson.data?.documentId) {
    await fetch(`${STRAPI_URL}/content-manager/single-types/api::studio-about.studio-about/actions/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
  }
  console.log(`✓ [api::studio-about.studio-about] Created & Published Single Type: "${studioAboutData.studioName}"`);

  console.log('\n======================================================');
  console.log('   ALL 8 CONTENT TYPES REPAIRED AND PUBLISHED!       ');
  console.log('======================================================\n');
}

repairAllStrapiDocuments().catch((err) => {
  console.error('Repair script failed:', err);
  process.exit(1);
});
