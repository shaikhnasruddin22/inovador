const mysql = require('../node_modules/mysql2/promise');
const jwt = require('../node_modules/jsonwebtoken');

async function verifyAllThreeLayers() {
  const secret = 'inovadorAdminJwtSecret_83jfd902jfk29f83j209';
  const token = jwt.sign({ id: 1 }, secret, { expiresIn: '7d' });

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'inovador_cms',
  });

  const collections = [
    { name: 'Projects', table: 'projects', uid: 'api::project.project', api: '/api/projects?populate=*', expected: 6 },
    { name: 'Services', table: 'services', uid: 'api::service.service', api: '/api/services?sort[0]=sortOrder:asc', expected: 6 },
    { name: 'Testimonials', table: 'testimonials', uid: 'api::testimonial.testimonial', api: '/api/testimonials?populate=*&sort[0]=sortOrder:asc', expected: 3 },
    { name: 'FAQs', table: 'faqs', uid: 'api::faq.faq', api: '/api/faqs?sort[0]=sortOrder:asc', expected: 5 },
    { name: 'Hero Slides', table: 'hero_slides', uid: 'api::hero-slide.hero-slide', api: '/api/hero-slides?populate=*&sort[0]=sortOrder:asc', expected: 3 },
    { name: 'Process Steps', table: 'process_steps', uid: 'api::process-step.process-step', api: '/api/process-steps?sort[0]=sortOrder:asc', expected: 4 },
    { name: 'Awards / Press', table: 'award_presses', uid: 'api::award-press.award-press', api: '/api/award-presses?sort[0]=sortOrder:asc', expected: 4 },
    { name: 'Studio / About Single Type', table: 'studio_abouts', uid: 'api::studio-about.studio-about', isSingle: true, api: '/api/studio-about', expected: 1 },
    { name: 'Inquiries', table: 'inquiries', uid: 'api::inquiry.inquiry', api: '/content-manager/collection-types/api::inquiry.inquiry?page=1&pageSize=10', expected: 8 },
  ];

  console.log('========================================================================================================');
  console.log('                 THREE-LAYER CONSISTENCY MATRIX (MYSQL vs ADMIN CM vs PUBLIC API)                       ');
  console.log('========================================================================================================\n');

  let allPassed = true;
  for (const c of collections) {
    // 1. MySQL distinct document_ids
    const [sqlRows] = await conn.execute(`SELECT COUNT(DISTINCT document_id) as count FROM \`${c.table}\``);
    const sqlCount = sqlRows[0].count;

    // 2. Admin Content Manager
    const cmUrl = c.isSingle
      ? `http://localhost:1337/content-manager/single-types/${c.uid}`
      : `http://localhost:1337/content-manager/collection-types/${c.uid}?page=1&pageSize=10`;
    const cmRes = await fetch(cmUrl, { headers: { Authorization: `Bearer ${token}` } });
    const cmData = await cmRes.json();
    const cmCount = c.isSingle ? (cmData.data ? 1 : 0) : (cmData.pagination?.total ?? (cmData.results ? cmData.results.length : 0));

    // 3. Public REST API
    let apiCount = 0;
    if (c.api) {
      const apiRes = await fetch(`http://localhost:1337${c.api}`, {
        headers: c.api.startsWith('/content-manager') ? { Authorization: `Bearer ${token}` } : {},
      });
      const apiData = await apiRes.json();
      apiCount = Array.isArray(apiData.data) ? apiData.data.length : (apiData.data ? 1 : (apiData.pagination?.total ?? apiData.results?.length ?? 0));
    }

    const pass = sqlCount === c.expected && cmCount === c.expected && apiCount === c.expected;
    if (!pass) allPassed = false;

    console.log(
      (pass ? '✓ PASS ' : '✗ FAIL ').padEnd(8) +
      c.name.padEnd(28) +
      ' | MySQL: ' + String(sqlCount).padStart(2) + '/' + c.expected +
      ' | Admin CM: ' + String(cmCount).padStart(2) + '/' + c.expected +
      ' | Public API: ' + String(apiCount).padStart(2) + '/' + c.expected
    );
  }

  console.log('\nAll 9 Models Consistent Across MySQL, Admin CM, and Public API:', allPassed ? 'YES (100% PASS)' : 'NO');
  await conn.end();
}

verifyAllThreeLayers().catch(console.error);
