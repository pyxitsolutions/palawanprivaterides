import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { PageTrustLine } from '../components/PageTrustLine';
import { cityTours } from '../data/tours';
import {
  TOURS_BLOG_LINKS,
  TOURS_POPULAR_ORDER,
  groupTours,
  sortByPopular,
  sortByPriceAsc,
} from '../data/listingPages';
import { setListingPageMeta } from '../utils/pageMeta';
import { ListingControls, type SortOption } from '../components/listing/ListingControls';
import { ListingBlogLinks } from '../components/listing/ListingBlogLinks';
import { CrossSellBanner } from '../components/listing/CrossSellBanner';
import { TourFeesNotice } from '../components/listing/TourFeesNotice';
import { ElNidoTourGuideStrip } from '../components/listing/ElNidoTourGuideStrip';
import { ListingCardGrid, ListingGroupedSections } from '../components/listing/ListingCardGrid';
import { Star, Users, MapPin, BadgeCheck, MessageCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import heroImg from '../../tour/tour-honda.webp';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Puerto Princesa', value: 'pps' },
  { label: 'El Nido', value: 'elnido' },
  { label: 'Sabang / UR', value: 'sabang' },
  { label: 'Evening', value: 'evening' },
];

const highlights = [
  { icon: <Star size={18} />, label: 'Licensed Tour Guides' },
  { icon: <Users size={18} />, label: 'Private Groups Only' },
  { icon: <MapPin size={18} />, label: 'Hotel Pickup Included' },
  { icon: <BadgeCheck size={18} />, label: 'Transparent Pricing' },
];

export default function ToursPage() {
  const { convertPrice } = useCurrency();
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState<SortOption>('popular');
  const [groupBy, setGroupBy] = useState(true);

  useEffect(() => {
    setListingPageMeta(
      '/tours',
      'Private Tour Packages in Palawan | Palawan Private Rides',
      'Private tours in Puerto Princesa & El Nido — Underground River, Honda Bay, island hopping A–D, firefly watching. From ₱1,500/person plus government fees.',
    );
  }, []);

  const filtered = useMemo(() => {
    let list = cityTours.filter((t) => {
      if (typeFilter === 'all') return true;
      if (typeFilter === 'evening') return t.duration?.toLowerCase().includes('evening');
      if (typeFilter === 'elnido') return t.name.includes('El Nido Island Tour');
      if (typeFilter === 'sabang') {
        return t.name.includes('Underground') || t.name.includes('Sabang');
      }
      if (typeFilter === 'pps') return !t.name.includes('El Nido Island Tour');
      return true;
    });
    list = sort === 'popular' ? sortByPopular(list, TOURS_POPULAR_ORDER) : sortByPriceAsc(list);
    return list;
  }, [typeFilter, sort]);

  const groups = useMemo(() => groupTours(filtered), [filtered]);
  const showGrouped = groupBy && typeFilter === 'all';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative min-h-[55vh] flex items-end">
        <img
          src={heroImg}
          alt="Private tour packages in Palawan - Honda Bay and Puerto Princesa tours"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <p className="text-[#e8a020] text-sm font-bold uppercase tracking-widest mb-3">
            Puerto Princesa & El Nido, Palawan
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Tour
            <br />
            <span className="text-[#e8a020]">Packages</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-4">
            Private guided tours in Puerto Princesa and island hopping in El Nido — local guides, your
            group only.
          </p>
          <p className="text-[#ffc84d] text-sm font-black mb-4">
            Tours from {convertPrice(1500)} / person (+ env & entrance where noted)
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
          <div className="flex flex-wrap gap-2 justify-center mb-8">
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

          <TourFeesNotice />
          <ElNidoTourGuideStrip />

          <ListingControls
            resultCount={filtered.length}
            resultLabel={filtered.length === 1 ? 'tour' : 'tours'}
            sort={sort}
            onSortChange={setSort}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
          />

          <CrossSellBanner variant="tours" />

          <ListingBlogLinks links={TOURS_BLOG_LINKS} heading="Tour planning guides" />

          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-gray-300 bg-white">
              <p className="text-gray-600 font-semibold mb-2">No tours match this filter.</p>
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className="text-primary font-bold text-sm hover:underline"
              >
                Show all tours
              </button>
            </div>
          ) : showGrouped ? (
            <ListingGroupedSections groups={groups} />
          ) : (
            <ListingCardGrid tours={filtered} />
          )}

          <div className="mt-14 rounded-3xl bg-primary overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">
              <div>
                <p className="text-[#e8a020] text-xs font-bold uppercase tracking-widest mb-1">
                  Custom Itinerary
                </p>
                <h3 className="text-2xl font-black text-white mb-1">Want a custom tour?</h3>
                <p className="text-white/60 text-sm">
                  We'll plan the perfect Palawan experience for your group.
                </p>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20want%20to%20plan%20a%20custom%20tour%20in%20Palawan."
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

      <SiteFooter />
      <ScrollToTopButton />
    </div>
  );
}
