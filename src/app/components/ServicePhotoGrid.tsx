import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ServicePhotoGridProps {
  images: string[];
  title: string;
}

export function ServicePhotoGrid({ images, title }: ServicePhotoGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const extra = images.slice(1, 7);

  if (extra.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-black text-gray-900 mb-4">Photos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {extra.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setLightbox(i)}
            className="rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020]"
          >
            <img
              src={img}
              alt={`${title} photo ${i + 2} - Palawan Private Rides`}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={20} className="text-white" />
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i !== null ? (i - 1 + extra.length) % extra.length : null));
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>
          <img
            src={extra[lightbox]}
            alt={title}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i !== null ? (i + 1) % extra.length : null));
            }}
            aria-label="Next"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
          <p className="absolute bottom-5 text-white/50 text-sm">
            {lightbox + 1} / {extra.length}
          </p>
        </div>
      )}
    </div>
  );
}
