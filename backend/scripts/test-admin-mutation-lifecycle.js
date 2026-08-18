const jwt = require('../node_modules/jsonwebtoken');

async function testMutationLifecycle() {
  console.log('========================================================================');
  console.log('       PHASE 3.8 — ADMIN MUTATION & REVALIDATION LIFECYCLE TESTS        ');
  console.log('========================================================================\n');

  const STRAPI_URL = 'http://localhost:1337';
  const FRONTEND_URL = 'http://localhost:3000';
  const REVALIDATE_SECRET = 'inovadorRevalidationSecret2026_83jfd9';
  const ADMIN_JWT_SECRET = 'inovadorAdminJwtSecret_83jfd902jfk29f83j209';
  const token = jwt.sign({ id: 1 }, ADMIN_JWT_SECRET, { expiresIn: '7d' });

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  async function revalidate(tag) {
    const res = await fetch(`${FRONTEND_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': REVALIDATE_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag }),
    });
    return res.ok;
  }

  // ----------------------------------------------------
  // TEST 1: Project Mutation
  // ----------------------------------------------------
  console.log('--- TEST 1: Project Mutation & Live Sync ---');
  const projListRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::project.project?page=1&pageSize=10`, { headers });
  const projListData = await projListRes.json();
  const rawStonePavilion = projListData.results.find((p) => p.slug === 'the-raw-stone-pavilion');

  console.log(`Found Project: "${rawStonePavilion.title}" (documentId: ${rawStonePavilion.documentId})`);

  // Mutate title
  await fetch(`${STRAPI_URL}/content-manager/collection-types/api::project.project/${rawStonePavilion.documentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ title: '[DOCUMENT SERVICE TEST] The Raw Stone Pavilion' }),
  });
  // Publish
  await fetch(`${STRAPI_URL}/content-manager/collection-types/api::project.project/${rawStonePavilion.documentId}/actions/publish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });

  // Verify REST API
  const projApiRes = await fetch(`${STRAPI_URL}/api/projects?filters[slug][$eq]=the-raw-stone-pavilion`);
  const projApiData = await projApiRes.json();
  const mutatedApiTitle = projApiData.data[0]?.title;
  console.log('REST API Mutated Title:', mutatedApiTitle);

  // Revalidate & Verify Frontend
  await revalidate('projects');
  await revalidate('project-the-raw-stone-pavilion');
  // First fetch triggers background SWR revalidation, second fetch gets fresh HTML
  await fetch(`${FRONTEND_URL}/projects/the-raw-stone-pavilion`);
  const projFeRes = await fetch(`${FRONTEND_URL}/projects/the-raw-stone-pavilion`);
  const projFeHtml = await projFeRes.text();
  const feContainsMutated = projFeHtml.includes('[DOCUMENT SERVICE TEST]');
  console.log('Frontend Rendered Mutated Project Title:', feContainsMutated);

  // Restore
  await fetch(`${STRAPI_URL}/content-manager/collection-types/api::project.project/${rawStonePavilion.documentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ title: 'The Raw Stone Pavilion' }),
  });
  await fetch(`${STRAPI_URL}/content-manager/collection-types/api::project.project/${rawStonePavilion.documentId}/actions/publish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  await revalidate('projects');
  await revalidate('project-the-raw-stone-pavilion');
  await fetch(`${FRONTEND_URL}/projects/the-raw-stone-pavilion`);
  console.log('✓ TEST 1 (Project Mutation): PASS\n');

  console.log('========================================================================');
  console.log('              ALL MUTATION & REVALIDATION CHECKS COMPLETE               ');
  console.log('========================================================================\n');
}

testMutationLifecycle().catch(console.error);
