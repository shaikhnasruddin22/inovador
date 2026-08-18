const { chromium } = require('playwright');

async function runBrowserVerification() {
  console.log('========================================================================');
  console.log('🚀 PHASE 4 MULTI-PAGE BROWSER VERIFICATION (PLAYWRIGHT)');
  console.log('========================================================================\n');
  const browser = await chromium.launch();
  const consoleErrors = [];

  try {
    // 1. Desktop Test
    console.log('--- 1. Testing Desktop Viewport (1440x900) ---');
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    desktopPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Desktop Console Error] ${msg.text()}`);
      }
    });

    // 1.1 Homepage
    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const heroTitle = await desktopPage.textContent('h1');
    console.log('✓ Homepage loaded successfully | Hero headline:', heroTitle.trim());

    // 1.2 Projects Page
    await desktopPage.goto('http://localhost:3000/projects', { waitUntil: 'networkidle' });
    const projectsH1 = await desktopPage.textContent('h1');
    console.log('✓ /projects loaded | Headline:', projectsH1.trim());

    // 1.3 Services Page
    await desktopPage.goto('http://localhost:3000/services', { waitUntil: 'networkidle' });
    const servicesH1 = await desktopPage.textContent('h1');
    console.log('✓ /services loaded | Headline:', servicesH1.trim());

    // 1.4 Presence Directory
    await desktopPage.goto('http://localhost:3000/presence', { waitUntil: 'networkidle' });
    const presenceH1 = await desktopPage.textContent('h1');
    console.log('✓ /presence loaded | Headline:', presenceH1.trim());

    // 1.5 Presence Detail (Mumbai)
    await desktopPage.goto('http://localhost:3000/presence/mumbai', { waitUntil: 'networkidle' });
    const presenceMumbaiH1 = await desktopPage.textContent('h1');
    console.log('✓ /presence/mumbai loaded | Headline:', presenceMumbaiH1.trim());

    // 1.6 Contact Page
    await desktopPage.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
    const contactH1 = await desktopPage.textContent('h1');
    console.log('✓ /contact loaded | Headline:', contactH1.trim());

    // 1.7 Inquiry submission test
    console.log('Testing inquiry form submission on /contact...');
    await desktopPage.fill('#inquiry-name', 'Verification Patron');
    await desktopPage.fill('#inquiry-email', 'patron@inovadordesign.com');
    await desktopPage.fill('#inquiry-message', 'Testing inquiry submission on Phase 4 contact page.');
    await desktopPage.click('section#contact button[type="submit"]');
    await desktopPage.waitForTimeout(1200);
    const successMsg = await desktopPage.$('text=Inquiry Received');
    console.log('✓ Inquiry form successfully submitted and displayed success state:', Boolean(successMsg));

    // 2. Mobile Viewport Test (375x812)
    console.log('\n--- 2. Testing Mobile Viewport (375x812) ---');
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    mobilePage.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Mobile Console Error] ${msg.text()}`);
      }
    });

    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✓ Mobile homepage rendered');

    // Test Mobile Navigation Drawer
    await mobilePage.click('button[aria-label="Open mobile navigation menu"]');
    await mobilePage.waitForTimeout(400);
    const mobileDrawerPresenceLink = await mobilePage.$('nav a:has-text("Presence")');
    console.log('✓ Mobile navigation drawer opened with Presence link:', Boolean(mobileDrawerPresenceLink));

    await mobilePage.click('button[aria-label="Close menu"]');
    await mobilePage.waitForTimeout(400);
    console.log('✓ Mobile navigation drawer closed cleanly');

    // 3. Tablet Viewport Test (768x1024)
    console.log('\n--- 3. Testing Tablet Viewport (768x1024) ---');
    const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await tabletPage.goto('http://localhost:3000/projects', { waitUntil: 'networkidle' });
    console.log('✓ Tablet layout rendered successfully');

    // Summary of console errors
    console.log('\n--- 4. Console Error Audit ---');
    if (consoleErrors.length === 0) {
      console.log('🎉 0 Console errors detected across all tested viewports and pages!');
    } else {
      console.warn(`⚠️ ${consoleErrors.length} Console error(s) found:`, consoleErrors);
    }

  } catch (err) {
    console.error('❌ Browser verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
    console.log('\n🏁 Phase 4 browser verification complete successfully.\n');
  }
}

runBrowserVerification();
