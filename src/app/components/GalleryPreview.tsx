import { useNavigate } from 'react-router-dom';
import { ArrowRight, Images } from 'lucide-react';
import { galleryItems } from '../data/gallery';

const PREVIEW_COUNT = 6;

export function GalleryPreview() {
  const navigate = useNavigate();
  const preview = galleryItems.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-2">Real trips</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">From Our Guests & Routes</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Private vans, island tours, and Palawan destinations — see what a booking with us looks like.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all shrink-0"
          >
            <Images size={18} />
            View full gallery
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {preview.map((item, i) => (
            <button
              key={item.alt}
              type="button"
              onClick={() => navigate('/gallery')}
              className={`relative overflow-hidden rounded-2xl bg-gray-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020] ${
                i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto md:min-h-[280px]' : 'aspect-[4/3]'
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold text-left opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                {item.caption}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
