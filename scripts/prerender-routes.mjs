import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @returns {string[]} */
export function getPrerenderRoutes() {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const routes = [...xml.matchAll(/<loc>https:\/\/www\.palawanprivaterides\.com(\/[^<]*)<\/loc>/g)]
    .map((match) => match[1] || '/')
    .map((route) => (route === '' ? '/' : route.replace(/\/$/, '') || '/'));

  return [...new Set(routes)];
}
