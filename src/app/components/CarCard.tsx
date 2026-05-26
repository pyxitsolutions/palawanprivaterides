import { useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { BookingModal } from './BookingModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const tourData = { images, name, price, type, duration, pax, description, pricing, whatsIncluded };
  const startingPrice = pricing
    ? Math.min(...pricing.map((p) => parseInt(p.price)))
    : parseInt(price);
  const perLabel = (type === 'Tour Package' || type === 'Transfer') ? 'per person' : 'per booking';

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
        {/* Type badge over image */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[type] ?? 'bg-gray-100 text-gray-700'}`}>
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">

        {/* Title */}
        <h3
          className="font-bold text-gray-900 text-base leading-snug mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-2"
          onClick={() => setIsDetailsOpen(true)}
        >
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin size={11} className="flex-shrink-0" />
          <span>Palawan, Philippines</span>
        </div>

        {/* Duration */}
        {duration && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
            <Clock size={11} className="flex-shrink-0" />
            <span>{duration}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + Book */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100 mt-2">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Starting from</p>
            <p className="text-xl font-black text-gray-900">
              ₱{startingPrice.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">{perLabel}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Book Now
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourName={name}
        tourPrice={price}
        tourType={type}
        pricing={pricing}
      />

      <CarDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        tour={tourData}
        onBookNow={() => setIsModalOpen(true)}
      />
    </div>
  );
}
