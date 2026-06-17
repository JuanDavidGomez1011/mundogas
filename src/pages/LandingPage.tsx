import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { PhotoGallery } from '../components/PhotoGallery';
import { Services } from '../components/Services';
import { Catalog } from '../components/Catalog';
import { Gallery } from '../components/Gallery';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#004D40] text-slate-200 flex flex-col selection:bg-cyan-100 selection:text-cyan-900">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Banner principal / Propuesta de Valor */}
        <Hero />

        {/* Galería de fotos del negocio */}
        <PhotoGallery />

        {/* Sección de Servicios: Venta, Instalación y Mantenimiento */}
        <Services />

        {/* NUEVO: Catálogo dinámico de productos autogestionable */}
        <Catalog />

        {/* Vitrina de Equipos: Novedades Bosch y Clasic */}
        <Gallery />

        {/* Canales de Contacto, Formulario y Horarios Colombia */}
        <Contact />
      </main>

      {/* Footer de Cierre y Cumplimiento Normativo */}
      <Footer />
    </div>
  );
};
