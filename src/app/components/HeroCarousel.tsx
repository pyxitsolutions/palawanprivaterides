import { Car, Plane, Map, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import hero1 from '../../hero/hero-1.webp';

export function HeroCarousel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleNav = (key: string, path: string) => {
    setLoading(key);
    setTimeout(() => navigate(path), 600);
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      {/* Background Image */}
      <img
        src={hero1}
        alt="Palawan"
        className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
        loading="eager"
      />

      {/* Dark blur overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-20 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#e8a020] rounded-full" />
            Palawan, Philippines • Private Tours & Rides
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Your Private Ride<br />
            Across<br />
            <span className="text-[#e8a020]">Palawan.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
            Door-to-door private van transfers and guided tours from Puerto Princesa to El Nido, Port Barton, San Vicente & beyond. No shared vans. Just you, your group, and the open road.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleNav('rides', '/rides')}
              disabled={!!loading}
              className="bg-[#e8a020] text-white px-7 py-3.5 rounded-full font-bold hover:bg-[#d49020] transition-all flex items-center gap-2 disabled:opacity-80"
            >
              {loading === 'rides' ? <Loader2 size={18} className="animate-spin" /> : <Car size={18} />}
              Private Transfers
            </button>
            <button
              onClick={() => handleNav('tours', '/tours')}
              disabled={!!loading}
              className="bg-primary text-white px-7 py-3.5 rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-80"
            >
              {loading === 'tours' ? <Loader2 size={18} className="animate-spin" /> : <Map size={18} />}
              Tour Packages
            </button>
            <button
              onClick={() => handleNav('airport', '/rides')}
              disabled={!!loading}
              className="bg-white/15 border border-white/30 backdrop-blur-sm text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/25 transition-all flex items-center gap-2 disabled:opacity-80"
            >
              {loading === 'airport' ? <Loader2 size={18} className="animate-spin" /> : <Plane size={18} />}
              Airport Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
