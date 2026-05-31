import p1 from '../../gallery/p1.webp';
import p2 from '../../gallery/p2.webp';
import p3 from '../../gallery/p3.webp';
import p4 from '../../gallery/p4.webp';
import p5 from '../../gallery/p5.webp';
import p6 from '../../gallery/p6.webp';
import p7 from '../../gallery/p7.webp';
import p8 from '../../gallery/p8.webp';
import p9 from '../../gallery/p9.webp';
import p10 from '../../gallery/p10.webp';
import p11 from '../../gallery/p11.webp';
import p12 from '../../gallery/p12.webp';
import p13 from '../../gallery/p13.webp';
import p14 from '../../gallery/p14.webp';
import p15 from '../../gallery/p15.webp';
import p16 from '../../gallery/p16.webp';
import p17 from '../../gallery/p17.webp';
import p18 from '../../gallery/p18.webp';
import p19 from '../../gallery/p19.webp';
import p20 from '../../gallery/p20.webp';
import p21 from '../../gallery/p21.webp';
import p22 from '../../gallery/p22.webp';

export type GalleryCategory = 'transfers' | 'tours' | 'destinations' | 'vehicles';

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
}

/** Update alt/caption (and category when filters return) per photo file (p1–p22). */
export const galleryItems: GalleryItem[] = [
  { src: p1, category: 'vehicles', alt: 'Private air-conditioned van for Palawan transfers', caption: 'Our private van fleet' },
  { src: p2, category: 'transfers', alt: 'Door-to-door private transfer in Palawan', caption: 'Door-to-door private transfer' },
  { src: p3, category: 'destinations', alt: 'Scenic Palawan coastline along a private ride route', caption: 'Palawan scenery on the road' },
  { src: p4, category: 'transfers', alt: 'Guests boarding a private van in Puerto Princesa', caption: 'Guests ready for departure' },
  { src: p5, category: 'vehicles', alt: 'Comfortable SUV for small groups in Palawan', caption: 'SUV for smaller groups' },
  { src: p6, category: 'destinations', alt: 'El Nido limestone cliffs and turquoise water', caption: 'El Nido landscapes' },
  { src: p7, category: 'tours', alt: 'Island hopping boat tour in Palawan', caption: 'Island hopping experience' },
  { src: p8, category: 'transfers', alt: 'Private van on a Palawan highway transfer route', caption: 'On the road between towns' },
  { src: p9, category: 'tours', alt: 'Snorkeling and beach stop on a Palawan tour', caption: 'Beach and snorkeling stops' },
  { src: p10, category: 'destinations', alt: 'Hidden lagoon and karst formations in El Nido', caption: 'Lagoon and karst views' },
  { src: p11, category: 'vehicles', alt: 'Clean private van interior for Palawan travelers', caption: 'Comfortable van interior' },
  { src: p12, category: 'transfers', alt: 'Hotel pickup for a private Palawan transfer', caption: 'Hotel pickup service' },
  { src: p13, category: 'tours', alt: 'Underground River tour area in Sabang Palawan', caption: 'Sabang & Underground River trips' },
  { src: p14, category: 'destinations', alt: 'Port Barton beach and calm Palawan waters', caption: 'Port Barton coast' },
  { src: p15, category: 'transfers', alt: 'Family group traveling in a private Palawan van', caption: 'Families and groups welcome' },
  { src: p16, category: 'tours', alt: 'Honda Bay island tour from Puerto Princesa', caption: 'Honda Bay island tour' },
  { src: p17, category: 'vehicles', alt: 'Professional local driver with private transfer vehicle', caption: 'Trusted local drivers' },
  { src: p18, category: 'destinations', alt: 'San Vicente Long Beach Palawan destination', caption: 'San Vicente & Long Beach' },
  { src: p19, category: 'tours', alt: 'Firefly watching river cruise in Puerto Princesa', caption: 'Firefly watching tour' },
  { src: p20, category: 'transfers', alt: 'Puerto Princesa airport private transfer pickup', caption: 'Airport & city transfers' },
  { src: p21, category: 'destinations', alt: 'Puerto Princesa city and countryside Palawan views', caption: 'Puerto Princesa surroundings' },
  { src: p22, category: 'vehicles', alt: 'Private transportation fleet ready for Palawan bookings', caption: 'Ready for your next trip' },
];

export const GALLERY_META = {
  title: 'Photo Gallery | Palawan Private Rides & Tours',
  description:
    'See real photos from our private van transfers, island tours, and Palawan destinations. Door-to-door rides with trusted local drivers.',
};
