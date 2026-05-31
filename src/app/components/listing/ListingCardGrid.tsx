import { CarCard } from '../CarCard';
import { slugify } from '../../pages/ServicePage';
import type { Tour } from '../../data/tours';

interface ListingCardGridProps {
  tours: Tour[];
  highlightName?: string | null;
}

export function ListingCardGrid({ tours, highlightName }: ListingCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {tours.map((tour) => (
        <div
          key={tour.name}
          id={`listing-${slugify(tour.name)}`}
          className={`scroll-mt-28 rounded-2xl transition-shadow ${
            highlightName === tour.name ? 'ring-2 ring-[#e8a020] ring-offset-2' : ''
          }`}
        >
          <CarCard {...tour} />
        </div>
      ))}
    </div>
  );
}

export function ListingGroupedSections({
  groups,
  highlightName,
}: {
  groups: { label: string; tours: Tour[] }[];
  highlightName?: string | null;
}) {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.label}>
          <h2 className="text-xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
            {group.label}
          </h2>
          <ListingCardGrid tours={group.tours} highlightName={highlightName} />
        </div>
      ))}
    </div>
  );
}
