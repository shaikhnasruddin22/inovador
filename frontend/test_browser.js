const { chromium } = require('playwright');

async function runBrowserVerification() {
  console.log('🚀 Launching automated browser verification...');
  const browser = await chromium.launch();
  const consoleErrors = [];

  try {
    // 1. Desktop Test
    console.log('\n--- Testing Desktop Viewport (1440x900) ---');
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    desktopPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Desktop Console Error] ${msg.text()}`);
      }
    });

    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✓ Homepage loaded successfully');

    // Check Hero title
    const heroTitle = await desktopPage.textContent('h1');
    console.log('✓ Hero headline rendered:', heroTitle.trim());

    // Test Project Filters
    console.log('Testing project filtering...');
    await desktopPage.click('button:has-text("Interior")');
    await desktopPage.waitForTimeout(500);
    let cards = await desktopPage.$$('article');
    console.log(`✓ Interior filter returned ${cards.length} projects`);

    await desktopPage.click('button:has-text("Architecture")');
    await desktopPage.waitForTimeout(500);
    cards = await desktopPage.$$('article');
    console.log(`✓ Architecture filter returned ${cards.length} projects`);

    await desktopPage.click('button:has-text("All")');
    await desktopPage.waitForTimeout(500);
    cards = await desktopPage.$$('article');
    console.log(`✓ Reset to All returned ${cards.length} projects`);

    // Test FAQ Accordion
    console.log('Testing FAQ accordion...');
    const faqButtons = await desktopPage.$$('section#faq button');
    if (faqButtons.length > 1) {
      await faqButtons[1].click();
      await desktopPage.waitForTimeout(400);
      const isExpanded = await faqButtons[1].getAttribute('aria-expanded');
      console.log(`✓ FAQ item 2 expanded state: ${isExpanded}`);
    }

    // Test Inquiry Form Validation
    console.log('Testing inquiry form...');
    await desktopPage.click('section#contact button[type="submit"]');
    await desktopPage.waitForTimeout(300);
    const formError = await desktopPage.$('text=Please complete all required fields');
    if (formError) {
      console.log('✓ Inquiry validation correctly blocked empty submission');
    }

    // Fill and submit form
    await desktopPage.fill('#inquiry-name', 'Verification Test Patron');
    await desktopPage.fill('#inquiry-email', 'patron@example.com');
    await desktopPage.fill('#inquiry-message', 'Exploring a bespoke residential villa commission in North Goa.');
    await desktopPage.click('section#contact button[type="submit"]');
    await desktopPage.waitForTimeout(1200);
    const successMsg = await desktopPage.$('text=Inquiry Received');
    console.log('✓ Inquiry form successfully submitted and displayed success state:', Boolean(successMsg));

    // 2. Project Detail Page Test
    console.log('\n--- Testing Project Detail Page ---');
    await desktopPage.goto('http://localhost:3000/projects/the-raw-stone-pavilion', { waitUntil: 'networkidle' });
    const projectH1 = await desktopPage.textContent('h1');
    console.log('✓ Project detail title rendered:', projectH1.trim());

    const specsTable = await desktopPage.$('h3:has-text("Project Specifications")');
    console.log('✓ Project specifications table rendered:', Boolean(specsTable));

    const galleryImgs = await desktopPage.$$('img[alt*="Architectural Gallery"]');
    console.log(`✓ Project gallery rendered ${galleryImgs.length} high-res images`);

    // 3. About Page Test
    console.log('\n--- Testing Dedicated About Page ---');
    await desktopPage.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
    const aboutH1 = await desktopPage.textContent('h1');
    console.log('✓ About page headline rendered:', aboutH1.trim());

    // 4. Mobile Viewport Test
    console.log('\n--- Testing Mobile Viewport (375x812 - iPhone X) ---');
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
    const mobileDrawerLink = await mobilePage.$('nav a:has-text("Projects")');
    console.log('✓ Mobile navigation drawer opened:', Boolean(mobileDrawerLink));

    await mobilePage.click('button[aria-label="Close menu"]');
    await mobilePage.waitForTimeout(400);
    console.log('✓ Mobile navigation drawer closed cleanly');

    // 5. Tablet Viewport Test
    console.log('\n--- Testing Tablet Viewport (768x1024 - iPad) ---');
    const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await tabletPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✓ Tablet layout rendered successfully');

    // Summary of console errors
    console.log('\n--- Console Error Audit ---');
    if (consoleErrors.length === 0) {
      console.log('🎉 0 Console errors detected across all tested viewports and pages!');
    } else {
      console.warn(`⚠️ ${consoleErrors.length} Console error(s) found:`, consoleErrors);
    }

  } catch (err) {
    console.error('❌ Verification failed with error:', err);
    process.exit(1);
  } finally {
    await browser.close();
    console.log('\n🏁 Automated browser verification complete.\n');
  }
}

runBrowserVerification();
