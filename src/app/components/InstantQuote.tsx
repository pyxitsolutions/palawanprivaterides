import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PromoPrice } from './PromoPrice';
import { hasPromoRate } from '../utils/pricing';
import { tours } from '../data/tours';

const RIDE_OPTIONS = tours.filter((t) => t.type === 'Private Ride' || t.type === 'Transfer');
const DEFAULT_CAPACITY: Record<string, number> = { 'Sedan/Hatchback': 3, 'SUV': 6, 'Van': 13 };

export function InstantQuote() {
  const navigate = useNavigate();
  const [serviceIdx, setServiceIdx] = useState(0);
  const [pax, setPax] = useState('');
  const [booking, setBooking] = useState(false);

  const service = RIDE_OPTIONS[serviceIdx];

  const MAX_VAN = 13;
  const quote = useMemo(() => {
    const n = parseInt(pax);
    if (!n || n < 1 || !service) return null;
    if (service.pricing) {
      const vanPrice = parseInt(service.pricing.find((p) => p.vehicle === 'Van')?.price ?? service.price);
      if (n > MAX_VAN) {
        const vansNeeded = Math.ceil(n / MAX_VAN);
        return {
          vehicle: `${vansNeeded}× Van`,
          price: vansNeeded * vanPrice,
          capacity: vansNeeded * MAX_VAN,
          isFleet: true,
        };
      }
      const tier =
        service.pricing.find((p) => (DEFAULT_CAPACITY[p.vehicle] ?? 13) >= n) ??
        service.pricing[service.pricing.length - 1];
      return {
        vehicle: tier.vehicle,
        price: parseInt(tier.price),
        capacity: DEFAULT_CAPACITY[tier.vehicle] ?? 13,
        isFleet: false,
      };
    }
    return { vehicle: 'Van', price: parseInt(service.price), capacity: 8, isFleet: false };
  }, [service, pax]);

  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-2">No surprises</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Get an Instant Quote</h2>
          <p className="text-gray-500 text-sm mt-2">Select your route and group size — see the price instantly.</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Service / Route
              </label>
              <select
                value={serviceIdx}
                onChange={(e) => {
                  setServiceIdx(Number(e.target.value));
                  setPax('');
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {RIDE_OPTIONS.map((t, i) => (
                  <option key={t.name} value={i}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Number of Passengers
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                placeholder="e.g. 4"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {quote ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  {quote.isFleet ? 'Fleet booking required' : 'Recommended vehicle'}
                </p>
                <p className="font-black text-gray-900 text-lg">
                  {quote.vehicle}{' '}
                  <span className="text-xs font-normal text-gray-400">— max {quote.capacity} pax</span>
                </p>
                <div className="mt-1">
                  <PromoPrice
                    amount={quote.price}
                    type={service.type}
                    size="lg"
                    showPromoLabel={hasPromoRate(service.type)}
                    showSavings={hasPromoRate(service.type)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {quote.isFleet ? 'estimated total' : 'per booking'}
                  </p>
                </div>
                {quote.isFleet && (
                  <p className="text-xs text-amber-600 mt-1">
                    Final fleet arrangement confirmed via WhatsApp.
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={booking}
                onClick={() => {
                  setBooking(true);
                  setTimeout(
                    () =>
                      navigate('/book', {
                        state: {
                          tourName: service.name,
                          tourPrice: service.price,
                          tourType: service.type,
                          pricing: service.pricing,
                        },
                      }),
                    600,
                  );
                }}
                className="bg-[#e8a020] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#d49020] transition-colors flex-shrink-0 flex items-center gap-2 disabled:opacity-80"
              >
                {booking ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Book Now →'
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-5 text-center text-gray-400 text-sm">
              Select a route and enter your group size to see the price.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
