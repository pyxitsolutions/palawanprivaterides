import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { HomePromoBanner } from '../components/HomePromoBanner';
import { InstantQuote } from '../components/InstantQuote';
import { PageTrustLine } from '../components/PageTrustLine';
import { privateRides, tours } from '../data/tours';
import {
  RIDES_BLOG_LINKS,
  RIDES_POPULAR_NAMES,
  RIDES_POPULAR_ORDER,
  groupRides,
  sortByPopular,
  sortByPriceAsc,
} from '../data/listingPages';
import { setListingPageMeta } from '../utils/pageMeta';
import { ListingControls, type SortOption } from '../components/listing/ListingControls';
import { PopularRouteChips } from '../components/listing/PopularRouteChips';
import { VehicleTierTable } from '../components/listing/VehicleTierTable';
import { ListingBlogLinks } from '../components/listing/ListingBlogLinks';
import { CrossSellBanner } from '../components/listing/CrossSellBanner';
import { ListingCardGrid, ListingGroupedSections } from '../components/listing/ListingCardGrid';
import { Shield, Users, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import heroImg from '../../rides/rides-1.webp';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Private Rides', value: 'Private Ride' },
  { label: 'Airport Transfer', value: 'Transfer' },
];

const highlights = [
  { icon: <Shield size={18} />, label: 'No Shared Rides' },
  { icon: <Users size={18} />, label: 'Private Group Only' },
  { icon: <MapPin size={18} />, label: 'Door-to-Door' },
  { icon: <Clock size={18} />, label: 'Flexible Schedule' },
];

export default function RidesPage() {
  const { convertPrice } = useCurrency();
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState<SortOption>('popular');
  const [groupBy, setGroupBy] = useState(true);
  const [highlightName, setHighlightName] = useState<string | null>(null);

  useEffect(() => {
    setListingPageMeta(
      '/rides',
      'Private Rides & Transfers in Palawan | Palawan Private Rides',
      'Book private van transfers from Puerto Princesa to El Nido, Port Barton & San Vicente. Door-to-door, no shared vans. Promo from ₱6,900 per booking.',
    );
  }, []);

  const filtered = useMemo(() => {
    let list = privateRides.filter((t) => typeFilter === 'all' || t.type === typeFilter);
    list = sort === 'popular' ? sortByPopular(list, RIDES_POPULAR_ORDER) : sortByPriceAsc(list);
    return list;
  }, [typeFilter, sort]);

  const groups = useMemo(() => groupRides(filtered), [filtered]);
  const elNidoTour = tours.find((t) => t.name === 'PPS → El Nido');
  const showGrouped = groupBy && typeFilter === 'all';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HomePromoBanner />

      <section className="relative min-h-[55vh] flex items-end">
        <img
          src={heroImg}
          alt="Private van transfers across Palawan - Puerto Princesa to El Nido and Port Barton"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <p className="text-[#e8a020] text-sm font-bold uppercase tracking-widest mb-3">
            Private Land Transport
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Private Rides
            <br />
            <span className="text-[#e8a020]">& Transfers</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-4">
            Door-to-door transfers across Palawan — just your group, your driver, and the open road.
          </p>
          <p className="text-[#ffc84d] text-sm font-black mb-4">
            Promotional rates from {convertPrice(6900)} per booking
          </p>
          <PageTrustLine className="mb-6" />

          <div className="flex flex-wrap gap-3">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full"
              >
                <span className="text-[#e8a020]">{h.icon}</span>
                {h.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  typeFilter === f.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <PopularRouteChips
            names={RIDES_POPULAR_NAMES}
            onSelect={(name) => {
              setHighlightName(name);
              setTimeout(() => setHighlightName(null), 4000);
            }}
          />

          <ListingControls
            resultCount={filtered.length}
            resultLabel={filtered.length === 1 ? 'route' : 'routes'}
            sort={sort}
            onSortChange={setSort}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
          />

          <CrossSellBanner variant="rides" />

          {elNidoTour && <VehicleTierTable exampleFromPrice={elNidoTour.price} />}

          <ListingBlogLinks links={RIDES_BLOG_LINKS} heading="Plan your route" />

          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-gray-300 bg-white">
              <p className="text-gray-600 font-semibold mb-2">No routes match this filter.</p>
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className="text-primary font-bold text-sm hover:underline"
              >
                Show all routes
              </button>
            </div>
          ) : showGrouped ? (
            <ListingGroupedSections groups={groups} highlightName={highlightName} />
          ) : (
            <ListingCardGrid tours={filtered} highlightName={highlightName} />
          )}

          <div className="mt-14 rounded-3xl bg-primary overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">
              <div>
                <p className="text-[#e8a020] text-xs font-bold uppercase tracking-widest mb-1">Custom Route</p>
                <h3 className="text-2xl font-black text-white mb-1">Don't see your destination?</h3>
                <p className="text-white/60 text-sm">We go anywhere in Palawan — just ask us for a quote.</p>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20need%20a%20custom%20transfer%20in%20Palawan."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#e8a020] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#d49020] transition-colors"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <InstantQuote />

      <SiteFooter />
      <ScrollToTopButton />
    </div>
  );
}
