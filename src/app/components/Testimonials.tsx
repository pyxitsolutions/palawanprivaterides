import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import review1 from '../../reviews/review-1.webp';
import review2 from '../../reviews/review-2.webp';
import review3 from '../../reviews/review-3.webp';
import review4 from '../../reviews/review-4.webp';
import review5 from '../../reviews/review-5.webp';

const testimonials = [
  {
    image: review2,
    name: 'Nicole Montojo',
    review: 'We had a smooth ride back to Puerto Princesa, he drove us carefully so we felt safe and comfortable. Reasonable yung rate ng private transfer and new rin yung car ni sir so malamig yung AC. Will definitely recommend.',
    rating: 5,
    tourBooked: 'Private Transfer to Puerto Princesa',
  },
  {
    image: review1,
    name: 'Shirley Ho & Christian',
    review: 'Highly recommend Palawan Private Rides! John was very helpful and organised our transfer to and from Port Barton. The cars were clean, new and comfortable. Our drivers Renz and Ryan were great. Salamat!',
    rating: 5,
    tourBooked: 'Private Transfer to Port Barton',
  },
  {
    image: review3,
    name: 'Clara K',
    review: 'John was a very professional and reliable driver. We hired his service to travel from Port Barton to Bucana Beach, and we had a very pleasant ride. He was on time, and the car was clean and comfortable. We would definitely recommend him!',
    rating: 5,
    tourBooked: 'Private Transfer · Port Barton',
  },
  {
    image: review4,
    name: 'Adz Apostol Diaz',
    review: 'Sobrang impressed ako sa serbisyo ninyo. Hindi lang maayos at professional kausap, ramdam din talaga yung concern ninyo sa clients. Ang hirap makahanap ng rental company na mabilis mag-assist at transparent sa proseso. Highly recommended po talaga kayo.',
    rating: 5,
    tourBooked: 'Private Transfer · Palawan',
  },
  {
    image: review5,
    name: 'Aljenri Tanjilari',
    review: 'We had an amazing experience for our roundtrip transfer from Puerto Princesa Airport to El Nido and back. Everything was smooth and hassle-free. The van was clean, comfortable, and air-conditioned. Communication was excellent throughout. Highly recommend!',
    rating: 5,
    tourBooked: 'Roundtrip Transfer · PPS ↔ El Nido',
  },
];

export function Testimonials() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const paused = useRef(false);

  const maxIndex = Math.max(0, testimonials.length - slidesPerView);

  const next = useCallback(() => {
    if (!paused.current) setCurrent(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    paused.current = true;
    setTimeout(() => { paused.current = false; }, 6000);
  };

  const goPrev = () => {
    setCurrent(prev => (prev <= 0 ? maxIndex : prev - 1));
    paused.current = true;
    setTimeout(() => { paused.current = false; }, 6000);
  };

  const goNext = () => {
    setCurrent(prev => (prev >= maxIndex ? 0 : prev + 1));
    paused.current = true;
    setTimeout(() => { paused.current = false; }, 6000);
  };

  useEffect(() => {
    const update = () => {
      const spv = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      setSlidesPerView(spv);
      setCurrent(prev => Math.min(prev, Math.max(0, testimonials.length - spv)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  const cardWidth = 100 / slidesPerView;

  return (
    <section id="reviews" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">Reviews</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Guests Say</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Real experiences from travelers who explored Palawan with us.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Prev button */}
          <button
            onClick={goPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <ChevronLeft size={18} className="text-gray-700" />
          </button>

          {/* Track */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * cardWidth}%)` }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${cardWidth}%` }}
                >
                  <div
                    className="bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer group h-full"
                    onClick={() => setLightbox(t.image)}
                  >
                    {/* Photo */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        Tap to view
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(t.rating)].map((_, j) => (
                          <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                        "{t.review}"
                      </p>
                      <div className="pt-3 border-t border-gray-100">
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-xs text-primary font-medium mt-0.5">{t.tourBooked}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={goNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <ChevronRight size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Footer stat */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">500+</span> satisfied travelers and counting
            </p>
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} className="text-white" />
          </button>
          <img
            src={lightbox}
            alt="Review photo"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
