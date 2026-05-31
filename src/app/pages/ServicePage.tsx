import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Users, Check, ArrowLeft, MessageCircle, Car, Star, Shield } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { ServiceBreadcrumb } from '../components/ServiceBreadcrumb';
import { ServiceTourFeesBox } from '../components/ServiceTourFeesBox';
import { ServicePhotoGrid } from '../components/ServicePhotoGrid';
import { ServiceFaq } from '../components/ServiceFaq';
import { ServiceStickyCta } from '../components/ServiceStickyCta';
import { useCurrency } from '../context/CurrencyContext';
import { PromoBadge, PromoPrice } from '../components/PromoPrice';
import { getPromoOriginalPrice, hasPromoRate } from '../utils/pricing';
import { tours } from '../data/tours';
import { buildServiceWhatsAppUrl, getRelatedTours, getServiceListPath } from '../utils/serviceHelpers';
import {
  getDefaultServiceMeta,
  getServiceJsonLd,
  setServicePageMeta,
} from '../utils/serviceMeta';

export function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[→·]/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const SEO: Record<string, { metaTitle: string; metaDescription: string }> = {
  'pps-el-nido': {
    metaTitle: 'Puerto Princesa to El Nido Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van from Puerto Princesa to El Nido starting at ₱6,900 (promo from ₱7,000). Door-to-door service, no shared vans, trusted local drivers. Book online today!',
  },
  'el-nido-pps': {
    metaTitle: 'El Nido to Puerto Princesa Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van from El Nido to Puerto Princesa starting at ₱6,900 (promo from ₱7,000). Door-to-door service, no shared vans, trusted local drivers. Book online today!',
  },
  'pps-port-barton': {
    metaTitle: 'Puerto Princesa to Port Barton Private Transfer | Palawan Private Rides',
    metaDescription: 'Private van transfer from Puerto Princesa to Port Barton starting at ₱5,400 (promo from ₱5,500). Comfortable, air-conditioned, door-to-door service. No shared vans. Book now!',
  },
  'port-barton-pps': {
    metaTitle: 'Port Barton to Puerto Princesa Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van from Port Barton to Puerto Princesa starting at ₱5,400 (promo from ₱5,500). Door-to-door service, no shared vans, trusted local drivers. Book today!',
  },
  'pps-san-vicente': {
    metaTitle: 'Puerto Princesa to San Vicente Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van from Puerto Princesa to San Vicente starting at ₱5,900 (promo from ₱6,000). Direct, door-to-door transfer to Long Beach. No shared vans. Book today!',
  },
  'san-vicente-pps': {
    metaTitle: 'San Vicente to Puerto Princesa Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van from San Vicente to Puerto Princesa starting at ₱5,900 (promo from ₱6,000). Door-to-door service, no shared vans, trusted local drivers. Book today!',
  },
  'pps-astoria-palawan': {
    metaTitle: 'Puerto Princesa to Astoria Palawan Private Transfer | Palawan Private Rides',
    metaDescription: 'Private van transfer from Puerto Princesa to Astoria Palawan starting at ₱2,900 (promo from ₱3,000). Comfortable, on-time, door-to-door. Book your private ride today!',
  },
  'astoria-palawan-pps': {
    metaTitle: 'Astoria Palawan to Puerto Princesa Private Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van from Astoria Palawan to Puerto Princesa starting at ₱2,900 (promo from ₱3,000). Comfortable, on-time, door-to-door service. Book today!',
  },
  'pps-sabang-four-points': {
    metaTitle: 'Puerto Princesa to Sabang Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Private van from Puerto Princesa to Sabang starting at ₱3,400 (promo from ₱3,500). Perfect for Underground River day trips. Door-to-door, no shared vans. Book now!',
  },
  'sabang-four-points-pps': {
    metaTitle: 'Sabang to Puerto Princesa Private Van Transfer | Palawan Private Rides',
    metaDescription: 'Book a private van from Sabang to Puerto Princesa starting at ₱3,400 (promo from ₱3,500). Door-to-door service after your Underground River visit. No shared vans. Book today!',
  },
  'airport-hotel-transfer': {
    metaTitle: 'Puerto Princesa Airport Transfer | Palawan Private Rides',
    metaDescription: 'Reliable airport pickup and hotel transfers in Puerto Princesa starting at ₱550. On-time, no hidden charges, air-conditioned van. Book now!',
  },
  'puerto-princesa-city-tour': {
    metaTitle: 'Puerto Princesa City Tour Package | Palawan Private Rides',
    metaDescription: "Book a private Puerto Princesa City Tour starting at ₱800/person. Visit Crocodile Farm, Baker's Hill & more. Private group tour. Book online!",
  },
  'underground-river-day-tour': {
    metaTitle: 'Underground River Day Tour Puerto Princesa | Palawan Private Rides',
    metaDescription: 'Private Underground River Day Tour from Puerto Princesa at ₱2,500/person plus ₱150 environmental fee. Includes transport, guide, buffet lunch & permits. Book today!',
  },
  'iwahig-firefly-watching': {
    metaTitle: 'Iwahig Firefly Watching Tour Puerto Princesa | Palawan Private Rides',
    metaDescription: 'Book the Iwahig Firefly Watching tour in Puerto Princesa starting at ₱1,850/person. Includes dinner, guide & private transport. Book now!',
  },
  'ppc-beach-day-trip': {
    metaTitle: 'Puerto Princesa Beach Day Trip | Palawan Private Rides',
    metaDescription: 'Private beach day trip from Puerto Princesa starting at ₱2,700. Choose Nagtabon, Tala, or Pakpak Lauin Beach. Includes private van & driver.',
  },
  'honda-bay-island-tour': {
    metaTitle: 'Honda Bay Island Tour Puerto Princesa | Palawan Private Rides',
    metaDescription: 'Book Honda Bay Island Tour from Puerto Princesa at ₱1,800/person plus ₱150 environmental fee. Visit Cowrie Island, Luli Island & Pambato Reef. Includes boat, guide & lunch!',
  },
  'el-nido-island-tour-a': {
    metaTitle: 'El Nido Island Tour A | Palawan Private Rides',
    metaDescription: 'Book El Nido Island Tour A at ₱1,500/person plus ₱400 environmental & ₱200 entrance fees. Big Lagoon, Secret Lagoon & Seven Commandos Beach. Includes boat, guide & lunch.',
  },
  'el-nido-island-tour-b': {
    metaTitle: 'El Nido Island Tour B | Palawan Private Rides',
    metaDescription: 'Book El Nido Island Tour B at ₱1,600/person plus ₱400 environmental fee. Snake Island, Cathedral Cave & Entalula Beach. Includes boat, guide & buffet lunch.',
  },
  'el-nido-island-tour-c': {
    metaTitle: 'El Nido Island Tour C | Palawan Private Rides',
    metaDescription: 'Book El Nido Island Tour C at ₱1,700/person plus ₱400 environmental & ₱200 entrance fees. Hidden Beach, Secret Beach & Matinloc Shrine. Includes boat, guide & lunch.',
  },
  'el-nido-island-tour-d': {
    metaTitle: 'El Nido Island Tour D | Palawan Private Rides',
    metaDescription: 'Book El Nido Island Tour D at ₱1,500/person plus ₱400 environmental & ₱200 entrance fees. Small Lagoon, Cadlao Lagoon & Paradise Beach. Includes boat, guide & lunch.',
  },
};

const DEFAULT_INCLUDED = [
  'Private vehicle & professional driver',
  'Door-to-door service',
  'Air-conditioned vehicle',
  'Friendly & knowledgeable local driver',
];

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { convertPrice } = useCurrency();
  const [booking, setBooking] = useState(false);

  const tour = tours.find((t) => slugify(t.name) === slug);
  const seo = tour
    ? (SEO[slug ?? ''] ?? getDefaultServiceMeta(tour))
    : null;

  useEffect(() => {
    if (!tour || !seo || !slug) return;
    setServicePageMeta(slug, seo);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'service-jsonld';
    script.textContent = JSON.stringify(getServiceJsonLd(slug, tour, seo.metaDescription));
    document.head.appendChild(script);

    return () => {
      document.getElementById('service-jsonld')?.remove();
    };
  }, [slug, tour, seo]);

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Service not found.</p>
        <button onClick={() => navigate('/rides')} className="text-primary underline">Browse all rides</button>
      </div>
    );
  }

  const flatPrice = parseInt(tour.price);
  const startingPrice = tour.pricing
    ? Math.min(...tour.pricing.map((p) => parseInt(p.price)))
    : flatPrice;
  const displayPrice = hasPromoRate(tour.type) ? flatPrice : startingPrice;
  const perLabel = tour.type === 'Tour Package' || tour.type === 'Transfer' ? 'per person' : 'per booking';
  const included = tour.whatsIncluded ?? DEFAULT_INCLUDED;

  const relatedTours = getRelatedTours(tour, tours);
  const whatsappHref = buildServiceWhatsAppUrl(tour.name);
  const listPath = getServiceListPath(tour.type);
  const tourBasePrice = parseInt(tour.price);

  const handleBook = () => {
    setBooking(true);
    setTimeout(() => navigate('/book', {
      state: {
        tourName: tour.name,
        tourPrice: tour.price,
        tourType: tour.type,
        pricing: tour.pricing,
      },
    }), 500);
  };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <Navbar />

      <div className="relative h-[50vh] min-h-[320px] mt-16">
        <img
          src={tour.images[0]}
          alt={`${tour.name} - ${tour.type} in Palawan | Palawan Private Rides`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-5xl mx-auto w-full">
          <ServiceBreadcrumb type={tour.type} serviceName={tour.name} />
          <span className="inline-block bg-[#e8a020] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
            {tour.type}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {tour.name}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-white/75 font-medium">
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="text-[#e8a020] fill-[#e8a020]" />
              5.0 · 9 Google reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <Shield size={12} className="text-[#e8a020]" />
              Trusted by 300+ travelers
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                <MapPin size={14} className="text-primary" /> Palawan, Philippines
              </span>
              {tour.duration && (
                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  <Clock size={14} className="text-primary" /> {tour.duration}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                <Users size={14} className="text-primary" /> {tour.pax}
              </span>
            </div>

            {/* About */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">About this service</h2>
              <p className="text-gray-600 leading-relaxed">{tour.description}</p>
            </div>

            {/* Pricing tiers */}
            {tour.pricing && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-4">Pricing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tour.pricing.map((p) => {
                    const tierPrice = parseInt(p.price);
                    const tierOriginal = getPromoOriginalPrice(tierPrice, tour.type);
                    const tierPromo = hasPromoRate(tour.type) && tierOriginal !== null;
                    return (
                      <div
                        key={p.vehicle}
                        className={`border rounded-2xl p-4 text-center transition-colors ${
                          tierPromo
                            ? 'border-[#e8a020]/40 bg-[#e8a020]/10 hover:border-[#e8a020]'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        <p className="text-xs text-gray-500 mb-1">{p.vehicle}</p>
                        {tierPromo ? (
                          <>
                            <p className="text-sm text-gray-400 line-through">{convertPrice(tierOriginal)}</p>
                            <p className="text-xl font-black text-[#c8870f]">{convertPrice(tierPrice)}</p>
                            <p className="text-xs font-black text-[#1a3728] mt-1">Promo rate</p>
                          </>
                        ) : (
                          <p className="text-xl font-black text-primary">{convertPrice(tierPrice)}</p>
                        )}
                        {p.capacity && <p className="text-xs text-gray-400 mt-1">Max {p.capacity} pax</p>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  <Check size={12} /> Rates include fuel and professional driver
                </p>
              </div>
            )}

            <ServiceTourFeesBox name={tour.name} type={tour.type} basePrice={tourBasePrice} />

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {included.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-primary" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <ServicePhotoGrid images={tour.images} title={tour.name} />

            <ServiceFaq tour={tour} />
          </div>

          {/* Right — sticky booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              {hasPromoRate(tour.type) && (
                <div className="mb-2">
                  <PromoBadge />
                </div>
              )}
              <p className="text-xs text-gray-400 mb-1">
                {hasPromoRate(tour.type) ? 'Promo rate from' : 'Starting from'}
              </p>
              <div className="mb-1">
                <PromoPrice amount={displayPrice} type={tour.type} size="lg" />
              </div>
              <p className="text-xs text-gray-400 mb-6">{perLabel}</p>

              <button
                disabled={booking}
                onClick={handleBook}
                className="w-full bg-[#e8a020] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#d49020] transition-colors mb-3 flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {booking ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg> Loading...</> : <><Car size={16} /> Book Now</>}
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-[#25D366] text-[#25D366] py-3.5 rounded-xl font-bold text-sm hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> Ask on WhatsApp
              </a>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                {['No shared vans', 'Free cancellation inquiry', 'Fixed, transparent rates', 'Local trusted drivers'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
                    <Check size={11} className="text-primary flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related services */}
        {relatedTours.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTours.map((t) => (
                <button
                  key={t.name}
                  onClick={() => navigate(`/services/${slugify(t.name)}`)}
                  className="text-left border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <img
                    src={t.images[0]}
                    alt={`${t.name} - Palawan Private Rides`}
                    loading="lazy"
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <div className="mt-1">
                      <PromoPrice
                        amount={
                          hasPromoRate(t.type)
                            ? parseInt(t.price)
                            : t.pricing
                              ? Math.min(...t.pricing.map((p) => parseInt(p.price)))
                              : parseInt(t.price)
                        }
                        type={t.type}
                        size="sm"
                        showPromoLabel={false}
                        showSavings={false}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-10">
          <Link
            to={listPath.href}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back to {listPath.label}
          </Link>
        </div>
      </div>

      <ServiceStickyCta onBook={handleBook} booking={booking} whatsappHref={whatsappHref} />
      <SiteFooter />
    </div>
  );
}
