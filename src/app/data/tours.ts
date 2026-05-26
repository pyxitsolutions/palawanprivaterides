import rides1 from '../../rides/rides-1.png';
import rides2 from '../../rides/rides-2.png';
import rides3 from '../../rides/rides-3.png';
import rides4 from '../../rides/rides-4.png';
import rides5 from '../../rides/rides-5.png';
import transfers1 from '../../transfers/transfers-1.png';
import tourFirefly from '../../tour/tour-firefly.png';
import tourCity from '../../tour/tour-city.png';
import tourRiver from '../../tour/tour-river.png';
import tourTala from '../../tour/tour-tala.png';
import tourHonda from '../../tour/tour-honda.png';

export interface PricingTier {
  vehicle: string;
  price: string;
  capacity?: number;
}

export interface Tour {
  images: string[];
  name: string;
  price: string;
  type: string;
  duration?: string;
  pax: string;
  description: string;
  pricing?: PricingTier[];
  whatsIncluded?: string[];
}

export const tours: Tour[] = [
  {
    images: [rides1],
    name: 'PPS → El Nido',
    price: '7000',
    type: 'Private Ride',
    duration: 'Travel Duration (5-6 hrs)',
    pax: 'Up to 8 pax',
    description: 'Private door-to-door transfer from Puerto Princesa to El Nido. Enjoy a comfortable and exclusive ride with your group and a trusted local driver — no shared vans, no crowded trips. Optional stopovers along the way are available for meals, sightseeing, or quick breaks upon request.',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '7150' },
      { vehicle: 'SUV', price: '7800' },
      { vehicle: 'Van', price: '8650' },
    ],
  },
  {
    images: [rides2],
    name: 'PPS → Port Barton',
    price: '5500',
    type: 'Private Ride',
    duration: 'Travel Duration (2-3 hrs)',
    pax: 'Up to 8 pax',
    description: 'Private transfer from Puerto Princesa to Port Barton. Comfortable, air-conditioned ride straight to this hidden gem of Palawan.',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '5650' },
      { vehicle: 'SUV', price: '6300' },
      { vehicle: 'Van', price: '7150' },
    ],
  },
  {
    images: [rides3],
    name: 'PPS → San Vicente',
    price: '6000',
    type: 'Private Ride',
    duration: 'Travel Duration (3-4 hrs)',
    pax: 'Up to 8 pax',
    description: 'Private transfer to San Vicente, home of the famous Long Beach — one of the longest white sand beaches in the Philippines.',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '6150' },
      { vehicle: 'SUV', price: '6800' },
      { vehicle: 'Van', price: '7650' },
    ],
  },
  {
    images: [rides4],
    name: 'PPS → Astotia Palawan',
    price: '3000',
    type: 'Private Ride',
    duration: 'Travel Duration (2 hrs)',
    pax: 'Up to 8 pax',
    description: 'Private transfer from Puerto Princesa to Astotia Palawan. Affordable and comfortable door-to-door service.',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '3150' },
      { vehicle: 'SUV', price: '3800' },
      { vehicle: 'Van', price: '4650' },
    ],
  },
  {
    images: [rides5],
    name: 'PPS → Sabang · Four Points',
    price: '3500',
    type: 'Private Ride',
    duration: 'Travel Duration (2 hrs)',
    pax: 'Up to 8 pax',
    description: 'Private transfer to Sabang — gateway to the UNESCO Underground River. Perfect for day trips or overnight stays.',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '3650' },
      { vehicle: 'SUV', price: '4300' },
      { vehicle: 'Van', price: '5150' },
    ],
  },
  {
    images: [tourCity],
    name: 'Puerto Princesa City Tour',
    price: '800',
    type: 'Tour Package',
    duration: 'Tour Duration (4-5 hrs)',
    pax: 'Up to 8 pax',
    description: "Explore Puerto Princesa's highlights — Crocodile Farm, Baker's Hill, Mitra Ranch & more. Great for first-time Palawan visitors.",
  },
  {
    images: [tourRiver],
    name: 'Underground River Day Tour',
    price: '2550',
    type: 'Tour Package',
    duration: 'Tour Duration (7–8 hrs)',
    pax: 'Up to 8 pax',
    description: 'Visit the UNESCO World Heritage Underground River in Sabang. Includes private van transport. Permits must be arranged in advance.',
    whatsIncluded: [
      'Hotel Pickup & Drop-off',
      'Air-conditioned Transport',
      'Boat Transfers',
      'Licensed Tour Guide',
      'Buffet Lunch',
      'Permits & Entrance Fees',
    ],
  },
  {
    images: [transfers1],
    name: 'Airport / Hotel Transfer',
    price: '550',
    type: 'Transfer',
    pax: 'Up to 8 pax',
    description: 'Reliable, on-time pick-up from Puerto Princesa Airport to your hotel — or hotel to airport drop-off. No hidden charges.',
  },
  {
    images: [tourFirefly],
    name: 'Iwahig Firefly Watching',
    price: '1850',
    type: 'Tour Package',
    duration: 'Evening (3–4 hrs)',
    pax: 'Up to 8 pax',
    description: 'Witness thousands of fireflies lighting up the Iwahig River at night. Includes round-trip transfers, welcome drinks, buffet dinner, guided boat tour, life jackets & safety gear. ₱150 environmental fee applies.',
    whatsIncluded: [
      'Air-conditioned Van',
      'Licensed Tour Guide',
      'Buffet Dinner',
      'Permits & Entrance Fees',
    ],
  },
  {
    images: [tourTala],
    name: 'PPC Beach Day Trip',
    price: '2500',
    type: 'Tour Package',
    duration: 'Tour Duration (4–5 hrs)',
    pax: 'Up to 8 pax',
    description: "Escape to one of Puerto Princesa's hidden shores — choose between Tala Beach, Nagtabon Beach, or Pakpak Lauin. Perfect for couples, families & small groups. Includes private transport, free fuel, and a professional driver. Additional charges may vary.",
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '2700', capacity: 4 },
      { vehicle: 'SUV', price: '3300', capacity: 6 },
      { vehicle: 'Van', price: '5650', capacity: 13 },
    ],
  },
  {
    images: [tourHonda],
    name: 'Honda Bay Island Tour',
    price: '1850',
    type: 'Tour Package',
    duration: 'Tour Duration (6–8 hrs)',
    pax: 'Up to 8 pax',
    description: 'Island-hop Cowrie Island, Luli Island & Pambato Reef. Includes roundtrip van transfer, island hopping boat, entrance fees, licensed tour guide, lunch, and life vest. ₱150 environmental fee applies.',
    whatsIncluded: [
      'Private vehicle & professional driver',
      'Island Hopping Boat',
      'Licensed Tour Guide',
      'Buffet Lunch',
      'Entrance Fees',
      'Life Vest',
    ],
  },
];

export const privateRides = tours.filter((t) => t.type === 'Private Ride' || t.type === 'Transfer');
export const cityTours = tours.filter((t) => t.type === 'Tour Package');
