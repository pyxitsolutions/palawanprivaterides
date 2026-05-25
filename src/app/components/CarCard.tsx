import { useState } from 'react';
import { Car, Users, Fuel } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BookingModal } from './BookingModal';
import { CarDetailsModal } from './CarDetailsModal';

interface CarCardProps {
  images: string[];
  name: string;
  price: string;
  type: string;
  transmission: string;
  seats: number;
  fuelType: string;
  description: string;
}

export function CarCard({ images, name, price, type, transmission, seats, fuelType, description }: CarCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  const carData = { images, name, price, type, transmission, seats, fuelType, description };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border group">
      <div
        className="relative overflow-hidden h-64 car-card-slider cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
      >
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className="h-64">
              <img
                src={image}
                alt={`${name} - Image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </Slider>

        {/* Click to view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-4 py-2 rounded-full text-sm">
            Click to view details
          </span>
        </div>
      </div>

      <style>{`
        .car-card-slider .slick-dots {
          bottom: 10px;
        }
        .car-card-slider .slick-dots li button:before {
          font-size: 8px;
          color: white;
          opacity: 0.7;
        }
        .car-card-slider .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }
      `}</style>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">{name}</h3>
            <span className="inline-block mt-1 px-3 py-1 bg-accent text-accent-foreground text-xs rounded-full">
              {type}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">₱{price}</p>
            <p className="text-sm text-muted-foreground">per day</p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-3 gap-3 mb-5 py-4 border-y border-border">
          <div className="flex flex-col items-center gap-1">
            <Car size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{seats} Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{fuelType}</span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          Book Now
        </button>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        carName={name}
        carPrice={price}
      />

      <CarDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        car={carData}
        onBookNow={() => setIsModalOpen(true)}
      />
    </div>
  );
}
