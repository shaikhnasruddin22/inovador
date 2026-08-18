const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========================================================================');
console.log('  PRODUCTION AUDIT: SECRET & CREDENTIAL SCAN                           ');
console.log('========================================================================\n');

const repoRoot = path.resolve(__dirname, '..');
const files = execSync('git ls-files', { cwd: repoRoot, encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((f) => f.trim())
  .filter(Boolean);

const patterns = [
  { name: 'STRAPI_READ_TOKEN value', regex: /STRAPI_READ_TOKEN\s*=\s*['"][a-zA-Z0-9_\-\.]{20,}['"]/ },
  { name: 'RESEND_API_KEY value', regex: /re_[a-zA-Z0-9_]{20,}/ },
  { name: 'TURNSTILE_SECRET_KEY value', regex: /0x4AAAAAA[a-zA-Z0-9_\-]{15,}/ },
  { name: 'CLOUDINARY_SECRET value', regex: /CLOUDINARY_API_SECRET\s*=\s*['"][a-zA-Z0-9]{15,}['"]/i },
  { name: 'DATABASE_PASSWORD value', regex: /DATABASE_PASSWORD\s*=\s*['"][^'"]+['"]/ },
  { name: 'Private Key PEM', regex: /-----BEGIN (RSA )?PRIVATE KEY-----/ },
  { name: 'NEXT_PUBLIC Secret Leak', regex: /NEXT_PUBLIC_(STRAPI_READ_TOKEN|RESEND_API_KEY|TURNSTILE_SECRET|REVALIDATE_SECRET|DATABASE_PASSWORD|CLOUDINARY_SECRET)/i },
];

let leaks = 0;
for (const file of files) {
  if (file.endsWith('.lock') || file.includes('package-lock.json') || file.includes('audit-secrets.js')) continue;
  const fullPath = path.join(repoRoot, file);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');

  for (const p of patterns) {
    if (p.regex.test(content)) {
      console.error(`✗ LEAK FOUND: ${p.name} in ${file}`);
      leaks++;
    }
  }
}

if (leaks === 0) {
  console.log('✓ PASS: 0 production secrets found in tracked repository files.\n');
} else {
  console.error(`✗ FAIL: ${leaks} potential secret leak(s) identified!\n`);
}

// Check .next/static bundle for secret leakage
console.log('--- Client Bundle Secret Exposure Scan (.next/static) ---');
const staticDir = path.join(repoRoot, 'frontend', '.next', 'static');
let clientBundleLeaks = 0;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.html'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('inovadorAdminJwtSecret') || content.includes('STRAPI_READ_TOKEN') || content.includes('REVALIDATE_SECRET')) {
        console.error(`✗ CLIENT LEAK: Private token keyword found in client bundle ${entry.name}`);
        clientBundleLeaks++;
      }
    }
  }
}

scanDir(staticDir);
if (clientBundleLeaks === 0) {
  console.log('✓ PASS: 0 private server tokens exposed in .next/static client bundles.\n');
} else {
  console.error(`✗ FAIL: ${clientBundleLeaks} private token(s) found in client bundles!\n`);
}
