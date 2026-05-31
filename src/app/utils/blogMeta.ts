import type { BlogPost } from '../data/blog';

export const SITE_ORIGIN = 'https://www.palawanprivaterides.com';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

export function setBlogListMeta() {
  document.title = 'Palawan Travel Blog | Tips, Guides & Routes | Palawan Private Rides';
  const description =
    'Palawan travel guides, tips, and route information. Plan your trip to El Nido, Port Barton, Puerto Princesa & more.';
  upsertMeta('name', 'description', description);
  upsertCanonical(`${SITE_ORIGIN}/blog`);
  upsertMeta('property', 'og:title', 'Palawan Travel Blog | Palawan Private Rides');
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', `${SITE_ORIGIN}/blog`);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
}

export function setBlogPostMeta(post: BlogPost) {
  const url = `${SITE_ORIGIN}/blog/${post.slug}`;
  document.title = post.metaTitle;
  upsertMeta('name', 'description', post.metaDescription);
  upsertCanonical(url);
  upsertMeta('property', 'og:title', post.metaTitle);
  upsertMeta('property', 'og:description', post.metaDescription);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:type', 'article');
  upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
}

export function getArticleJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: DEFAULT_OG_IMAGE,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Palawan Private Rides',
      url: SITE_ORIGIN,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Palawan Private Rides',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/favicon-192.png`,
      },
    },
    mainEntityOfPage: `${SITE_ORIGIN}/blog/${post.slug}`,
    keywords: post.keywords.join(', '),
  };
}
