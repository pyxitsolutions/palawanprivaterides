import type { Tour } from '../data/tours';
import { SITE_ORIGIN, DEFAULT_OG_IMAGE } from './blogMeta';

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

export function setServicePageMeta(
  slug: string,
  meta: { metaTitle: string; metaDescription: string },
) {
  const url = `${SITE_ORIGIN}/services/${slug}`;
  document.title = meta.metaTitle;
  upsertMeta('name', 'description', meta.metaDescription);
  upsertCanonical(url);
  upsertMeta('property', 'og:title', meta.metaTitle);
  upsertMeta('property', 'og:description', meta.metaDescription);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
}

export function getServiceJsonLd(slug: string, tour: Tour, description: string) {
  const isPerPerson = tour.type === 'Tour Package' || tour.type === 'Transfer';
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: tour.name,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Palawan Private Rides',
      url: SITE_ORIGIN,
    },
    areaServed: { '@type': 'Place', name: 'Palawan, Philippines' },
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: 'PHP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: tour.price,
        priceCurrency: 'PHP',
        unitText: isPerPerson ? 'per person' : 'per booking',
      },
      url: `${SITE_ORIGIN}/services/${slug}`,
    },
  };
}

export function getDefaultServiceMeta(tour: Tour) {
  const per =
    tour.type === 'Tour Package' || tour.type === 'Transfer' ? 'per person' : 'per booking';
  return {
    metaTitle: `${tour.name} | Palawan Private Rides`,
    metaDescription: `${tour.description.slice(0, 140)}… Book online — ${per}, private service.`,
  };
}
