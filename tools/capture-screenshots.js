import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { storyVersions } from '../js/modules/storyContent.js';

const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://127.0.0.1:8765';
const outDir = path.resolve('artifacts/screenshots');
const viewports = [
    { name: 'desktop', width: 1366, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
];

function storyUrl(version) {
    if (version === 'aneurysm') return `${baseUrl}/scrollytelling-aneurysm.html`;
    if (version === 'dissection') return `${baseUrl}/scrollytelling-dissection.html`;
    throw new Error(`Unknown story version: ${version}`);
}

function safeName(value) {
    return String(value).replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

async function launchBrowser() {
    return chromium.launch({
        headless: true,
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-features=VizDisplayCompositor',
            '--hide-scrollbars'
        ]
    });
}

async function captureStory(browser, version, config, viewport) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', (error) => console.error(`[${version}/${viewport.name}] ${error.message}`));
    await page.route('https://cdnjs.cloudflare.com/**', (route) => {
        route.fulfill({ contentType: 'text/javascript', body: '' });
    });
    await page.route('https://d3js.org/**', (route) => {
        route.fulfill({ contentType: 'text/javascript', body: '' });
    });
    await page.route('https://fonts.googleapis.com/**', (route) => {
        route.fulfill({ contentType: 'text/css', body: '' });
    });
    await page.route('https://unpkg.com/three@0.160.0/examples/jsm/libs/meshopt_decoder.module.js', (route) => {
        route.fulfill({
            contentType: 'text/javascript',
            body: `
                export const MeshoptDecoder = {
                    ready: Promise.resolve(),
                    supported: false,
                    decodeGltfBuffer() {},
                    decodeGltfBufferAsync() { return Promise.resolve(); }
                };
            `
        });
    });

    await page.goto(storyUrl(version), { waitUntil: 'domcontentloaded' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForSelector('section.step', { timeout: 10000 });

    for (const section of config.sections) {
        const sectionId = section.id;
        const locator = page.locator(`#${sectionId}`);
        if (!(await locator.count())) continue;

        await locator.evaluate((element) => {
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetTop = element.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: Math.max(0, targetTop), behavior: 'instant' });
        });
        await page.waitForTimeout(500);
        const filename = `${safeName(version)}-${safeName(viewport.name)}-${safeName(sectionId)}.png`;
        await page.screenshot({
            path: path.join(outDir, filename),
            fullPage: false
        });
        console.log(`Captured ${filename}`);
    }

    await page.close();
}

await mkdir(outDir, { recursive: true });

let browser;
try {
    browser = await launchBrowser();
    for (const [version, config] of Object.entries(storyVersions)) {
        for (const viewport of viewports) {
            await captureStory(browser, version, config, viewport);
        }
    }
} finally {
    if (browser) await browser.close();
}
