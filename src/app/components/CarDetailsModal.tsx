import { useState } from 'react';
import { X, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

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

export function CarDetailsModal({ isOpen, onClose, tour, onBookNow }: TourDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);

  const handleBookNow = () => {
    onClose();
    onBookNow();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start rounded-t-2xl z-10">
          <div>
            <h2 className="text-3xl font-bold text-card-foreground">{tour.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full">
                {tour.type}
              </span>
              <p className="text-2xl font-bold text-primary">₱{tour.price}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="relative">
          <div className="relative h-96 md:h-[500px] bg-black">
            <img
              src={tour.images[currentImageIndex]}
              alt={`${tour.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {tour.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {tour.images.length}
            </div>
          </div>

          {tour.images.length > 1 && (
            <div className="p-4 bg-accent/30">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tour.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-primary scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">About This Tour</h3>
            <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">Tour Details</h3>
            <div className={`grid gap-6 ${tour.type === 'Transfer' ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-2'}`}>
              {tour.type !== 'Transfer' && (
                <div className="flex flex-col items-center p-4 bg-accent/50 rounded-lg">
                  <Clock size={32} className="text-primary mb-2" />
                  <span className="text-sm text-muted-foreground mb-1">Duration</span>
                  <span className="font-semibold text-card-foreground text-center">{tour.duration}</span>
                </div>
              )}
              <div className="flex flex-col items-center p-4 bg-accent/50 rounded-lg">
                <MapPin size={32} className="text-primary mb-2" />
                <span className="text-sm text-muted-foreground mb-1">Location</span>
                <span className="font-semibold text-card-foreground">Palawan</span>
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          {tour.pricing && tour.pricing.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                {tour.pricing.map((p, i) => (
                  <div key={i} className="flex flex-col items-center p-4 bg-accent/50 rounded-lg">
                    <span className="text-sm text-muted-foreground mb-1">{p.vehicle}</span>
                    <span className="font-bold text-primary text-xl">₱{parseInt(p.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-green-600 font-semibold mt-3 flex items-center gap-1">
                <span>✓</span> Rates include fuel and professional driver
              </p>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(tour.whatsIncluded ?? [
                'Private vehicle & professional driver',
                'Door-to-door service',
                'Air-conditioned vehicle',
                'Friendly & knowledgeable local driver',
              ]).map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors text-card-foreground"
            >
              Close
            </button>
            <button
              onClick={handleBookNow}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
