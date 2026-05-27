import { MessageCircle } from 'lucide-react';
import hero1 from '../../hero/hero-1.jpg';

export function HeroCarousel() {
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
            <a
              href="https://api.whatsapp.com/send?phone=639166846547&text=Hi!%20I%20want%20to%20book%20a%20tour%20in%20Palawan."
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/50 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Book Your Private Transfer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
