import { useState } from 'react';
import { X, Car, Users, Fuel, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    images: string[];
    name: string;
    price: string;
    type: string;
    transmission: string;
    seats: number;
    fuelType: string;
    description: string;
  };
  onBookNow: () => void;
}

export function CarDetailsModal({ isOpen, onClose, car, onBookNow }: CarDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

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
            <h2 className="text-3xl font-bold text-card-foreground">{car.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full">
                {car.type}
              </span>
              <p className="text-2xl font-bold text-primary">₱{car.price}/day</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="relative">
          <div className="relative h-96 md:h-[500px] bg-black">
            <img
              src={car.images[currentImageIndex]}
              alt={`${car.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Navigation Arrows */}
            {car.images.length > 1 && (
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

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {car.images.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="p-4 bg-accent/30">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-primary scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">About This Vehicle</h3>
            <p className="text-muted-foreground leading-relaxed">{car.description}</p>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center p-4 bg-accent/50 rounded-lg">
                <Car size={32} className="text-primary mb-2" />
                <span className="text-sm text-muted-foreground mb-1">Transmission</span>
                <span className="font-semibold text-card-foreground">{car.transmission}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-accent/50 rounded-lg">
                <Users size={32} className="text-primary mb-2" />
                <span className="text-sm text-muted-foreground mb-1">Seats</span>
                <span className="font-semibold text-card-foreground">{car.seats}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-accent/50 rounded-lg">
                <Fuel size={32} className="text-primary mb-2" />
                <span className="text-sm text-muted-foreground mb-1">Fuel Type</span>
                <span className="font-semibold text-card-foreground">{car.fuelType}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-accent/50 rounded-lg">
                <Car size={32} className="text-primary mb-2" />
                <span className="text-sm text-muted-foreground mb-1">Vehicle Type</span>
                <span className="font-semibold text-card-foreground">{car.type}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">Features & Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span className="text-muted-foreground">Full insurance coverage included</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span className="text-muted-foreground">24/7 roadside assistance</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span className="text-muted-foreground">Regular maintenance & cleaning</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span className="text-muted-foreground">Flexible pickup and return</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
