import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#004D40] text-slate-200 flex flex-col selection:bg-cyan-100 selection:text-cyan-900">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Banner principal / Propuesta de Valor */}
        <Hero />

        {/* Sección de Servicios: Venta, Instalación y Mantenimiento */}
        <Services />

        {/* Vitrina de Equipos: Novedades Bosch y Clasic */}
        <Gallery />

        {/* Canales de Contacto, Formulario y Horarios Colombia */}
        <Contact />
      </main>

      {/* Footer de Cierre y Cumplimiento Normativo */}
      <Footer />
    </div>
  );
}

export default App;
