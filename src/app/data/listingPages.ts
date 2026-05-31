import type { Tour } from './tours';

export const RIDES_POPULAR_NAMES = [
  'PPS → El Nido',
  'El Nido → PPS',
  'PPS → Port Barton',
  'Airport / Hotel Transfer',
];

export const RIDES_GROUP_ORDER: { id: string; label: string; names: string[] }[] = [
  {
    id: 'north',
    label: 'North Palawan Routes',
    names: [
      'PPS → El Nido',
      'El Nido → PPS',
      'PPS → Port Barton',
      'Port Barton → PPS',
      'PPS → San Vicente',
      'San Vicente → PPS',
    ],
  },
  {
    id: 'resorts',
    label: 'Resorts & Sabang',
    names: [
      'PPS → Astoria Palawan',
      'Astoria Palawan → PPS',
      'PPS → Sabang · Four Points',
      'Sabang · Four Points → PPS',
    ],
  },
  {
    id: 'airport',
    label: 'Airport & City',
    names: ['Airport / Hotel Transfer'],
  },
];

export const RIDES_POPULAR_ORDER = [
  'PPS → El Nido',
  'PPS → Port Barton',
  'PPS → San Vicente',
  'Airport / Hotel Transfer',
  'El Nido → PPS',
  'Port Barton → PPS',
  'PPS → Astoria Palawan',
  'PPS → Sabang · Four Points',
];

export const RIDES_BLOG_LINKS = [
  { slug: 'puerto-princesa-to-el-nido-guide', title: 'PPS → El Nido travel guide' },
  { slug: 'puerto-princesa-to-port-barton', title: 'PPS → Port Barton guide' },
  { slug: 'best-time-to-visit-el-nido', title: 'Best time to visit El Nido' },
];

export const TOURS_POPULAR_ORDER = [
  'Underground River Day Tour',
  'Honda Bay Island Tour',
  'El Nido Island Tour A',
  'El Nido Island Tour C',
  'Iwahig Firefly Watching',
  'Puerto Princesa City Tour',
];

export const TOURS_GROUP_ORDER: { id: string; label: string; match: (t: Tour) => boolean }[] = [
  {
    id: 'pps',
    label: 'Puerto Princesa Tours',
    match: (t) => !t.name.includes('El Nido Island Tour'),
  },
  {
    id: 'elnido',
    label: 'El Nido Island Hopping',
    match: (t) => t.name.includes('El Nido Island Tour'),
  },
];

export const TOURS_BLOG_LINKS = [
  { slug: 'el-nido-island-tours-guide', title: 'El Nido Tours A, B, C & D — which to pick?' },
  { slug: 'things-to-do-puerto-princesa', title: 'Top things to do in Puerto Princesa' },
];

export function sortByPopular<T extends { name: string }>(items: T[], order: string[]): T[] {
  return [...items].sort((a, b) => {
    const ai = order.indexOf(a.name);
    const bi = order.indexOf(b.name);
    const aRank = ai === -1 ? 999 : ai;
    const bRank = bi === -1 ? 999 : bi;
    return aRank - bRank;
  });
}

export function sortByPriceAsc<T extends { price: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => parseInt(a.price) - parseInt(b.price));
}

export function groupRides(items: Tour[]): { label: string; tours: Tour[] }[] {
  const used = new Set<string>();
  const groups: { label: string; tours: Tour[] }[] = [];

  for (const g of RIDES_GROUP_ORDER) {
    const toursInGroup = items.filter((t) => g.names.includes(t.name));
    if (toursInGroup.length > 0) {
      toursInGroup.forEach((t) => used.add(t.name));
      groups.push({ label: g.label, tours: toursInGroup });
    }
  }

  const rest = items.filter((t) => !used.has(t.name));
  if (rest.length > 0) groups.push({ label: 'More routes', tours: rest });

  return groups;
}

export function groupTours(items: Tour[]): { label: string; tours: Tour[] }[] {
  return TOURS_GROUP_ORDER.map((g) => ({
    label: g.label,
    tours: items.filter(g.match),
  })).filter((g) => g.tours.length > 0);
}
