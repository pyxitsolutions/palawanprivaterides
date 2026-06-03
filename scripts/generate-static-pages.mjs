import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPrerenderRoutes } from './prerender-routes.mjs';
import { ROUTE_SEO, SITE_ORIGIN } from './static-seo-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

/** @param {string} html */
function upsertMetaProperty(html, key, content) {
  const pattern = new RegExp(`<meta property="${key}" content="[^"]*"\\s*/?>`, 'i');
  const tag = `<meta property="${key}" content="${escapeAttr(content)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace('</head>', `  ${tag}\n  </head>`);
}

/** @param {string} route @param {{ title: string; description: string; heading: string; intro: string }} seo */
function buildHtml(template, route, seo) {
  const canonical = route === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;
  const ogType = route.startsWith('/blog/') && route !== '/blog' ? 'article' : 'website';

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = upsertMetaProperty(html, 'og:title', seo.title);
  html = upsertMetaProperty(html, 'og:description', seo.description);
  html = upsertMetaProperty(html, 'og:url', canonical);
  html = upsertMetaProperty(html, 'og:type', ogType);

  const bodyHtml = `
    <main id="static-seo-content">
      <h1>${escapeHtml(seo.heading)}</h1>
      <p>${escapeHtml(seo.intro)}</p>
      <p><a href="${canonical}">View ${escapeHtml(seo.heading)} on Palawan Private Rides</a> · <a href="${SITE_ORIGIN}/book">Book now</a></p>
    </main>`;

  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${bodyHtml}</div>`);
  return html;
}

/** @param {string} route */
function routeToOutputFile(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, route.replace(/^\//, ''), 'index.html');
}

function generateStaticPages() {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ not found. Run vite build first.');
  }

  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const routes = getPrerenderRoutes();

  for (const route of routes) {
    const seo = ROUTE_SEO[route];
    if (!seo) {
      throw new Error(`Missing SEO data for route: ${route}`);
    }

    const html = buildHtml(template, route, seo);
    const outputFile = routeToOutputFile(route);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, html);
    console.log(`  ✓ ${route}`);
  }

  const sample = fs.readFileSync(path.join(distDir, 'services', 'pps-el-nido', 'index.html'), 'utf8');
  if (!sample.includes('El Nido Private Van Transfer')) {
    throw new Error('Static page verification failed: missing service title.');
  }
  if (!sample.includes('<h1>')) {
    throw new Error('Static page verification failed: missing static SEO content.');
  }

  console.log(`Generated ${routes.length} static pages.`);
}

console.log(`Generating static pages for sitemap routes...`);
generateStaticPages();
