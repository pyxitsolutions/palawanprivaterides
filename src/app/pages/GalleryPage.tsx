import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Expand, ArrowRight, Car } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { GALLERY_META, galleryItems, type GalleryItem } from '../data/gallery';

export default function GalleryPage() {
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + galleryItems.length) % galleryItems.length : null,
    );
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % galleryItems.length : null,
    );
  }, []);

  useEffect(() => {
    document.title = GALLERY_META.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', GALLERY_META.description);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  const activeItem: GalleryItem | null =
    lightboxIndex !== null ? galleryItems[lightboxIndex] ?? null : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-2">Our Photos</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Real moments from private transfers, tours, and destinations across Palawan. Tap a photo to enlarge.
          </p>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 sm:gap-3">
            {galleryItems.map((item, i) => (
                <button
                  key={`${item.src}-${item.alt}`}
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="relative w-full overflow-hidden cursor-pointer group mb-2 sm:mb-3 break-inside-avoid rounded-xl bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a020] focus-visible:ring-offset-2"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full object-cover transition-all duration-300 opacity-0 group-hover:scale-[1.03]"
                    onLoad={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-[#1a3728] shadow-lg">
                      <Expand size={20} />
                    </span>
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 px-3 py-2 text-left text-xs font-semibold text-white bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none line-clamp-2">
                    {item.caption}
                  </p>
                </button>
            ))}
          </div>
        </div>

        <section className="bg-[#1a3728] py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to book your trip?</h2>
            <p className="text-white/75 mb-8">
              Private door-to-door transfers and tour packages — transparent pricing, no shared vans.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/rides')}
                className="inline-flex items-center gap-2 bg-[#e8a020] text-[#1a3728] px-7 py-3.5 rounded-full font-black text-sm hover:bg-[#ffc84d] transition-colors"
              >
                <Car size={18} />
                Book a private ride
              </button>
              <button
                type="button"
                onClick={() => navigate('/tours')}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
              >
                View tour packages
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {activeItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={20} className="text-white" />
          </button>

          <button
            type="button"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>

          <figure
            className="max-w-full max-h-[78vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.src}
              alt={activeItem.alt}
              className="max-w-full max-h-[72vh] rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center max-w-lg">
              <p className="text-white font-semibold text-sm sm:text-base">{activeItem.caption}</p>
              <p className="text-white/45 text-xs mt-1">
                {lightboxIndex + 1} / {galleryItems.length}
                <span className="mx-2">·</span>
                Use ← → keys
              </p>
            </figcaption>
          </figure>

          <button
            type="button"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
