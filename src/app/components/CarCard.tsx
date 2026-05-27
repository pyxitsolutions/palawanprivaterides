import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { CarDetailsModal } from './CarDetailsModal';

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

const typeColors: Record<string, string> = {
  'Private Ride': 'bg-[#e8a020] text-white',
  'Tour Package': 'bg-[#e8a020] text-white',
  'Transfer': 'bg-[#e8a020] text-white',
};

export function CarCard({ images, name, price, type, duration, pax, description, pricing, whatsIncluded }: TourCardProps) {
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const routeParts = name.includes(' → ') ? name.split(' → ') : [];
  const directionOptions = routeParts.length === 2
    ? [`${routeParts[0]} → ${routeParts[1]}`, `${routeParts[1]} → ${routeParts[0]}`]
    : [];
  const [selectedDirection, setSelectedDirection] = useState(directionOptions[0] ?? '');

  const tourData = { images, name, price, type, duration, pax, description, pricing, whatsIncluded };
  const startingPrice = pricing
    ? Math.min(...pricing.map((p) => parseInt(p.price)))
    : parseInt(price);
  const perLabel = (type === 'Tour Package' || type === 'Transfer') ? 'per person' : 'per booking';

  const handleBook = () => {
    navigate('/book', { state: { tourName: name, tourPrice: price, tourType: type, pricing, direction: selectedDirection || undefined } });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">

      {/* Image */}
      <div
        className="relative h-52 overflow-hidden cursor-pointer flex-shrink-0"
        onClick={() => setIsDetailsOpen(true)}
      >
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[type] ?? 'bg-gray-100 text-gray-700'}`}>
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-gray-900 text-base leading-snug mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-2"
          onClick={() => setIsDetailsOpen(true)}
        >
          {name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin size={11} className="flex-shrink-0" />
          <span>Palawan, Philippines</span>
        </div>

        {duration && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
            <Clock size={11} className="flex-shrink-0" />
            <span>{duration}</span>
          </div>
        )}

        {directionOptions.length > 0 && (
          <p className="text-[11px] text-gray-400 mb-3">{directionOptions.join(', ')}</p>
        )}

        <div className="flex-1" />

        <div className="flex items-end justify-between pt-3 border-t border-gray-100 mt-2">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Starting from</p>
            <p className="text-xl font-black text-gray-900">
              ₱{startingPrice.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">{perLabel}</p>
          </div>
          <button
            onClick={handleBook}
            className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Book Now
          </button>
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
