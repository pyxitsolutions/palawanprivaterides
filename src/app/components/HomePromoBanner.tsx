import { ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { PRIVATE_RIDE_PROMO_SAVINGS } from '../utils/pricing';

export function HomePromoBanner() {
  const navigate = useNavigate();
  const { convertPrice } = useCurrency();

  return (
    <div className="relative z-20 -mt-px bg-[#1a3728] border-y border-[#e8a020]/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#e8a020]/20 border border-[#e8a020]/40 flex items-center justify-center text-[#e8a020]">
            <Tag size={16} strokeWidth={2.5} />
          </span>
          <p className="text-sm sm:text-base text-white/95 leading-snug">
            <span className="font-black text-[#e8a020]">Promotional rate</span>
            <span className="text-white/80"> — save {convertPrice(PRIVATE_RIDE_PROMO_SAVINGS)} per booking on private transfers</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/rides')}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 bg-[#e8a020] text-[#1a3728] px-5 py-2 rounded-full text-sm font-black hover:bg-[#ffc84d] transition-colors"
        >
          Book now
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
