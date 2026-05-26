import { useState } from 'react';
import { Star, X } from 'lucide-react';
import reviews1 from '../../reviews/reviews-1.jpg';
import reviews4 from '../../reviews/reviews-4.jpg';
import reviews5 from '../../reviews/reviews-5.jpg';
import reviews6 from '../../reviews/reviews-6.jpg';

export function Testimonials() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const testimonials = [
    {
      image: reviews1,
      name: 'Maria Santos',
      review: 'Amazing private ride to El Nido! The van was super comfortable and our driver was very friendly and knowledgeable. Highly recommend!',
      rating: 5,
      tourBooked: 'Puerto to El Nido Private Van',
    },
    {
      image: reviews4,
      name: 'Juan Reyes',
      review: 'Booked the Underground River tour and it was absolutely worth it. Everything was arranged for us — stress-free and enjoyable!',
      rating: 5,
      tourBooked: 'Underground River Day Tour',
    },
    {
      image: reviews5,
      name: 'Anna Cruz',
      review: 'Great service and fair pricing! The city tour covered all the best spots in Puerto Princesa. Will definitely book again.',
      rating: 5,
      tourBooked: 'Puerto Princesa City Tour',
    },
    {
      image: reviews6,
      name: 'Pedro Gomez',
      review: 'Airport pick-up was on time and the vehicle was clean and comfortable. Simple, reliable, and professional. Thank you!',
      rating: 5,
      tourBooked: 'Airport Transfer',
    },
  ];

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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer group"
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
          ))}
        </div>

        {/* Footer stat */}
        <div className="mt-12 text-center">
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
