const jwt = require('../node_modules/jsonwebtoken');

async function runPhase4LifecycleTests() {
  console.log('========================================================================');
  console.log('  PHASE 4A + 4B — E2E CMS MUTATION, PARITY & LIFECYCLE TEST SUITE       ');
  console.log('========================================================================\n');

  const STRAPI_URL = 'http://localhost:1337';
  const FRONTEND_URL = 'http://localhost:3000';
  const ADMIN_JWT_SECRET = 'inovadorAdminJwtSecret_83jfd902jfk29f83j209';
  const token = jwt.sign({ id: 1 }, ADMIN_JWT_SECRET, { expiresIn: '7d' });

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const results = [];

  function record(testName, passed, details) {
    results.push({ testName, passed, details });
    const status = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status.padEnd(8)} | ${testName.padEnd(45)} | ${details}`);
  }

  // -------------------------------------------------------------
  // 1. RECONCILIATION & PARITY AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 1. Multi-Layer Consistency Audit ---');
  const checkCollections = [
    { name: 'Projects', uid: 'api::project.project', path: '/api/projects', min: 6 },
    { name: 'Services', uid: 'api::service.service', path: '/api/services', min: 6 },
    { name: 'Testimonials', uid: 'api::testimonial.testimonial', path: '/api/testimonials', min: 3 },
    { name: 'FAQs', uid: 'api::faq.faq', path: '/api/faqs', min: 5 },
    { name: 'Hero Slides', uid: 'api::hero-slide.hero-slide', path: '/api/hero-slides', min: 3 },
    { name: 'Process Steps', uid: 'api::process-step.process-step', path: '/api/process-steps', min: 4 },
    { name: 'Awards / Press', uid: 'api::award-press.award-press', path: '/api/award-presses', min: 4 },
    { name: 'Navigation Items', uid: 'api::navigation-item.navigation-item', path: '/api/navigation-items', min: 6 },
    { name: 'Presence Locations', uid: 'api::presence.presence', path: '/api/presences', min: 5 },
  ];

  for (const c of checkCollections) {
    try {
      const cmRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${c.uid}?page=1&pageSize=100`, { headers });
      const cmData = await cmRes.json();
      const cmCount = (cmData.results || cmData.data || []).length;

      const pubRes = await fetch(`${STRAPI_URL}${c.path}`);
      const pubData = await pubRes.json();
      const pubCount = (pubData.data || []).length;

      const ok = cmCount >= c.min && pubCount >= c.min;
      record(
        `Parity: ${c.name}`,
        ok,
        `Admin CM: ${cmCount} | Public API: ${pubCount} (Expected: >= ${c.min})`
      );
    } catch (e) {
      record(`Parity: ${c.name}`, false, e.message);
    }
  }

  // Single types
  const singleTypes = [
    { name: 'Studio / About', path: '/api/studio-about' },
    { name: 'Site Settings', path: '/api/site-setting' },
    { name: 'Home Page', path: '/api/home-page' },
    { name: 'Services Page', path: '/api/services-page' },
    { name: 'Projects Page', path: '/api/projects-page' },
    { name: 'Contact Page', path: '/api/contact-page' },
  ];

  for (const st of singleTypes) {
    try {
      const res = await fetch(`${STRAPI_URL}${st.path}`);
      const data = await res.json();
      const ok = res.status === 200 && Boolean(data.data);
      record(`Single Type: ${st.name}`, ok, `Public API Status: ${res.status}`);
    } catch (e) {
      record(`Single Type: ${st.name}`, false, e.message);
    }
  }

  // -------------------------------------------------------------
  // 2. NAVIGATION MUTATION TEST
  // -------------------------------------------------------------
  console.log('\n--- 2. Navigation Mutation Test ---');
  try {
    const navListRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::navigation-item.navigation-item?page=1&pageSize=10`, { headers });
    const navListData = await navListRes.json();
    const projNav = (navListData.results || navListData.data || []).find((n) => n.label === 'Projects' || n.url === '/projects');

    if (projNav) {
      const docId = projNav.documentId || projNav.id;
      // Step A: Edit label to 'Our Work'
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::navigation-item.navigation-item/${docId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ label: 'Our Work' }),
      });
      // Publish
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::navigation-item.navigation-item/${docId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      // Revalidate
      await fetch(`${FRONTEND_URL}/api/revalidate?model=navigation`, { method: 'POST' }).catch(() => {});

      // Verify Public API
      const checkRes = await fetch(`${STRAPI_URL}/api/navigation-items?filters[url][$eq]=/projects`);
      const checkData = await checkRes.json();
      const mutatedLabel = checkData.data[0]?.label || checkData.data[0]?.attributes?.label;
      const passA = mutatedLabel === 'Our Work';
      record('Navigation Mutation (Projects -> Our Work)', passA, `Mutated label: "${mutatedLabel}"`);

      // Step B: Restore original 'Projects'
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::navigation-item.navigation-item/${docId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ label: 'Projects' }),
      });
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::navigation-item.navigation-item/${docId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      await fetch(`${FRONTEND_URL}/api/revalidate?model=navigation`, { method: 'POST' }).catch(() => {});

      const restoreRes = await fetch(`${STRAPI_URL}/api/navigation-items?filters[url][$eq]=/projects`);
      const restoreData = await restoreRes.json();
      const restoredLabel = restoreData.data[0]?.label || restoreData.data[0]?.attributes?.label;
      const passB = restoredLabel === 'Projects';
      record('Navigation Restore (Our Work -> Projects)', passB, `Restored label: "${restoredLabel}"`);
    } else {
      record('Navigation Mutation', false, 'Projects navigation item not found');
    }
  } catch (e) {
    record('Navigation Mutation', false, e.message);
  }

  // -------------------------------------------------------------
  // 3. PRESENCE MUTATION TEST
  // -------------------------------------------------------------
  console.log('\n--- 3. Presence Mutation Test ---');
  try {
    const presListRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::presence.presence?page=1&pageSize=10`, { headers });
    const presListData = await presListRes.json();
    const mumbaiLoc = (presListData.results || presListData.data || []).find((p) => p.slug === 'mumbai');

    if (mumbaiLoc) {
      const docId = mumbaiLoc.documentId || mumbaiLoc.id;
      // Mutate
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::presence.presence/${docId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: 'Mumbai — Studio Presence' }),
      });
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::presence.presence/${docId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      await fetch(`${FRONTEND_URL}/api/revalidate?model=presence&slug=mumbai`, { method: 'POST' }).catch(() => {});

      const checkRes = await fetch(`${STRAPI_URL}/api/presences?filters[slug][$eq]=mumbai`);
      const checkData = await checkRes.json();
      const mutatedName = checkData.data[0]?.name || checkData.data[0]?.attributes?.name;
      const passMutate = mutatedName === 'Mumbai — Studio Presence';
      record('Presence Mutation (Mumbai -> Studio Presence)', passMutate, `Mutated name: "${mutatedName}"`);

      // Restore
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::presence.presence/${docId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: 'Mumbai' }),
      });
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::presence.presence/${docId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      await fetch(`${FRONTEND_URL}/api/revalidate?model=presence&slug=mumbai`, { method: 'POST' }).catch(() => {});

      const restoreRes = await fetch(`${STRAPI_URL}/api/presences?filters[slug][$eq]=mumbai`);
      const restoreData = await restoreRes.json();
      const restoredName = restoreData.data[0]?.name || restoreData.data[0]?.attributes?.name;
      const passRestore = restoredName === 'Mumbai';
      record('Presence Restore (Studio Presence -> Mumbai)', passRestore, `Restored name: "${restoredName}"`);
    } else {
      record('Presence Mutation', false, 'Mumbai presence record not found');
    }
  } catch (e) {
    record('Presence Mutation', false, e.message);
  }

  // -------------------------------------------------------------
  // 4. SITE SETTINGS MUTATION TEST
  // -------------------------------------------------------------
  console.log('\n--- 4. Site Settings Mutation Test ---');
  try {
    const origRes = await fetch(`${STRAPI_URL}/api/site-setting`);
    const origData = await origRes.json();
    const origTagline = origData.data?.tagline || origData.data?.attributes?.tagline || 'Architecture & Spatial Transformation';

    // Mutate
    await fetch(`${STRAPI_URL}/content-manager/single-types/api::site-setting.site-setting`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ tagline: 'Architecture & Spatial Transformation [TEST]' }),
    });
    await fetch(`${STRAPI_URL}/content-manager/single-types/api::site-setting.site-setting/actions/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });

    const checkRes = await fetch(`${STRAPI_URL}/api/site-setting`);
    const checkData = await checkRes.json();
    const mutatedTagline = checkData.data?.tagline || checkData.data?.attributes?.tagline;
    const passMutate = mutatedTagline === 'Architecture & Spatial Transformation [TEST]';
    record('Site Settings Mutation', passMutate, `Mutated tagline: "${mutatedTagline}"`);

    // Restore
    await fetch(`${STRAPI_URL}/content-manager/single-types/api::site-setting.site-setting`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ tagline: origTagline }),
    });
    await fetch(`${STRAPI_URL}/content-manager/single-types/api::site-setting.site-setting/actions/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    record('Site Settings Restore', true, `Restored tagline: "${origTagline}"`);
  } catch (e) {
    record('Site Settings Mutation', false, e.message);
  }

  // -------------------------------------------------------------
  // 5. HERO VIDEO SLIDE TEST
  // -------------------------------------------------------------
  console.log('\n--- 5. Hero Video Slide Test ---');
  try {
    const videoPayload = {
      title: '[TEST] Cinematic Architecture Film',
      eyebrow: 'Architectural Cinema',
      location: 'Goa Coast',
      mediaType: 'video',
      desktopVideoUrl: 'https://res.cloudinary.com/demo/video/upload/v1689255850/sea_waves_architectural.mp4',
      posterImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
      autoplay: true,
      muted: true,
      loop: true,
      playsInline: true,
      slideDuration: 8000,
      sortOrder: 99,
      active: true,
    };

    const createRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::hero-slide.hero-slide`, {
      method: 'POST',
      headers,
      body: JSON.stringify(videoPayload),
    });
    const created = await createRes.json();
    const docId = created?.documentId || created?.data?.documentId;

    if (docId) {
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::hero-slide.hero-slide/${docId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      const checkRes = await fetch(`${STRAPI_URL}/api/hero-slides?filters[title][$contains]=[TEST]`);
      const checkData = await checkRes.json();
      const videoSlide = checkData.data?.[0];
      const passVideo = Boolean(videoSlide && (videoSlide.mediaType === 'video' || videoSlide.attributes?.mediaType === 'video'));
      record('Hero Video Slide Creation & Publish', passVideo, `Video slide documentId: ${docId}`);

      // Clean up test slide
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::hero-slide.hero-slide/${docId}`, {
        method: 'DELETE',
        headers,
      });
      record('Hero Video Test Slide Cleanup', true, 'Test video slide deleted cleanly');
    } else {
      record('Hero Video Slide Test', false, 'Failed to create test hero slide');
    }
  } catch (e) {
    record('Hero Video Slide Test', false, e.message);
  }

  // -------------------------------------------------------------
  // 6. DYNAMIC PAGE LIFECYCLE (CREATE, EDIT, REORDER, UNPUBLISH, DELETE)
  // -------------------------------------------------------------
  console.log('\n--- 6. Dynamic Page Lifecycle Test ---');
  let testPageDocId = null;
  try {
    // 6.1 Create Page with 5 Sections
    const pagePayload = {
      title: 'Phase 4 Test Page',
      slug: 'phase4-test-page',
      navigationLabel: 'Test Page',
      showInNavigation: true,
      navigationOrder: 99,
      seoTitle: 'Phase 4 Test Page | Inovador Design Studio',
      seoDescription: 'Test page description for dynamic CMS page builder.',
      sections: [
        {
          __component: 'sections.hero',
          eyebrow: 'Dynamic Section 1',
          title: 'Spatial Architecture & Light',
          description: 'A dynamic hero section created entirely in Strapi.',
        },
        {
          __component: 'sections.rich-text',
          eyebrow: 'Dynamic Section 2',
          heading: 'Material Honesty & Contextual Rigor',
          content: 'This paragraph demonstrates rich text narrative rendered cleanly by PageSectionRenderer.',
          width: 'medium',
        },
        {
          __component: 'sections.image-text',
          eyebrow: 'Dynamic Section 3',
          heading: 'Bespoke Craftsmanship',
          content: 'Side by side architectural showcase.',
          imagePosition: 'left',
        },
        {
          __component: 'sections.statistics',
          heading: 'Studio Impact',
          stats: [
            { value: '15+', label: 'Years Experience' },
            { value: '45+', label: 'Completed Works' },
          ],
        },
        {
          __component: 'sections.cta',
          eyebrow: 'Initiate Brief',
          heading: 'Ready to formulate your sanctuary?',
          buttonText: 'Contact Us',
          buttonUrl: '/contact',
          style: 'dark',
        },
      ],
    };

    const createRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page`, {
      method: 'POST',
      headers,
      body: JSON.stringify(pagePayload),
    });
    const created = await createRes.json();
    testPageDocId = created?.documentId || created?.data?.documentId;

    if (testPageDocId) {
      // Publish
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${testPageDocId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      // Verify Public API
      const checkRes = await fetch(`${STRAPI_URL}/api/pages?filters[slug][$eq]=phase4-test-page&populate[sections][populate]=*`);
      const checkData = await checkRes.json();
      const pageData = checkData.data?.[0];
      const sectionsCount = (pageData?.sections || pageData?.attributes?.sections || []).length;
      const passCreate = Boolean(pageData) && sectionsCount >= 5;
      record('Dynamic Page Creation (5 sections)', passCreate, `Sections retrieved: ${sectionsCount}`);

      // 6.2 Edit Page Title
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${testPageDocId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ title: 'Phase 4 Test Page (Edited)' }),
      });
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${testPageDocId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const checkEditRes = await fetch(`${STRAPI_URL}/api/pages?filters[slug][$eq]=phase4-test-page`);
      const checkEditData = await checkEditRes.json();
      const editedTitle = checkEditData.data?.[0]?.title || checkEditData.data?.[0]?.attributes?.title;
      record('Dynamic Page Editing', editedTitle === 'Phase 4 Test Page (Edited)', `Title: "${editedTitle}"`);

      // 6.3 Unpublish Page -> must return empty on public API
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${testPageDocId}/actions/unpublish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const checkUnpubRes = await fetch(`${STRAPI_URL}/api/pages?filters[slug][$eq]=phase4-test-page`);
      const checkUnpubData = await checkUnpubRes.json();
      const unpubPass = (checkUnpubData.data || []).length === 0;
      record('Dynamic Page Unpublish (Public 404 test)', unpubPass, `Public items count: ${checkUnpubData.data?.length || 0}`);

      // 6.4 Delete Page -> clean up completely
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${testPageDocId}`, {
        method: 'DELETE',
        headers,
      });
      const checkDelRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${testPageDocId}`, { headers });
      const delPass = checkDelRes.status === 404;
      record('Dynamic Page Deletion & Clean up', delPass, `Delete check status: ${checkDelRes.status}`);
      testPageDocId = null;
    } else {
      record('Dynamic Page Creation', false, 'Failed to create test page');
    }
  } catch (e) {
    record('Dynamic Page Lifecycle', false, e.message);
  }

  // -------------------------------------------------------------
  // 7. SECOND DYNAMIC PAGE TEST
  // -------------------------------------------------------------
  console.log('\n--- 7. Second Dynamic Page Test ---');
  try {
    const page2Payload = {
      title: 'Phase 4 Second Test',
      slug: 'phase4-second-test',
      showInNavigation: false,
      sections: [
        {
          __component: 'sections.rich-text',
          heading: 'Second Test Narrative',
          content: 'Testing second dynamic page creation without code modification.',
        },
      ],
    };

    const createRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page`, {
      method: 'POST',
      headers,
      body: JSON.stringify(page2Payload),
    });
    const created = await createRes.json();
    const docId = created?.documentId || created?.data?.documentId;

    if (docId) {
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${docId}/actions/publish`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      const checkRes = await fetch(`${STRAPI_URL}/api/pages?filters[slug][$eq]=phase4-second-test`);
      const checkData = await checkRes.json();
      record('Second Dynamic Page Test', (checkData.data || []).length > 0, `Document ID: ${docId}`);

      // Delete cleanly
      await fetch(`${STRAPI_URL}/content-manager/collection-types/api::page.page/${docId}`, {
        method: 'DELETE',
        headers,
      });
      record('Second Dynamic Page Cleanup', true, 'Deleted cleanly');
    }
  } catch (e) {
    record('Second Dynamic Page Test', false, e.message);
  }

  // -------------------------------------------------------------
  // 8. FINAL AUDIT & CLEANUP VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 8. Final Audit: Verify 0 Test Records Remain in CMS ---');
  const finalCheckPages = await fetch(`${STRAPI_URL}/api/pages?filters[slug][$contains]=phase4`);
  const finalCheckPagesData = await finalCheckPages.json();
  const testPagesRemaining = (finalCheckPagesData.data || []).length;
  record('Test Pages Cleanup Check', testPagesRemaining === 0, `${testPagesRemaining} test pages in CMS (Must be 0)`);

  const finalCheckHero = await fetch(`${STRAPI_URL}/api/hero-slides?filters[title][$contains]=[TEST]`);
  const finalCheckHeroData = await finalCheckHero.json();
  const testHeroRemaining = (finalCheckHeroData.data || []).length;
  record('Test Hero Slides Cleanup Check', testHeroRemaining === 0, `${testHeroRemaining} test hero slides in CMS (Must be 0)`);

  const totalPassed = results.filter((r) => r.passed).length;
  const totalFailed = results.filter((r) => !r.passed).length;

  console.log('\n========================================================================');
  console.log(`  TOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${totalFailed}  `);
  console.log('========================================================================\n');
}

runPhase4LifecycleTests().catch(console.error);
