import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { PromoPrice } from '../components/PromoPrice';
import { hasPromoRate } from '../utils/pricing';
import { tours } from '../data/tours';
import { slugify } from './ServicePage';

import dest1 from '../../dest/dest-1.webp';
import dest2 from '../../dest/dest-2.webp';
import dest3 from '../../dest/dest-3.webp';
import dest4 from '../../dest/dest-4.webp';
import dest5 from '../../dest/dest-5.webp';

interface DestinationData {
  name: string;
  image: string;
  tagline: string;
  description: string;
  highlights: string[];
  metaTitle: string;
  metaDescription: string;
  serviceFilter: (name: string) => boolean;
}

const DESTINATIONS: Record<string, DestinationData> = {
  'el-nido': {
    name: 'El Nido',
    image: dest1,
    tagline: 'Limestone Cliffs, Hidden Lagoons & Island Hopping',
    description: 'El Nido is Palawan\'s crown jewel — a stunning coastal town surrounded by towering limestone karsts, crystal-clear lagoons, and pristine beaches. Whether you\'re island hopping through the famous tours A, B, C, and D, or simply soaking in the scenery, El Nido is an experience unlike any other. Palawan Private Rides offers private van transfers from Puerto Princesa to El Nido with trusted local drivers.',
    highlights: ['Big Lagoon & Secret Lagoon', 'Seven Commandos Beach', 'Nacpan Beach', 'Snake Island', 'Hidden Beach & Secret Beach'],
    metaTitle: 'El Nido Palawan Private Van Transfer & Island Tours | Palawan Private Rides',
    metaDescription: 'Book private van transfers from Puerto Princesa to El Nido and island hopping tours. Starting at ₱6,900 (promo from ₱7,000). No shared vans. Trusted local drivers. Book now!',
    serviceFilter: (name) => name.includes('El Nido') || name === 'PPS → El Nido',
  },
  'port-barton': {
    name: 'Port Barton',
    image: dest4,
    tagline: 'Quiet Beaches, Coral Reefs & Island Escape',
    description: 'Port Barton is Palawan\'s best-kept secret — a laid-back beach town with pristine waters, vibrant coral reefs, and a peaceful atmosphere far from the crowds. Perfect for travelers looking for a quieter, more authentic Palawan experience. Palawan Private Rides provides private door-to-door van transfers from Puerto Princesa to Port Barton.',
    highlights: ['Exotic Island', 'German Island', 'Coral Garden snorkeling', 'White sand beaches', 'Firefly watching at night'],
    metaTitle: 'Port Barton Palawan Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van transfer from Puerto Princesa to Port Barton starting at ₱5,600. Comfortable, door-to-door, no shared vans. Book your Port Barton transfer today!',
    serviceFilter: (name) => name.includes('Port Barton'),
  },
  'san-vicente': {
    name: 'San Vicente',
    image: dest5,
    tagline: 'Home of Long Beach — One of the Longest in the Philippines',
    description: 'San Vicente is home to Long Beach — a stunning 14-kilometer stretch of white sand that ranks among the longest in the Philippines. Unspoiled and peaceful, San Vicente offers a serene escape for travelers seeking natural beauty without the crowds. Palawan Private Rides offers private van transfers from Puerto Princesa to San Vicente.',
    highlights: ['Long Beach (14km white sand)', 'Alimanguan River', 'Unspoiled nature', 'Peaceful & uncrowded', 'Stunning sunsets'],
    metaTitle: 'San Vicente Palawan Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van transfer from Puerto Princesa to San Vicente (Long Beach) starting at ₱6,100. No shared vans, door-to-door service. Book today!',
    serviceFilter: (name) => name.includes('San Vicente'),
  },
  'puerto-princesa': {
    name: 'Puerto Princesa',
    image: dest2,
    tagline: 'Gateway to Palawan — City Tours, Airport Transfers & Day Tours',
    description: 'Puerto Princesa is the capital city of Palawan and the starting point for most Palawan adventures. From here, travelers head to El Nido, Port Barton, San Vicente, and other stunning destinations. The city itself offers rich culture, the famous Underground River, Honda Bay island hopping, and Iwahig Firefly Watching. Palawan Private Rides is based in Puerto Princesa, offering airport pickups, hotel transfers, and guided tours.',
    highlights: ['Puerto Princesa Subterranean River (UNESCO)', 'Honda Bay Island Hopping', 'Iwahig Firefly Watching', "Baker's Hill & Crocodile Farm", 'Nagtabon & Tala Beach'],
    metaTitle: 'Puerto Princesa Tours & Airport Transfer | Palawan Private Rides',
    metaDescription: 'Book airport transfers, city tours, Underground River day tours, Honda Bay island hopping & more in Puerto Princesa. Trusted local drivers. Book now!',
    serviceFilter: (name) =>
      name.includes('Airport') ||
      name.includes('City Tour') ||
      name.includes('Underground River') ||
      name.includes('Firefly') ||
      name.includes('Honda Bay') ||
      name.includes('Beach Day'),
  },
  'sabang': {
    name: 'Sabang',
    image: dest3,
    tagline: 'Gateway to the UNESCO Underground River',
    description: 'Sabang is a small, scenic coastal town that serves as the gateway to the Puerto Princesa Subterranean River — a UNESCO World Heritage Site and one of the New Seven Wonders of Nature. Surrounded by lush jungle and pristine beaches, Sabang is a must-visit for nature lovers and adventure seekers. Palawan Private Rides offers private van transfers from Puerto Princesa to Sabang.',
    highlights: ['UNESCO Underground River', 'Sabang Beach', 'Mangrove paddle boat tours', 'Zipline adventure', 'Ugong Rock spelunking'],
    metaTitle: 'Sabang Palawan Transfer & Underground River Tour | Palawan Private Rides',
    metaDescription: 'Book a private van transfer from Puerto Princesa to Sabang (Four Points) starting at ₱3,600. Perfect for Underground River day tours. No shared vans. Book now!',
    serviceFilter: (name) => name.includes('Sabang') || name.includes('Underground River'),
  },
};

export default function DestinationPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const dest = DESTINATIONS[slug ?? ''];

  useEffect(() => {
    if (!dest) return;
    document.title = dest.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', dest.metaDescription);
  }, [slug, dest]);

  if (!dest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Destination not found.</p>
        <button onClick={() => navigate('/')} className="text-primary underline">Back to home</button>
      </div>
    );
  }

  const relatedServices = tours.filter((t) => dest.serviceFilter(t.name));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[340px] mt-16">
        <img
          src={dest.image}
          alt={`${dest.name} Palawan - ${dest.tagline}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-[#e8a020]" />
            <span className="text-[#e8a020] text-xs font-bold uppercase tracking-widest">Palawan, Philippines</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-2">
            {dest.name}
          </h1>
          <p className="text-white/80 text-base sm:text-lg">{dest.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left — About + Highlights */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">About {dest.name}</h2>
              <p className="text-gray-600 leading-relaxed text-base">{dest.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">Top Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dest.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[#e8a020] font-black text-lg">✦</span>
                    <span className="text-sm font-semibold text-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available services */}
            {relatedServices.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  Available Services to {dest.name}
                </h2>
                <div className="space-y-4">
                  {relatedServices.map((t) => {
                    const price = hasPromoRate(t.type)
                      ? parseInt(t.price)
                      : t.pricing
                        ? Math.min(...t.pricing.map((p) => parseInt(p.price)))
                        : parseInt(t.price);
                    const perLabel = t.type === 'Tour Package' || t.type === 'Transfer' ? '/person' : '/booking';
                    return (
                      <div
                        key={t.name}
                        className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => navigate(`/services/${slugify(t.name)}`)}
                      >
                        <img
                          src={t.images[0]}
                          alt={`${t.name} - Palawan Private Rides`}
                          loading="lazy"
                          className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#e8a020] uppercase tracking-widest">{t.type}</span>
                          <p className="font-bold text-gray-900 text-sm mt-0.5">{t.name}</p>
                          {t.duration && <p className="text-xs text-gray-400 mt-0.5">{t.duration}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <PromoPrice amount={price} type={t.type} size="sm" showPromoLabel={hasPromoRate(t.type)} />
                          <p className="text-[10px] text-gray-400 mt-0.5">{perLabel}</p>
                          <span className="text-xs text-[#e8a020] font-semibold group-hover:underline flex items-center gap-1 justify-end mt-1">
                            View <ArrowRight size={11} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — Quick CTA card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="font-black text-gray-900 text-lg mb-1">Going to {dest.name}?</h3>
              <p className="text-sm text-gray-500 mb-5">Book a private transfer or tour with a trusted local driver.</p>

              <button
                onClick={() => navigate('/rides')}
                className="w-full bg-[#e8a020] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#d49020] transition-colors mb-3 flex items-center justify-center gap-2"
              >
                View Private Rides
              </button>
              <button
                onClick={() => navigate('/tours')}
                className="w-full border-2 border-primary text-primary py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                View Tour Packages
              </button>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">Questions? Chat with us on WhatsApp</p>
                <a
                  href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20want%20to%20go%20to%20Palawan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1ebe5d] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.552 4.103 1.518 5.829L.057 23.5l5.83-1.527A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.368l-.359-.213-3.72.975.993-3.635-.234-.373A9.818 9.818 0 1112 21.818z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
