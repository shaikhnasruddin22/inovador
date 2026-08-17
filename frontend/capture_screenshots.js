const { chromium } = require('playwright');
const path = require('path');

async function captureArtifactScreenshots() {
  const artifactDir = 'C:\\Users\\TNMT\\.gemini\\antigravity\\brain\\b6186508-a8b4-4305-9fbb-0e238adfca58';
  const browser = await chromium.launch();

  try {
    // 1. Desktop Homepage
    const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesktop.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pageDesktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_home.png'), fullPage: false });

    // 2. Desktop Project Detail
    await pageDesktop.goto('http://localhost:3000/projects/the-raw-stone-pavilion', { waitUntil: 'networkidle' });
    await pageDesktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_project.png'), fullPage: false });

    // 3. Desktop About Page
    await pageDesktop.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
    await pageDesktop.screenshot({ path: path.join(artifactDir, 'screenshot_desktop_about.png'), fullPage: false });

    // 4. Mobile Homepage
    const pageMobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await pageMobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pageMobile.screenshot({ path: path.join(artifactDir, 'screenshot_mobile_home.png'), fullPage: false });

    console.log('✓ Screenshots saved to artifacts directory');
  } catch (err) {
    console.error('Screenshot capture failed:', err);
  } finally {
    await browser.close();
  }
}

captureArtifactScreenshots();
