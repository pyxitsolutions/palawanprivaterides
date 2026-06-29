import { useNavigate } from 'react-router-dom';

export function OffseasonBanner() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#1a3728] border-y border-[#e8a020]/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <button
          type="button"
          onClick={() => navigate('/rides')}
          className="block w-full max-w-3xl sm:max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020]"
          aria-label="Offseason discount — ₱500 off per booking on PPS to El Nido, Port Barton, and San Vicente private rides"
        >
          <img
            src="/offseason-img.png"
            alt="Offseason discount — ₱500 off per booking on private rides to El Nido, Port Barton, and San Vicente"
            className="w-full h-auto"
            loading="eager"
          />
        </button>
        <p className="text-center text-[11px] text-white/50 mt-2">
          Promo valid for a limited time · PPS ↔ El Nido, Port Barton & San Vicente
        </p>
      </div>
    </section>
  );
}
