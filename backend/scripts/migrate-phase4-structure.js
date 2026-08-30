const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('../node_modules/jsonwebtoken');

async function migratePhase4Structure() {
  console.log('================================================================');
  console.log('  PHASE 4A + 4B — STRAPI V5 CMS STRUCTURE & CONTENT MIGRATION  ');
  console.log('================================================================\n');

  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'inovadorAdminJwtSecret_83jfd902jfk29f83j209';
  const token = jwt.sign({ id: 1 }, ADMIN_JWT_SECRET, { expiresIn: '7d' });

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Helper to upload an image to Strapi Media Library
  async function uploadImageFromUrl(imageUrl, filename) {
    if (!imageUrl) return null;
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
        console.log(`✓ Uploaded media "${filename}" (id: ${data[0].id}, documentId: ${data[0].documentId})`);
        return data[0];
      }
    } catch (e) {
      console.error(`Media upload error for ${filename}:`, e.message);
    }
    return null;
  }

  // 1. Grant Public Permissions
  console.log('\n--- 1. Granting Public API Permissions ---');
  const rolesRes = await fetch(`${STRAPI_URL}/users-permissions/roles`, { headers });
  const rolesData = await rolesRes.json();
  const publicRole = rolesData.roles?.find((r) => r.type === 'public');

  if (publicRole) {
    const roleDetailRes = await fetch(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, { headers });
    const roleDetail = await roleDetailRes.json();
    const perms = roleDetail.role.permissions;

    const newTypes = [
      { name: 'navigation-item', actions: ['find', 'findOne'] },
      { name: 'presence', actions: ['find', 'findOne'] },
      { name: 'page', actions: ['find', 'findOne'] },
      { name: 'site-setting', actions: ['find'] },
      { name: 'home-page', actions: ['find'] },
      { name: 'services-page', actions: ['find'] },
      { name: 'projects-page', actions: ['find'] },
      { name: 'contact-page', actions: ['find'] },
      { name: 'hero-slide', actions: ['find', 'findOne'] },
    ];

    for (const item of newTypes) {
      const apiUid = `api::${item.name}.${item.name}`;
      if (!perms[apiUid]) perms[apiUid] = { controllers: {} };
      if (!perms[apiUid].controllers[item.name]) perms[apiUid].controllers[item.name] = {};
      for (const act of item.actions) {
        perms[apiUid].controllers[item.name][act] = { enabled: true };
      }
    }

    await fetch(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ permissions: perms }),
    });
    console.log('✓ Public API permissions configured for all Phase 4 content types.');
  }

  // Helper to create and publish document via Content Manager
  async function createAndPublish(uid, data, label) {
    const createRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const created = await createRes.json();
    const docId = created?.documentId || created?.data?.documentId;
    if (!docId) {
      console.error(`Failed to create ${uid} (${label}):`, JSON.stringify(created));
      return null;
    }
    // Publish
    const pubRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}/${docId}/actions/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    const published = await pubRes.json();
    console.log(`✓ [${uid}] Created & Published: "${label}" (documentId: ${docId})`);
    return { documentId: docId };
  }

  // Helper for single types
  async function updateAndPublishSingleType(uid, data, label) {
    const updateRes = await fetch(`${STRAPI_URL}/content-manager/single-types/${uid}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    const updated = await updateRes.json();
    await fetch(`${STRAPI_URL}/content-manager/single-types/${uid}/actions/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    console.log(`✓ [${uid}] Configured & Published Single Type: "${label}"`);
    return updated;
  }

  // Helper to clear existing documents in a collection via Content Manager
  async function clearCollection(uid) {
    const listRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}?page=1&pageSize=100`, { headers });
    const listData = await listRes.json();
    const results = listData.results || listData.data || [];
    if (results.length > 0) {
      console.log(`Clearing ${results.length} existing documents in ${uid}...`);
      for (const doc of results) {
        const docId = doc.documentId || doc.id;
        await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}/${docId}`, {
          method: 'DELETE',
          headers,
        });
      }
    }
  }

  // 2. Migrate Navigation Items (6 initial items)
  console.log('\n--- 2. Migrating Navigation Items ---');
  await clearCollection('api::navigation-item.navigation-item');

  const navItems = [
    { label: 'Home', url: '/', type: 'internal', sortOrder: 1, visible: true, openInNewTab: false },
    { label: 'Projects', url: '/projects', type: 'internal', sortOrder: 2, visible: true, openInNewTab: false },
    { label: 'About', url: '/about', type: 'internal', sortOrder: 3, visible: true, openInNewTab: false },
    { label: 'Services', url: '/services', type: 'internal', sortOrder: 4, visible: true, openInNewTab: false },
    { label: 'Presence', url: '/presence', type: 'internal', sortOrder: 5, visible: true, openInNewTab: false },
    { label: 'Contact', url: '/contact', type: 'internal', sortOrder: 6, visible: true, openInNewTab: false },
  ];

  for (const nav of navItems) {
    await createAndPublish('api::navigation-item.navigation-item', nav, nav.label);
  }

  // 3. Migrate Presence Locations (5 initial locations)
  console.log('\n--- 3. Migrating Presence Locations ---');
  await clearCollection('api::presence.presence');

  const presenceItems = [
    {
      name: 'Mumbai',
      slug: 'mumbai',
      city: 'Mumbai',
      shortDescription: 'Monolithic coastal residences and urban penthouses framed by basalt stone and Arabian sea light.',
      description: 'Our Mumbai atelier serves as the primary epicenter for high-density luxury residential architecture, private coastal compounds across Worli and Bandra, and monolithic commercial transformations.',
      address: 'Studio 04, The Mill District, Lower Parel, Mumbai, Maharashtra 400013',
      email: 'mumbai@inovadordesign.com',
      phone: '+91 22 6984 3200',
      mapUrl: 'https://maps.google.com/?q=Lower+Parel+Mumbai',
      latitude: 18.9986,
      longitude: 72.8258,
      featured: true,
      active: true,
      sortOrder: 1,
      seoTitle: 'Mumbai Architecture Studio | Inovador Design Studio',
      seoDescription: 'Bespoke residential architecture and luxury interior design in Mumbai.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
      imageName: 'presence_mumbai_hero.jpg',
    },
    {
      name: 'Goa',
      slug: 'goa',
      city: 'Goa',
      shortDescription: 'Verdant tropical villas and heritage restorations nestled among Goan laterite stone and coconut groves.',
      description: 'Our Goa design practice crafts immersive holiday retreats, contemporary private villas in Assagao, and sensitive Portuguese heritage restorations across North and South Goa.',
      address: 'Villa 12, Assagao Badem Enclave, Assagao, Goa 403507',
      email: 'goa@inovadordesign.com',
      phone: '+91 832 295 4100',
      mapUrl: 'https://maps.google.com/?q=Assagao+Goa',
      latitude: 15.5898,
      longitude: 73.7744,
      featured: true,
      active: true,
      sortOrder: 2,
      seoTitle: 'Goa Architecture & Villa Design | Inovador Design Studio',
      seoDescription: 'Luxury tropical residences and architectural transformations in Goa.',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
      imageName: 'presence_goa_hero.jpg',
    },
    {
      name: 'Bengaluru',
      slug: 'bengaluru',
      city: 'Bengaluru',
      shortDescription: 'Courtyard residences and biophilic urban homes integrating indigenous garden courtyards.',
      description: 'Engaging with Bengaluru’s dynamic climate, we engineer private residences centered around climate-responsive central courtyards, rain cascades, and perforated stone lattices.',
      address: 'Level 3, Lavelle Spatial Quarter, Lavelle Road, Bengaluru, Karnataka 560001',
      email: 'bengaluru@inovadordesign.com',
      phone: '+91 80 4120 7800',
      mapUrl: 'https://maps.google.com/?q=Lavelle+Road+Bengaluru',
      latitude: 12.9716,
      longitude: 77.5946,
      featured: true,
      active: true,
      sortOrder: 3,
      seoTitle: 'Bengaluru Architecture Practice | Inovador Design Studio',
      seoDescription: 'Courtyard homes and contemporary residences in Bengaluru.',
      imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1800&q=85',
      imageName: 'presence_bengaluru_hero.jpg',
    },
    {
      name: 'New Delhi',
      slug: 'new-delhi',
      city: 'New Delhi',
      shortDescription: 'Monumental private estates, brick-clad pavilions, and expansive farmhouses in the NCR region.',
      description: 'Specializing in expansive private estate master planning and monolithic brick residences across Chhatarpur and Sultanpur, framing vast landscape axes with timeless materiality.',
      address: 'The Pavilion Atelier, Mehrauli Estate Road, New Delhi 110030',
      email: 'delhi@inovadordesign.com',
      phone: '+91 11 4982 6600',
      mapUrl: 'https://maps.google.com/?q=Mehrauli+New+Delhi',
      latitude: 28.5244,
      longitude: 77.1855,
      featured: false,
      active: true,
      sortOrder: 4,
      seoTitle: 'New Delhi Luxury Estate Architecture | Inovador Design Studio',
      seoDescription: 'Private estate master planning and monumental architecture in New Delhi.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
      imageName: 'presence_delhi_hero.jpg',
    },
    {
      name: 'Alibaug',
      slug: 'alibaug',
      city: 'Alibaug',
      shortDescription: 'Secluded seaside compounds and agrarian coastal estates connected across Mumbai bay.',
      description: 'Directly across Mumbai bay, our Alibaug atelier conceives private beachfront compounds, exposed concrete pavilions, and sustainable agrarian landscape integrations for weekend sanctuaries.',
      address: 'Awas Coastal Enclave, Awas-Sasawane Road, Alibaug, Maharashtra 402201',
      email: 'alibaug@inovadordesign.com',
      phone: '+91 2141 283 500',
      mapUrl: 'https://maps.google.com/?q=Awas+Alibaug',
      latitude: 18.7887,
      longitude: 72.8682,
      featured: false,
      active: true,
      sortOrder: 5,
      seoTitle: 'Alibaug Seaside Estates & Architecture | Inovador Design Studio',
      seoDescription: 'Bespoke coastal architecture and private sanctuaries in Alibaug.',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
      imageName: 'presence_alibaug_hero.jpg',
    },
  ];

  for (const item of presenceItems) {
    const media = await uploadImageFromUrl(item.imageUrl, item.imageName);
    const payload = {
      name: item.name,
      slug: item.slug,
      city: item.city,
      shortDescription: item.shortDescription,
      description: item.description,
      address: item.address,
      email: item.email,
      phone: item.phone,
      mapUrl: item.mapUrl,
      latitude: item.latitude,
      longitude: item.longitude,
      featured: item.featured,
      active: item.active,
      sortOrder: item.sortOrder,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      heroImage: media?.id ? { id: media.id } : null,
    };

    await createAndPublish('api::presence.presence', payload, item.name);
  }

  // 4. Migrate Site Settings
  console.log('\n--- 4. Migrating Site Settings ---');
  await updateAndPublishSingleType('api::site-setting.site-setting', {
    studioName: 'Inovador Design Studio',
    tagline: 'Architecture & Spatial Transformation',
    defaultEmail: 'contact@inovadordesign.com',
    phone: '+91 22 6984 3200',
    address: 'Studio 04, The Mill District, Lower Parel, Mumbai, Maharashtra 400013',
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com' },
      { name: 'LinkedIn', url: 'https://linkedin.com' },
      { name: 'Pinterest', url: 'https://pinterest.com' },
    ],
    copyrightText: '© 2026 Inovador Design Studio. All rights reserved.',
    footerDescription: 'We lead residential architecture, private estates, and luxury interior transformations across India and select international locales.',
    defaultSeoTitle: 'Inovador Design Studio | Architecture & Spatial Design',
    defaultSeoDescription: 'A bespoke architecture and spatial design practice crafting monolithic residences, refined interiors, and branded spatial environments.',
  }, 'Site Settings');

  // 5. Migrate Home Page
  console.log('\n--- 5. Migrating Home Page Configuration ---');
  await updateAndPublishSingleType('api::home-page.home-page', {
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
  }, 'Home Page');

  // 6. Migrate Services Page
  console.log('\n--- 6. Migrating Services Page Configuration ---');
  await updateAndPublishSingleType('api::services-page.services-page', {
    heading: 'Architectural Disciplines & Spatial Practice',
    introduction: 'From master-planned residences and private sanctuaries to holistic brand identities, we orchestrate enduring spatial environments with uncompromising material precision.',
    ctaText: 'Initiate Studio Commission',
    ctaLink: '/contact',
    seoTitle: 'Architecture & Interior Design Services | Inovador Design Studio',
    seoDescription: 'Comprehensive architectural design, interior transformation, landscape curation, and spatial branding practices.',
  }, 'Services Page');

  // 7. Migrate Projects Page
  console.log('\n--- 7. Migrating Projects Page Configuration ---');
  await updateAndPublishSingleType('api::projects-page.projects-page', {
    heading: 'Selected Architectural Portfolio',
    introduction: 'A curated archive of monolithic residences, heritage restorations, and bespoke spatial environments across India\'s prime terrains.',
    ctaText: 'Inquire Regarding a Project',
    ctaLink: '/contact',
    seoTitle: 'Architectural Portfolio & Selected Works | Inovador Design Studio',
    seoDescription: 'Explore our portfolio of private sanctuaries, luxury coastal villas, urban residences, and hospitality spaces across Mumbai, Goa, and Bengaluru.',
  }, 'Projects Page');

  // 8. Migrate Contact Page
  console.log('\n--- 8. Migrating Contact Page Configuration ---');
  await updateAndPublishSingleType('api::contact-page.contact-page', {
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
  }, 'Contact Page');

  console.log('\n================================================================');
  console.log('  PHASE 4 STRUCTURE & CONTENT MIGRATION COMPLETED SUCCESSFULLY  ');
  console.log('================================================================\n');
}

migratePhase4Structure().catch(console.error);
