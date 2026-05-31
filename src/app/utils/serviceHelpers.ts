import type { Tour } from '../data/tours';

/** Paired / complementary services shown on View Details pages */
const RELATED_BY_NAME: Record<string, string[]> = {
  'PPS → El Nido': ['El Nido → PPS', 'PPS → Port Barton', 'El Nido Island Tour A'],
  'El Nido → PPS': ['PPS → El Nido', 'El Nido Island Tour A', 'El Nido Island Tour C'],
  'PPS → Port Barton': ['Port Barton → PPS', 'PPS → El Nido', 'PPS → San Vicente'],
  'Port Barton → PPS': ['PPS → Port Barton', 'PPS → El Nido', 'Airport / Hotel Transfer'],
  'PPS → San Vicente': ['San Vicente → PPS', 'PPS → El Nido', 'PPS → Port Barton'],
  'San Vicente → PPS': ['PPS → San Vicente', 'PPS → El Nido', 'Airport / Hotel Transfer'],
  'PPS → Astoria Palawan': ['Astoria Palawan → PPS', 'Airport / Hotel Transfer', 'Puerto Princesa City Tour'],
  'Astoria Palawan → PPS': ['PPS → Astoria Palawan', 'Airport / Hotel Transfer', 'Puerto Princesa City Tour'],
  'PPS → Sabang · Four Points': ['Sabang · Four Points → PPS', 'Underground River Day Tour', 'Airport / Hotel Transfer'],
  'Sabang · Four Points → PPS': ['PPS → Sabang · Four Points', 'Underground River Day Tour', 'Puerto Princesa City Tour'],
  'Underground River Day Tour': ['Honda Bay Island Tour', 'Puerto Princesa City Tour', 'PPS → Sabang · Four Points'],
  'Honda Bay Island Tour': ['Underground River Day Tour', 'Iwahig Firefly Watching', 'Puerto Princesa City Tour'],
  'Iwahig Firefly Watching': ['Honda Bay Island Tour', 'Puerto Princesa City Tour', 'PPC Beach Day Trip'],
  'Puerto Princesa City Tour': ['Underground River Day Tour', 'Honda Bay Island Tour', 'Airport / Hotel Transfer'],
  'PPC Beach Day Trip': ['Honda Bay Island Tour', 'Puerto Princesa City Tour', 'Iwahig Firefly Watching'],
  'El Nido Island Tour A': ['El Nido Island Tour C', 'El Nido Island Tour D', 'PPS → El Nido'],
  'El Nido Island Tour B': ['El Nido Island Tour A', 'El Nido Island Tour D', 'PPS → El Nido'],
  'El Nido Island Tour C': ['El Nido Island Tour A', 'El Nido Island Tour D', 'PPS → El Nido'],
  'El Nido Island Tour D': ['El Nido Island Tour A', 'El Nido Island Tour C', 'PPS → El Nido'],
  'Airport / Hotel Transfer': ['Puerto Princesa City Tour', 'PPS → El Nido', 'Underground River Day Tour'],
};

export function getServiceListPath(type: string): { href: string; label: string } {
  if (type === 'Tour Package') return { href: '/tours', label: 'Tour Packages' };
  return { href: '/rides', label: 'Private Rides' };
}

export function getRelatedTours(current: Tour, all: Tour[], limit = 3): Tour[] {
  const picked: Tour[] = [];
  const seen = new Set<string>([current.name]);

  const preferred = RELATED_BY_NAME[current.name] ?? [];
  for (const name of preferred) {
    if (picked.length >= limit) break;
    const t = all.find((x) => x.name === name);
    if (t && !seen.has(t.name)) {
      picked.push(t);
      seen.add(t.name);
    }
  }

  if (picked.length < limit) {
    const sameElNido =
      current.name.includes('El Nido Island') &&
      all.filter((t) => t.name.includes('El Nido Island') && !seen.has(t.name));
    for (const t of sameElNido) {
      if (picked.length >= limit) break;
      picked.push(t);
      seen.add(t.name);
    }
  }

  if (picked.length < limit) {
    for (const t of all) {
      if (picked.length >= limit) break;
      if (seen.has(t.name)) continue;
      if (t.type === current.type) {
        picked.push(t);
        seen.add(t.name);
      }
    }
  }

  return picked;
}

export function buildServiceWhatsAppUrl(serviceName: string): string {
  const text = encodeURIComponent(
    `Hi! I'm interested in ${serviceName}. Can you help me with availability and booking?`,
  );
  return `https://api.whatsapp.com/send?phone=639217792016&text=${text}`;
}
