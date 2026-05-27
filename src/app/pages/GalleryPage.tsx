import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';

import reviews1 from '../../reviews/reviews-1.jpg';
import reviews2 from '../../reviews/reviews-2.jpg';
import reviews3 from '../../reviews/reviews-3.jpg';
import reviews4 from '../../reviews/reviews-4.jpg';
import reviews5 from '../../reviews/reviews-5.jpg';
import reviews6 from '../../reviews/reviews-6.jpg';
import reviews7 from '../../reviews/reviews-7.jpg';

const images = [reviews1, reviews2, reviews3, reviews4, reviews5, reviews6, reviews7];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((i) => (i !== null ? (i + 1) % images.length : null));
  };

  const Cell = ({ index, className }: { index: number; className?: string }) => (
    <div
      className={`overflow-hidden rounded-xl cursor-pointer group ${className ?? ''}`}
      onClick={() => setLightbox(index)}
    >
      <img
        src={images[index]}
        alt={`Gallery ${index + 1}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-2">Our Photos</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-gray-500 text-lg">Moments from our guests exploring Palawan.</p>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

          {/* Row 1: tall left + 2x2 right */}
          <div className="grid grid-cols-3 gap-2" style={{ gridTemplateRows: '280px 280px' }}>
            <Cell index={0} className="row-span-2" />
            <Cell index={1} />
            <Cell index={2} />
            <Cell index={3} />
            <Cell index={4} />
          </div>

          {/* Row 2: remaining images */}
          <div className="grid grid-cols-3 gap-2 mt-2" style={{ gridTemplateRows: '280px' }}>
            <Cell index={5} className="col-span-2" />
            <Cell index={6} />
          </div>

        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} className="text-white" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={prev}
          >
            <ChevronLeft size={22} className="text-white" />
          </button>

          <img
            src={images[lightbox]}
            alt="Gallery"
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={next}
          >
            <ChevronRight size={22} className="text-white" />
          </button>

          <p className="absolute bottom-5 text-white/50 text-sm">
            {lightbox + 1} / {images.length}
          </p>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
