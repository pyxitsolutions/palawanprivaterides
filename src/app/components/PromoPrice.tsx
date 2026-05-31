import { useCurrency } from '../context/CurrencyContext';
import { getPromoOriginalPrice, hasPromoRate, PRIVATE_RIDE_PROMO_SAVINGS } from '../utils/pricing';

type Variant = 'dark' | 'light';
type Size = 'sm' | 'md' | 'lg';

interface PromoPriceProps {
  amount: number;
  type: string;
  variant?: Variant;
  size?: Size;
  showPromoLabel?: boolean;
  showSavings?: boolean;
}

const priceSize: Record<Size, { promo: string; original: string; label: string; savings: string }> = {
  sm: {
    promo: 'text-xl font-black',
    original: 'text-xs',
    label: 'text-[11px]',
    savings: 'text-[11px]',
  },
  md: {
    promo: 'text-2xl font-black',
    original: 'text-sm',
    label: 'text-xs',
    savings: 'text-xs',
  },
  lg: {
    promo: 'text-4xl font-black',
    original: 'text-base',
    label: 'text-sm',
    savings: 'text-sm',
  },
};

export function PromoBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center bg-[#1a3728] border border-[#e8a020] text-[#e8a020] text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${className}`}
    >
      Promo
    </span>
  );
}

export function PromoPrice({
  amount,
  type,
  variant = 'light',
  size = 'md',
  showPromoLabel = true,
  showSavings = true,
}: PromoPriceProps) {
  const { convertPrice } = useCurrency();
  const promo = hasPromoRate(type);
  const original = promo ? getPromoOriginalPrice(amount, type) : null;
  const s = priceSize[size];

  const promoColor = variant === 'dark' ? 'text-[#e8a020]' : 'text-[#c8870f]';
  const originalColor = variant === 'dark' ? 'text-white/45' : 'text-gray-400';
  const labelColor = variant === 'dark' ? 'text-[#e8a020]' : 'text-[#1a3728]';
  const savingsBg =
    variant === 'dark'
      ? 'bg-[#e8a020]/25 text-[#ffc84d]'
      : 'bg-[#e8a020]/15 text-[#a66b08]';

  if (!promo || original === null) {
    return <p className={`${s.promo} ${promoColor}`}>{convertPrice(amount)}</p>;
  }

  return (
    <div>
      {showPromoLabel && (
        <p className={`${s.label} font-black uppercase tracking-wider mb-0.5 ${labelColor}`}>
          Promo rate
        </p>
      )}
      <p className={`${s.original} line-through ${originalColor}`}>{convertPrice(original)}</p>
      <p className={`${s.promo} ${promoColor} leading-none`}>{convertPrice(amount)}</p>
      {showSavings && (
        <span className={`inline-block mt-1.5 ${s.savings} font-black px-2.5 py-1 rounded-full ${savingsBg}`}>
          Save {convertPrice(PRIVATE_RIDE_PROMO_SAVINGS)} per booking
        </span>
      )}
    </div>
  );
}
