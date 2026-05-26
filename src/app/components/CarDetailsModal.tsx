import { useState } from 'react';
import { X, Clock, MapPin, Users, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface PricingTier {
  vehicle: string;
  price: string;
  capacity?: number;
}

interface TourDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: {
    images: string[];
    name: string;
    price: string;
    type: string;
    duration?: string;
    pax: string;
    description: string;
    pricing?: PricingTier[];
    whatsIncluded?: string[];
  };
  onBookNow: () => void;
}

const typeColors: Record<string, string> = {
  'Private Ride': 'bg-blue-100 text-blue-700',
  'Tour Package': 'bg-green-100 text-green-700',
  'Transfer': 'bg-orange-100 text-orange-700',
};

const defaultIncluded = [
  'Private vehicle & professional driver',
  'Door-to-door service',
  'Air-conditioned vehicle',
  'Friendly & knowledgeable local driver',
];

export function CarDetailsModal({ isOpen, onClose, tour, onBookNow }: TourDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);

  const startingPrice = tour.pricing
    ? Math.min(...tour.pricing.map((p) => parseInt(p.price)))
    : parseInt(tour.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">

        {/* Hero Image */}
        <div className="relative h-56 sm:h-72 rounded-t-2xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={tour.images[currentImageIndex]}
            alt={tour.name}
            className="w-full h-full object-cover"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-white" />
          </button>

          {/* Image nav */}
          {tour.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center">
                <ChevronLeft size={18} className="text-white" />
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center">
                <ChevronRight size={18} className="text-white" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {tour.images.length}
              </div>
            </>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[tour.type] ?? 'bg-gray-100 text-gray-700'}`}>
              {tour.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* Title + Price */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{tour.name}</h2>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-gray-400">Starting from</p>
              <p className="text-2xl font-black text-primary">₱{startingPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Quick info pills */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
              <MapPin size={12} />
              Palawan, Philippines
            </div>
            {tour.duration && (
              <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                <Clock size={12} />
                {tour.duration}
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
              <Users size={12} />
              {tour.pax}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{tour.description}</p>
          </div>

          {/* Pricing Tiers */}
          {tour.pricing && tour.pricing.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Pricing</h3>
              <div className="grid grid-cols-3 gap-2">
                {tour.pricing.map((p, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">{p.vehicle}</p>
                    <p className="text-lg font-black text-primary">₱{parseInt(p.price).toLocaleString()}</p>
                    {p.capacity && <p className="text-[10px] text-gray-400 mt-0.5">Max {p.capacity} pax</p>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                <Check size={12} /> Rates include fuel and professional driver
              </p>
            </div>
          )}

          {/* What's Included */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">What's Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(tour.whatsIncluded ?? defaultIncluded).map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} className="text-primary" />
                  </div>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => { onClose(); onBookNow(); }}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
