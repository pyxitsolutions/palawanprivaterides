import { useNavigate } from 'react-router-dom';
import { Car, Compass, ArrowRight } from 'lucide-react';

interface CrossSellBannerProps {
  variant: 'rides' | 'tours';
}

export function CrossSellBanner({ variant }: CrossSellBannerProps) {
  const navigate = useNavigate();

  if (variant === 'rides') {
    return (
      <div className="mb-10 rounded-2xl bg-[#1a3728]/5 border border-[#1a3728]/15 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Compass size={24} className="text-[#e8a020] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-black text-gray-900">Also planning tours?</h2>
            <p className="text-sm text-gray-600 mt-1">
              Underground River, Honda Bay, El Nido island hopping & more — private group tours.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/tours')}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 shrink-0"
        >
          View tour packages
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-10 rounded-2xl bg-[#e8a020]/10 border border-[#e8a020]/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <Car size={24} className="text-[#1a3728] shrink-0 mt-0.5" />
        <div>
          <h2 className="font-black text-gray-900">Need a private transfer?</h2>
          <p className="text-sm text-gray-600 mt-1">
            Door-to-door vans from Puerto Princesa to El Nido, Port Barton & San Vicente — promo from{' '}
            <span className="font-bold">₱6,900</span> per booking.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate('/rides')}
        className="inline-flex items-center gap-2 bg-[#e8a020] text-[#1a3728] px-5 py-2.5 rounded-full text-sm font-black hover:bg-[#ffc84d] shrink-0"
      >
        View private rides
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
