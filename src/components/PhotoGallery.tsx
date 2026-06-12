import React, { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from 'lucide-react';

interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
}

const photos: GalleryPhoto[] = [
  { id: 1, src: '/images/foto_galeria_1.jpeg', alt: 'Mundo Gas Manizales foto 1' },
  { id: 2, src: '/images/foto_galeria_2.jpeg', alt: 'Mundo Gas Manizales foto 2' },
  { id: 3, src: '/images/foto_galeria_3.jpeg', alt: 'Mundo Gas Manizales foto 3' },
  { id: 4, src: '/images/foto_galeria_4.jpeg', alt: 'Mundo Gas Manizales foto 4' },
];

export const PhotoGallery: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const openLightbox = (index: number) => setLightboxIndex(index);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (lightboxIndex === null || isAnimating) return;
      setIsAnimating(true);
      setTimeout(() => {
        setLightboxIndex((prev) => {
          if (prev === null) return null;
          return direction === 'prev'
            ? (prev - 1 + photos.length) % photos.length
            : (prev + 1) % photos.length;
        });
        setIsAnimating(false);
      }, 150);
    },
    [lightboxIndex, isAnimating]
  );

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, closeLightbox, navigate]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  return (
    <>
      <section id="galeria" className="bg-[#011B3E] py-24 scroll-mt-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-amber-400 uppercase">
              <Camera className="h-4 w-4" />
              Galería
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Nuestro Trabajo en Imágenes
            </h2>
            <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
            <p className="text-slate-300 text-lg">
              Conoce de cerca nuestras instalaciones, equipos y el equipo profesional que trabaja para ti en Manizales.
            </p>
          </div>

          {/* Photo Grid — Masonry-style layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

            {/* Photo 1 — tall, spans 2 rows on md */}
            <div
              className="md:row-span-2 relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-white/10 aspect-[3/4] md:aspect-auto"
              onClick={() => openLightbox(0)}
            >
              <img src={photos[0].src} alt={photos[0].alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Photo 2 */}
            <div
              className="relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-white/10 aspect-square"
              onClick={() => openLightbox(1)}
            >
              <img src={photos[1].src} alt={photos[1].alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Photo 3 */}
            <div
              className="relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-white/10 aspect-square"
              onClick={() => openLightbox(2)}
            >
              <img src={photos[2].src} alt={photos[2].alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Photo 4 — spans 2 cols on mobile */}
            <div
              className="col-span-2 md:col-span-1 relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-white/10 aspect-video md:aspect-square"
              onClick={() => openLightbox(3)}
            >
              <img src={photos[3].src} alt={photos[3].alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>

          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Haz clic en cualquier foto para ampliarla
          </p>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className={`relative max-w-5xl w-full mx-4 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar galería"
            >
              <X className="h-7 w-7" />
            </button>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            </div>

            {/* Counter only */}
            <div className="flex justify-end mt-3 px-1">
              <span className="text-white/40 text-xs">{lightboxIndex + 1} / {photos.length}</span>
            </div>

            {/* Prev / Next */}
            <button
              onClick={() => navigate('prev')}
              className="absolute left-3 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full transition-all cursor-pointer border border-white/15"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full transition-all cursor-pointer border border-white/15"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === lightboxIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
