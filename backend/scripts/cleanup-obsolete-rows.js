const mysql = require('../node_modules/mysql2/promise');
const jwt = require('../node_modules/jsonwebtoken');

async function cleanupObsoleteRows() {
  console.log('--- Cleaning Up Obsolete Duplicate Raw Rows in MySQL ---');

  const STRAPI_URL = 'http://localhost:1337';
  const ADMIN_JWT_SECRET = 'inovadorAdminJwtSecret_83jfd902jfk29f83j209';
  const token = jwt.sign({ id: 1 }, ADMIN_JWT_SECRET, { expiresIn: '7d' });

  const headers = { Authorization: `Bearer ${token}` };

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'inovador_cms',
  });

  const collections = [
    { table: 'projects', uid: 'api::project.project' },
    { table: 'services', uid: 'api::service.service' },
    { table: 'testimonials', uid: 'api::testimonial.testimonial' },
    { table: 'faqs', uid: 'api::faq.faq' },
    { table: 'hero_slides', uid: 'api::hero-slide.hero-slide' },
    { table: 'process_steps', uid: 'api::process-step.process-step' },
    { table: 'award_presses', uid: 'api::award-press.award-press' },
  ];

  for (const item of collections) {
    const cmRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${item.uid}?page=1&pageSize=100`, { headers });
    const cmData = await cmRes.json();
    const validDocIds = new Set((cmData.results || []).map((d) => d.documentId));

    console.log(`\nTable: ${item.table} | Valid Document IDs in Admin (${validDocIds.size}):`, Array.from(validDocIds));

    const [rows] = await conn.execute(`SELECT id, document_id, created_at FROM \`${item.table}\``);
    console.log(`Total rows in MySQL: ${rows.length}`);

    for (const r of rows) {
      if (!validDocIds.has(r.document_id)) {
        console.log(`Removing obsolete duplicate raw row id=${r.id}, document_id=${r.document_id}...`);
        await conn.execute(`DELETE FROM \`${item.table}\` WHERE id = ?`, [r.id]);
      }
    }
  }

  await conn.end();
  console.log('\n✓ Cleanup of obsolete duplicates complete!');
}

cleanupObsoleteRows().catch(console.error);
