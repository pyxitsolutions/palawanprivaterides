import { useCurrency } from '../../context/CurrencyContext';
import { Check } from 'lucide-react';

/** Example tier caps — actual price varies by route (see each card). */
const TIERS = [
  { vehicle: 'Sedan / Hatchback', capacity: 'Up to 3 pax', note: 'Couples & small groups' },
  { vehicle: 'SUV', capacity: 'Up to 6 pax', note: 'Families' },
  { vehicle: 'Van', capacity: 'Up to 13 pax', note: 'Large groups & luggage' },
];

export function VehicleTierTable({ exampleFromPrice }: { exampleFromPrice: string }) {
  const { convertPrice } = useCurrency();

  return (
    <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">Choose your vehicle size</h2>
      <p className="text-sm text-gray-500 mb-4">
        Private rides are priced <span className="font-semibold">per booking</span> (whole vehicle). Rates
        vary by route — e.g. PPS → El Nido from {convertPrice(parseInt(exampleFromPrice))} promotional.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TIERS.map((tier) => (
          <div key={tier.vehicle} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="font-bold text-gray-900 text-sm">{tier.vehicle}</p>
            <p className="text-primary font-black text-lg mt-1">{tier.capacity}</p>
            <p className="text-xs text-gray-500 mt-1">{tier.note}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-primary mt-3 flex items-center gap-1 font-semibold">
        <Check size={12} /> Fuel & professional driver included on all private rides
      </p>
    </div>
  );
}
