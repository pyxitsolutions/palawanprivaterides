import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { getPrerenderRoutes } from './prerender-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;

/** @param {string} route */
function routeToOutputFile(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const segments = route.replace(/^\//, '');
  return path.join(distDir, segments, 'index.html');
}

/** @returns {Promise<import('child_process').ChildProcess>} */
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
      ['exec', 'vite', 'preview', '--port', String(port), '--strictPort', '--host', '127.0.0.1'],
      { cwd: rootDir, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' },
    );

    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error('Timed out waiting for vite preview'));
      }
    }, 45000);

    const onReady = (chunk) => {
      const text = String(chunk);
      if (text.includes('Local:') || text.includes(`127.0.0.1:${port}`)) {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          resolve(proc);
        }
      }
    };

    proc.stdout?.on('data', onReady);
    proc.stderr?.on('data', onReady);
    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error(`vite preview exited early with code ${code}`));
      }
    });
  });
}

/** @param {import('puppeteer').Page} page */
async function waitForRenderedPage(page) {
  await page.waitForSelector('#root', { timeout: 30000 });
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root');
      return Boolean(root && root.textContent && root.textContent.trim().length > 120);
    },
    { timeout: 45000 },
  );
  await new Promise((resolve) => setTimeout(resolve, 750));
}

async function prerender() {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ not found. Run vite build first.');
  }

  const routes = getPrerenderRoutes();
  console.log(`Prerendering ${routes.length} routes...`);

  const preview = await startPreviewServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${baseUrl}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 90000,
      });
      await waitForRenderedPage(page);

      const html = await page.content();
      const outputFile = routeToOutputFile(route);
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, html);
      console.log(`  ✓ ${route}`);
      await page.close();
    }
  } finally {
    await browser.close();
    preview.kill('SIGTERM');
  }

  console.log('Prerender complete.');
}

prerender().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
