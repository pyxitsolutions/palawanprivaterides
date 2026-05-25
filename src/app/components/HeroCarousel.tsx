import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import hero1 from '../../hero/hero-1.png';
import hero2 from '../../hero/hero-2.png';
import hero3 from '../../hero/hero-3.png';
import mirage4 from '../../hero/mirage-4.png';

export function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    pauseOnHover: false,
    arrows: false,
  };

  const slides = [
    {
      image: hero1,
      title: 'Explore Palawan Your Way',
      subtitle: 'Affordable car & motorcycle rentals in Puerto Princesa',
    },
    {
      image: hero2,
      title: 'Road Trip Ready',
      subtitle: 'From Puerto Princesa to El Nido — we got you covered',
    },
    {
      image: hero3,
      title: 'Discover the Last Frontier',
      subtitle: 'Rent a ride and chase every Palawan adventure',
    },
    {
      image: mirage4,
      title: 'Travel Palawan in Comfort',
      subtitle: 'Well-maintained vehicles for every kind of journey',
    },
  ];

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Preload all hero images */}
      {slides.map((slide, index) => (
        <link key={index} rel="preload" as="image" href={slide.image} />
      ))}
      <Slider {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-screen">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl opacity-90">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
        >
          Explore Our Cars
        </button>
      </div>

      <style>{`
        .slick-dots {
          bottom: 30px;
        }
        .slick-dots li button:before {
          font-size: 12px;
          color: white;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
