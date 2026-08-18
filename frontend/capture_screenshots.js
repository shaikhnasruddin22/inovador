const { chromium } = require('playwright');
const path = require('path');

async function captureArtifactScreenshots() {
  const artifactDir = 'C:\\Users\\TNMT\\.gemini\\antigravity\\brain\\b6186508-a8b4-4305-9fbb-0e238adfca58';
  const browser = await chromium.launch();

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // 1. Desktop Homepage
    console.log('Capturing Desktop Homepage...');
    await desktop.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_home.png'), fullPage: false });

    // 2. Desktop Projects Archive
    console.log('Capturing Desktop Projects Archive...');
    await desktop.goto('http://localhost:3000/projects', { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_projects.png'), fullPage: false });

    // 3. Desktop Services Overview
    console.log('Capturing Desktop Services Overview...');
    await desktop.goto('http://localhost:3000/services', { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_services.png'), fullPage: false });

    // 4. Desktop Presence Directory
    console.log('Capturing Desktop Presence Directory...');
    await desktop.goto('http://localhost:3000/presence', { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_presence.png'), fullPage: false });

    // 5. Desktop Presence Detail (Mumbai)
    console.log('Capturing Desktop Presence Detail (Mumbai)...');
    await desktop.goto('http://localhost:3000/presence/mumbai', { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_presence_detail.png'), fullPage: false });

    // 6. Desktop Contact Page
    console.log('Capturing Desktop Contact Page...');
    await desktop.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_contact.png'), fullPage: false });

    // 7. Tablet Viewport
    console.log('Capturing Tablet Homepage...');
    const tablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await tablet.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await tablet.screenshot({ path: path.join(artifactDir, 'screenshot_tablet_home.png'), fullPage: false });

    // 8. Mobile Viewport
    console.log('Capturing Mobile Homepage...');
    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await mobile.screenshot({ path: path.join(artifactDir, 'screenshot_mobile_home.png'), fullPage: false });

    // 9. Mobile Navigation Drawer Open
    console.log('Capturing Mobile Navigation Drawer...');
    const menuBtn = await mobile.$('button[aria-label="Open mobile navigation menu"]');
    if (menuBtn) {
      await menuBtn.click();
      await mobile.waitForTimeout(600);
      await mobile.screenshot({ path: path.join(artifactDir, 'screenshot_mobile_nav.png'), fullPage: false });
    }

    console.log('✓ All Phase 4 browser verification screenshots captured successfully!');
  } catch (err) {
    console.error('Screenshot capture failed:', err);
  } finally {
    await browser.close();
  }
}

captureArtifactScreenshots();
