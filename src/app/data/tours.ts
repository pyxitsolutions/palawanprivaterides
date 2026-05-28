import rides1 from '../../private-rides/welcome-puerto.webp';
import rides2 from '../../private-rides/welcome-port.webp';
import rides3 from '../../private-rides/welcome-sanvic.webp';
import rides4 from '../../private-rides/welcome-astoria.webp';
import rides5 from '../../private-rides/welcome-fourpoints.webp';
import transfers1 from '../../transfers/transfers-1.webp';
import tourFirefly from '../../tour/tour-firefly.webp';
import tourFirefly1 from '../../firefly-tour/firefly-1.webp';
import tourCity from '../../tours-ppc/plaza-cuartel.webp';
import tourCityBakers from '../../tours-ppc/bakers-hill.webp';
import tourCityBakers2 from '../../tours-ppc/bakers-hill-2.webp';
import tourCityBakers3 from '../../tours-ppc/bakers-hill-3.webp';
import tourCityCroco1 from '../../tours-ppc/croco-fam-1.webp';
import tourCityCroco2 from '../../tours-ppc/croco-fam-2.webp';
import tourCityCroco3 from '../../tours-ppc/croco-fam-3.webp';
import tourCityCroco4 from '../../tours-ppc/croco-fam-4.webp';
import tourCityCroco5 from '../../tours-ppc/croco-fam-5.webp';
import tourRiver from '../../ur-tour/tour-river.webp';
import tourRiverUgong from '../../ur-tour/ugong-rock.webp';
import tourRiverKarst from '../../ur-tour/karst-mountain.webp';
import tourRiverUr1 from '../../ur-tour/ur-1.webp';
import tourRiverUr2 from '../../ur-tour/ur-2.webp';
import tourRiverUr3 from '../../ur-tour/ur-3.webp';
import tourTala from '../../tour/tour-tala.webp';
import tourHonda from '../../tour/tour-honda.webp';
import tourHonda1 from '../../honda-bay/courie-1.webp';
import tourHonda2 from '../../honda-bay/courie-2.webp';
import tourHonda3 from '../../honda-bay/courie-3.webp';
import tourElNidoA from '../../elnido/tour-a.webp';
import tourElNidoB from '../../elnido/tour-b.webp';
import tourElNidoC from '../../elnido/tour-c.webp';
import tourElNidoD from '../../elnido/tour-d.webp';

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
  credit?: string;
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
    credit: 'fabionodariphoto.com',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '7100' },
      { vehicle: 'SUV', price: '7600' },
      { vehicle: 'Van', price: '8100' },
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
    credit: 'fabionodariphoto.com',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '5600' },
      { vehicle: 'SUV', price: '6100' },
      { vehicle: 'Van', price: '6600' },
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
    credit: 'fabionodariphoto.com',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '6100' },
      { vehicle: 'SUV', price: '6600' },
      { vehicle: 'Van', price: '7100' },
    ],
  },
  {
    images: [rides4],
    name: 'PPS → Astoria Palawan',
    price: '3000',
    type: 'Private Ride',
    duration: 'Travel Duration (2 hrs)',
    pax: 'Up to 8 pax',
    description: 'Private transfer from Puerto Princesa to Astotia Palawan. Affordable and comfortable door-to-door service.',
    pricing: [
      { vehicle: 'Sedan/Hatchback', price: '3100' },
      { vehicle: 'SUV', price: '3600' },
      { vehicle: 'Van', price: '4100' },
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
      { vehicle: 'Sedan/Hatchback', price: '3600' },
      { vehicle: 'SUV', price: '4100' },
      { vehicle: 'Van', price: '4600' },
    ],
  },
  {
    images: [tourCity, tourCityBakers, tourCityBakers2, tourCityBakers3, tourCityCroco1, tourCityCroco2, tourCityCroco3, tourCityCroco4, tourCityCroco5],
    name: 'Puerto Princesa City Tour',
    price: '800',
    type: 'Tour Package',
    duration: 'Tour Duration (4-5 hrs)',
    pax: 'Up to 8 pax',
    description: "Explore Puerto Princesa's highlights — Crocodile Farm, Baker's Hill, Mitra Ranch & more. Great for first-time Palawan visitors.",
    credit: 'KeiseeintheCity',
  },
  {
    images: [tourRiver, tourRiverUgong, tourRiverKarst, tourRiverUr1, tourRiverUr2, tourRiverUr3],
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
    images: [tourFirefly, tourFirefly1],
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
      { vehicle: 'SUV', price: '3200', capacity: 6 },
      { vehicle: 'Van', price: '5200', capacity: 13 },
    ],
  },
  {
    images: [tourHonda, tourHonda1, tourHonda2, tourHonda3],
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
  {
    images: [tourElNidoA],
    name: 'El Nido Island Tour A',
    price: '1550',
    type: 'Tour Package',
    duration: 'Full Day Tour',
    pax: 'Per person',
    description: 'Most popular route — Big Lagoon, Secret Lagoon, Shimizu Island & Seven Commandos Beach. Price is per person. Additional fees paid on site: ₱400 environmental fee + ₱200 Big Lagoon entrance fee.',
    whatsIncluded: [
      'Licensed Tour Guide',
      'Island Hopping Boat',
      'Life Vest',
      'Buffet Lunch',
    ],
  },
  {
    images: [tourElNidoB],
    name: 'El Nido Island Tour B',
    price: '1650',
    type: 'Tour Package',
    duration: 'Full Day Tour',
    pax: 'Per person',
    description: 'Caves & hidden beaches — Snake Island, Cudugnon Cave, Cathedral Cave & Entalula Beach. Price is per person. Additional fees paid on site: ₱400 environmental fee.',
    whatsIncluded: [
      'Licensed Tour Guide',
      'Island Hopping Boat',
      'Life Vest',
      'Buffet Lunch',
    ],
  },
  {
    images: [tourElNidoC],
    name: 'El Nido Island Tour C',
    price: '1750',
    type: 'Tour Package',
    duration: 'Full Day Tour',
    pax: 'Per person',
    description: 'Hidden beaches & snorkeling — Hidden Beach, Secret Beach, Matinloc Shrine & Helicopter Island. Price is per person. Additional fees paid on site: ₱400 environmental fee + ₱200 Matinloc Shrine entrance fee.',
    whatsIncluded: [
      'Licensed Tour Guide',
      'Island Hopping Boat',
      'Life Vest',
      'Buffet Lunch',
    ],
  },
  {
    images: [tourElNidoD],
    name: 'El Nido Island Tour D',
    price: '1550',
    type: 'Tour Package',
    duration: 'Full Day Tour',
    pax: 'Per person',
    description: 'Quiet lagoons & relaxing spots — Small Lagoon, Cadlao Lagoon, Pasandigan Beach & Paradise Beach. Price is per person. Additional fees paid on site: ₱400 environmental fee + ₱200 Small Lagoon entrance fee.',
    whatsIncluded: [
      'Licensed Tour Guide',
      'Island Hopping Boat',
      'Life Vest',
      'Buffet Lunch',
    ],
  },
];

export const privateRides = tours.filter((t) => t.type === 'Private Ride' || t.type === 'Transfer');
export const cityTours = tours.filter((t) => t.type === 'Tour Package');
