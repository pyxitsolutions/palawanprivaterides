import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { CarDetailsModal } from './CarDetailsModal';
import { useCurrency } from '../context/CurrencyContext';
import { slugify } from '../pages/ServicePage';

interface PricingTier {
  vehicle: string;
  price: string;
  capacity?: number;
}

interface TourCardProps {
  images: string[];
  name: string;
  price: string;
  type: string;
  duration?: string;
  pax: string;
  description: string;
  pricing?: PricingTier[];
  whatsIncluded?: string[];
}

export function CarCard({ images, name, price, type, duration, pax, description, pricing, whatsIncluded, credit }: TourCardProps & { credit?: string }) {
  const navigate = useNavigate();
  const { convertPrice } = useCurrency();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const routeParts = name.includes(' → ') ? name.split(' → ') : [];
  const directionOptions = routeParts.length === 2
    ? [`${routeParts[0]} → ${routeParts[1]}`, `${routeParts[1]} → ${routeParts[0]}`]
    : [];
  const [selectedDirection] = useState(directionOptions[0] ?? '');

  const tourData = { images, name, price, type, duration, pax, description, pricing, whatsIncluded, credit };
  const startingPrice = pricing
    ? Math.min(...pricing.map((p) => parseInt(p.price)))
    : parseInt(price);
  const perLabel = (type === 'Tour Package' || type === 'Transfer') ? 'per person' : 'per booking';
  const displayPrice = convertPrice(startingPrice);

  const handleBook = () => {
    navigate('/book', { state: { tourName: name, tourPrice: price, tourType: type, pricing, direction: selectedDirection || undefined } });
  };

  return (
    <div
      className="relative overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group aspect-[4/3]"
      onClick={() => setIsDetailsOpen(true)}
    >
      {/* Full bleed image */}
      <img
        src={images[0]}
        alt={`${name} - ${type} in Palawan | Palawan Private Rides`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Type badge */}
      <div className="absolute top-3 left-3">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#e8a020] text-white">
          {type}
        </span>
      </div>

      {/* Tap hint */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
        Tap for details
      </div>

      {/* Photo credit */}
      {credit && (
        <div className="absolute bottom-0 right-0 text-white/40 text-[9px] px-2 py-1">
          © {credit}
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-black text-white text-lg leading-snug mb-1">{name}</h3>

        {duration && (
          <div className="flex items-center gap-1.5 text-white/70 text-xs mb-3">
            <Clock size={11} />
            <span>{duration}</span>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-[10px] mb-0.5">Starting from</p>
            <p className="text-white font-black text-xl">{displayPrice}</p>
            <p className="text-white/60 text-[10px]">{perLabel}</p>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <button
              onClick={(e) => { e.stopPropagation(); handleBook(); }}
              className="bg-[#e8a020] text-white text-sm font-bold px-5 py-2 hover:bg-[#d49020] transition-colors"
            >
              Book Now
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/services/${slugify(name)}`); }}
              className="text-white/80 text-xs font-semibold hover:text-white underline underline-offset-2 transition-colors"
            >
              View details →
            </button>
          </div>
        </div>
      </div>

      <CarDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        tour={tourData}
        onBookNow={handleBook}
      />
    </div>
  );
}
