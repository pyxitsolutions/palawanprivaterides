import { useCurrency } from '../context/CurrencyContext';
import {
  getOffseasonDiscountedPrice,
  hasOffseasonDiscount,
  OFFSEASON_DISCOUNT_PER_BOOKING,
} from '../utils/pricing';

type Variant = 'dark' | 'light';
type Size = 'sm' | 'md' | 'lg';

interface PromoPriceProps {
  /** Regular (pre-discount) price */
  amount: number;
  tourName?: string;
  variant?: Variant;
  size?: Size;
  showLabel?: boolean;
  showSavings?: boolean;
  /** @deprecated */
  type?: string;
  showPromoLabel?: boolean;
}

const priceSize: Record<Size, { main: string; original: string; label: string; savings: string }> = {
  sm: {
    main: 'text-xl font-black',
    original: 'text-xs',
    label: 'text-[11px]',
    savings: 'text-[11px]',
  },
  md: {
    main: 'text-2xl font-black',
    original: 'text-sm',
    label: 'text-xs',
    savings: 'text-xs',
  },
  lg: {
    main: 'text-4xl font-black',
    original: 'text-base',
    label: 'text-sm',
    savings: 'text-sm',
  },
};

export function OffseasonBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center bg-[#1a3728] border border-[#e8a020] text-[#e8a020] text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${className}`}
    >
      Offseason
    </span>
  );
}

export function PromoPrice({
  amount,
  tourName,
  variant = 'light',
  size = 'md',
  showLabel = false,
  showSavings = true,
}: PromoPriceProps) {
  const { convertPrice } = useCurrency();
  const s = priceSize[size];
  const offseason = tourName ? hasOffseasonDiscount(tourName) : false;
  const discounted = tourName ? getOffseasonDiscountedPrice(amount, tourName) : amount;

  const mainColor = variant === 'dark' ? 'text-[#e8a020]' : 'text-[#c8870f]';
  const originalColor = variant === 'dark' ? 'text-white/45' : 'text-gray-400';
  const labelColor = variant === 'dark' ? 'text-[#e8a020]' : 'text-[#1a3728]';
  const savingsBg =
    variant === 'dark'
      ? 'bg-[#e8a020]/25 text-[#ffc84d]'
      : 'bg-[#e8a020]/15 text-[#a66b08]';

  if (!offseason) {
    return <p className={`${s.main} ${mainColor} leading-none`}>{convertPrice(amount)}</p>;
  }

  return (
    <div>
      {showLabel && (
        <p className={`${s.label} font-black uppercase tracking-wider mb-0.5 ${labelColor}`}>
          Offseason rate
        </p>
      )}
      <p className={`${s.original} line-through ${originalColor}`}>{convertPrice(amount)}</p>
      <p className={`${s.main} ${mainColor} leading-none`}>{convertPrice(discounted)}</p>
      {showSavings && (
        <span className={`inline-block mt-1.5 ${s.savings} font-black px-2.5 py-1 rounded-full ${savingsBg}`}>
          Save {convertPrice(OFFSEASON_DISCOUNT_PER_BOOKING)} per booking
        </span>
      )}
    </div>
  );
}
