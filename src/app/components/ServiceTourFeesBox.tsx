import { useCurrency } from '../context/CurrencyContext';
import { getTourExtraFees } from '../utils/pricing';

interface ServiceTourFeesBoxProps {
  name: string;
  type: string;
  basePrice: number;
}

export function ServiceTourFeesBox({ name, type, basePrice }: ServiceTourFeesBoxProps) {
  const { convertPrice } = useCurrency();
  const fees = getTourExtraFees(name, type);

  if (type !== 'Tour Package' || fees === null) return null;

  const extras = fees.environmental + fees.entrance;

  return (
    <div className="rounded-2xl border border-[#e8a020]/30 bg-[#e8a020]/5 p-5">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3">
        Price breakdown (per person)
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex justify-between gap-4">
          <span>Tour rate</span>
          <span className="font-bold">{convertPrice(basePrice)}</span>
        </li>
        {fees.environmental > 0 && (
          <li className="flex justify-between gap-4">
            <span>Environmental fee</span>
            <span className="font-bold">+{convertPrice(fees.environmental)}</span>
          </li>
        )}
        {fees.entrance > 0 && (
          <li className="flex justify-between gap-4">
            <span>Entrance fee</span>
            <span className="font-bold">+{convertPrice(fees.entrance)}</span>
          </li>
        )}
        <li className="flex justify-between gap-4 pt-2 border-t border-[#e8a020]/20 font-black text-gray-900">
          <span>Estimated from</span>
          <span className="text-[#c8870f]">{convertPrice(basePrice + extras)} / person</span>
        </li>
      </ul>
      <p className="text-xs text-gray-500 mt-3">
        Government fees are paid separately and may vary. Final total depends on group size at booking.
      </p>
    </div>
  );
}
