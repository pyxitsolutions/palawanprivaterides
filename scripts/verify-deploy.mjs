const urls = [
  { name: 'homepage', url: 'https://www.palawanprivaterides.com/' },
  { name: 'service pps-el-nido', url: 'https://www.palawanprivaterides.com/services/pps-el-nido' },
  { name: 'blog', url: 'https://www.palawanprivaterides.com/blog/puerto-princesa-to-el-nido-guide' },
  { name: 'rides', url: 'https://www.palawanprivaterides.com/rides' },
];

for (const { name, url } of urls) {
  const res = await fetch(url);
  const html = await res.text();
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? '(missing)';
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? '(missing)';
  const rootMatch = html.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>\s*<script/i);
  const rootText = (rootMatch?.[1] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`\n=== ${name} ===`);
  console.log('status:', res.status);
  console.log('bytes:', html.length);
  console.log('title:', title);
  console.log('canonical:', canonical);
  console.log('root text length:', rootText.length);
  console.log('root preview:', rootText.slice(0, 120) + (rootText.length > 120 ? '...' : ''));
  console.log('static seo ok:', rootText.length > 80 ? 'YES' : 'NO');
  if (name.includes('service')) {
    console.log('has service title:', /El Nido Private Van Transfer/.test(html));
  }
}

const redirect = await fetch('https://palawanprivaterides.com/services/pps-el-nido', { redirect: 'manual' });
console.log('\n=== www redirect ===');
console.log('status:', redirect.status);
console.log('location:', redirect.headers.get('location'));
