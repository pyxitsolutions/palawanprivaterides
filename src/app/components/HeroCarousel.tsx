import { Car, Plane, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hero1 from '../../hero/hero-1.webp';

export function HeroCarousel() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <img
        src={hero1}
        alt="Private van transfers in Palawan - Puerto Princesa to El Nido, Port Barton and San Vicente"
        className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={1400}
        height={584}
      />

      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-20 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#e8a020] rounded-full" />
            Palawan, Philippines • Private Tours & Rides
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Private Van Transfers<br />
            in <span className="text-[#e8a020]">Palawan.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
            Private van transfers from Puerto Princesa to El Nido, Port Barton & San Vicente. Book your private van transfer in Palawan today — no shared vans, just your group.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/rides')}
              className="bg-[#e8a020] text-white px-7 py-3.5 rounded-full font-bold hover:bg-[#d49020] transition-all flex items-center gap-2"
            >
              <Car size={18} />
              Private Transfers
            </button>
            <button
              type="button"
              onClick={() => navigate('/tours')}
              className="bg-primary text-white px-7 py-3.5 rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Map size={18} />
              Tour Packages
            </button>
            <button
              type="button"
              onClick={() => navigate('/rides')}
              className="bg-white/15 border border-white/30 backdrop-blur-sm text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/25 transition-all flex items-center gap-2"
            >
              <Plane size={18} />
              Airport Transfer
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[
              '⭐ 5.0 · 9 Google Reviews',
              '✔ Local Drivers',
              '✔ Air-Conditioned',
              '✔ Private Only',
              '✔ Airport Pickup',
            ].map((item) => (
              <span key={item} className="text-white/75 text-xs font-semibold tracking-wide">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
