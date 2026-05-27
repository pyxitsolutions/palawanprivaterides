import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';

import p1 from '../../gallery/p1.jpg';
import p2 from '../../gallery/p2.jpg';
import p3 from '../../gallery/p3.jpg';
import p4 from '../../gallery/p4.jpg';
import p5 from '../../gallery/p5.jpg';
import p6 from '../../gallery/p6.jpg';
import p7 from '../../gallery/p7.jpg';
import p8 from '../../gallery/p8.jpg';
import p9 from '../../gallery/p9.jpg';
import p10 from '../../gallery/p10.jpg';
import p11 from '../../gallery/p11.jpg';
import p12 from '../../gallery/p12.jpg';
import p13 from '../../gallery/p13.jpg';
import p14 from '../../gallery/p14.jpg';
import p15 from '../../gallery/p15.jpg';
import p16 from '../../gallery/p16.jpg';
import p17 from '../../gallery/p17.jpg';
import p18 from '../../gallery/p18.jpg';
import p19 from '../../gallery/p19.jpg';
import p20 from '../../gallery/p20.jpeg';
import p21 from '../../gallery/p21.jpeg';
import p22 from '../../gallery/p22.jpeg';

const images = [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,p21,p22];

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

        {/* Masonry columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div style={{ columns: '3', columnGap: '6px' }}>
            {images.map((img, i) => (
              <div
                key={i}
                className="overflow-hidden cursor-pointer group mb-1.5 break-inside-avoid"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full object-cover group-hover:brightness-90 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
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
