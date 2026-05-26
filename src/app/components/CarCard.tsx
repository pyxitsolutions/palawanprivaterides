import { useState } from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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

export function CarCard({ images, name, price, type, duration, pax, description, pricing, whatsIncluded }: TourCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const sliderSettings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  const tourData = { images, name, price, type, duration, pax, description, pricing, whatsIncluded };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border group">
      <div
        className="relative overflow-hidden h-56 tour-card-slider cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
      >
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className="h-56">
              <img src={image} alt={`${name} - ${index + 1}`} className="w-full h-56 object-cover" />
            </div>
          ))}
        </Slider>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-4 py-2 rounded-full text-sm">
            Click to view details
          </span>
        </div>
      </div>

      <style>{`
        .tour-card-slider .slick-dots { bottom: 8px; }
        .tour-card-slider .slick-dots li button:before { font-size: 7px; color: white; opacity: 0.7; }
        .tour-card-slider .slick-dots li.slick-active button:before { color: white; opacity: 1; }
      `}</style>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 mr-3">
            <h3 className="text-base font-bold text-card-foreground leading-tight">{name}</h3>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
              {type}
            </span>
          </div>

          {/* Pricing */}
          {pricing ? (
            <div className="text-right space-y-1 flex-shrink-0">
              {pricing.map((p) => (
                <div key={p.vehicle} className="flex items-center gap-2 justify-end">
                  <span className="text-xs text-muted-foreground">{p.vehicle}</span>
                  <span className="text-sm font-bold text-primary">₱{parseInt(p.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-primary">₱{parseInt(price).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{type === 'Tour Package' ? 'per person' : 'per booking'}</p>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{description}</p>

        {pricing && (
          <p className="text-xs text-green-600 font-semibold mb-3 flex items-center gap-1">
            <span>✓</span> Rates include fuel and professional driver
          </p>
        )}

        <div className={`grid gap-2 mb-4 py-3 border-y border-border ${type === 'Transfer' ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {type !== 'Transfer' && (
            <div className="flex flex-col items-center gap-1">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center leading-tight">{duration}</span>
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <MapPin size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Palawan</span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-all font-semibold text-sm"
        >
          Book Now
        </button>
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
