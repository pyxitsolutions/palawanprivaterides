import { spawn } from 'child_process';
import fs from 'fs';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPrerenderRoutes } from './prerender-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 4173;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

/** @param {string} route */
function routeToOutputFile(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const segments = route.replace(/^\//, '');
  return path.join(distDir, segments, 'index.html');
}

async function launchBrowser() {
  const launchArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ];

  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteer = (await import('puppeteer-core')).default;
    return puppeteer.launch({
      args: [...chromium.args, ...launchArgs],
      defaultViewport: { width: 1280, height: 900 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = (await import('puppeteer')).default;
  return puppeteer.launch({
    headless: true,
    args: launchArgs,
  });
}

/** @returns {Promise<{ proc: import('child_process').ChildProcess, port: number }>} */
function startPreviewServer(port) {
  const baseUrl = `http://127.0.0.1:${port}`;
  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
      ['exec', 'vite', 'preview', '--port', String(port), '--strictPort', '--host', '127.0.0.1'],
      { cwd: rootDir, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' },
    );

    let settled = false;
    let logs = '';
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Timed out waiting for vite preview\n${logs}`));
      }
    }, 45000);

    const onReady = (chunk) => {
      const text = String(chunk);
      logs += text;
      if (text.includes('Local:') || text.includes(`127.0.0.1:${port}`)) {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          resolve({ proc, port: port });
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
        reject(new Error(`vite preview exited early with code ${code}\n${logs}`));
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

  const port = await getAvailablePort();
  const { proc: preview } = await startPreviewServer(port);
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await launchBrowser();

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

  const samplePath = path.join(distDir, 'services', 'pps-el-nido', 'index.html');
  const sampleHtml = fs.readFileSync(samplePath, 'utf8');
  if (!sampleHtml.includes('El Nido Private Van Transfer')) {
    throw new Error('Prerender verification failed: service page missing expected SEO content.');
  }
  if (sampleHtml.length < 20000) {
    throw new Error(`Prerender verification failed: service page HTML too small (${sampleHtml.length} bytes).`);
  }
}

prerender().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
