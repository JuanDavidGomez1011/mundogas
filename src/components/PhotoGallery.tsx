import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  // Espacios libres para las próximas 2 imágenes. Puedes reemplazar la URL de 'src'.
  { id: 5, src: '/images/foto_galeria_5.jpg', alt: 'Mundo Gas Manizales foto 5' },
  { id: 6, src: '/images/foto_galeria_6.jpg', alt: 'Mundo Gas Manizales foto 6' },
];

export const PhotoGallery: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const navigateLightbox = useCallback(
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

  // Keyboard navigation para lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, closeLightbox, navigateLightbox]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  // Controles de Carrusel Desktop
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400; // Ajuste por pantalla
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <section id="galeria" className="bg-[#011B3E] py-24 scroll-mt-16 overflow-hidden relative">
        {/* Adornos visuales de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-4 py-1.5 rounded-full">
              <Camera className="h-4 w-4" />
              Galería Mundo Gas
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Nuestro Trabajo en Imágenes
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full" />
            <p className="text-slate-300 text-lg">
              Desliza para conocer de cerca nuestras instalaciones, equipos y el equipo profesional que trabaja para ti en Manizales.
            </p>
          </div>

          {/* Carrusel Contenedor */}
          <div className="relative group/carousel">
            
            {/* Controles PC (ocultos en móvil por defecto, aparecen en hover) */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute left-[-16px] md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-emerald-500 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 shadow-xl border border-white/20 opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
              aria-label="Anterior foto"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute right-[-16px] md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-emerald-500 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 shadow-xl border border-white/20 opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
              aria-label="Siguiente foto"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Slider Track */}
            <div 
              ref={carouselRef}
              className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {photos.map((photo, index) => (
                <div 
                  key={photo.id}
                  className="snap-center shrink-0 w-[85vw] sm:w-[350px] md:w-[380px] h-[450px] md:h-[500px] relative group cursor-zoom-in rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 transition-transform duration-300 hover:-translate-y-2"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Overlay gradiente para darle toque premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011B3E] via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hint de móvil para hacer scroll */}
            <div className="flex justify-center mt-2 md:hidden">
              <span className="text-xs text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full animate-pulse border border-emerald-800/50">
                Desliza para ver más →
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={closeLightbox}
        >
          <div
            className={`relative max-w-5xl w-full mx-4 transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors cursor-pointer bg-white/10 p-2 rounded-full"
              aria-label="Cerrar galería"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                className="w-full max-h-[85vh] object-contain bg-[#011B3E]"
              />
            </div>

            {/* Counter */}
            <div className="flex justify-end mt-4 px-2">
              <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/20">
                {lightboxIndex + 1} / {photos.length}
              </span>
            </div>

            {/* Prev / Next Lightbox */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-emerald-600 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all cursor-pointer border border-white/15"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </button>
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-emerald-600 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all cursor-pointer border border-white/15"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </button>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                    i === lightboxIndex ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/30 hover:bg-white/60'
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
