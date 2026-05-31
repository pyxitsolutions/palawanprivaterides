import { PromoPrice } from '../PromoPrice';
import { hasPromoRate } from '../../utils/pricing';

interface BookingSummaryPanelProps {
  tourName: string;
  tourType: string;
  typeLabel: string;
  showTotal: boolean;
  grandTotal: number;
  convertPrice: (n: number) => string;
  isMultiVehicle: boolean;
  vehiclesNeeded: number;
  vanPrice: number;
  paxCount: number;
  basePrice: number;
  pricing?: { vehicle: string; price: string }[];
  formData: {
    pax: string;
    vehicleType: string;
    tourDate: string;
    tourTime: string;
    tourPeriod: string;
  };
  envFee: number;
  entranceFee: number;
  envTotal: number;
  entranceTotal: number;
  subtotal: number;
}

export function BookingSummaryPanel({
  tourName,
  tourType,
  typeLabel,
  showTotal,
  grandTotal,
  convertPrice,
  isMultiVehicle,
  vehiclesNeeded,
  vanPrice,
  paxCount,
  basePrice,
  pricing,
  formData,
  envFee,
  entranceFee,
  envTotal,
  entranceTotal,
  subtotal,
}: BookingSummaryPanelProps) {
  const showPromo = hasPromoRate(tourType);

  return (
    <aside className="lg:sticky lg:top-24 h-fit">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#1a3728] px-4 py-3">
          <p className="text-[10px] font-bold text-[#e8a020] uppercase tracking-widest">{typeLabel}</p>
          <p className="text-white font-black text-lg leading-tight mt-0.5">{tourName}</p>
        </div>
        <div className="p-4 space-y-3 text-sm">
          {showTotal ? (
            <>
              {formData.vehicleType && !isMultiVehicle && (
                <p className="text-gray-600">
                  <span className="text-gray-400">Vehicle:</span> {formData.vehicleType}
                </p>
              )}
              {isMultiVehicle && (
                <p className="text-gray-600">
                  <span className="text-gray-400">Fleet:</span> {vehiclesNeeded}× Van
                </p>
              )}
              {formData.pax && (
                <p className="text-gray-600">
                  <span className="text-gray-400">Passengers:</span> {formData.pax}
                </p>
              )}
              {(formData.tourDate || formData.tourTime || formData.tourPeriod) && (
                <p className="text-gray-600">
                  <span className="text-gray-400">When:</span>{' '}
                  {[formData.tourDate, formData.tourTime || formData.tourPeriod].filter(Boolean).join(' · ')}
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                {isMultiVehicle && (
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>{convertPrice(vanPrice)} × {vehiclesNeeded} vans</span>
                    <span>{convertPrice(subtotal)}</span>
                  </div>
                )}
                {envFee > 0 && paxCount > 0 && (
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Env fee × {paxCount}</span>
                    <span>{convertPrice(envTotal)}</span>
                  </div>
                )}
                {entranceFee > 0 && paxCount > 0 && (
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Entrance × {paxCount}</span>
                    <span>{convertPrice(entranceTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-gray-800">Estimated total</span>
                  <div className="text-right">
                    {showPromo && !isMultiVehicle ? (
                      <PromoPrice amount={grandTotal} type={tourType} size="sm" showSavings showPromoLabel={false} />
                    ) : (
                      <span className="text-xl font-black text-primary">{convertPrice(grandTotal)}</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {showPromo ? 'Promo rate from' : 'Starting from'}
              </p>
              <PromoPrice
                amount={basePrice}
                type={tourType}
                size="md"
                showPromoLabel={showPromo}
                showSavings={showPromo}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                {tourType === 'Tour Package' || tourType === 'Transfer' ? 'per person' : 'per booking'}
              </p>
            </div>
          )}
          <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-3">
            Request only — we confirm via WhatsApp with fast reply.
          </p>
        </div>
      </div>
    </aside>
  );
}
