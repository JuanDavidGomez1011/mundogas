import React from 'react';
import { Logo } from './Logo';
import { businessData } from '../data/businessData';
import { ArrowUp, Phone, Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-900">
          
          {/* Column 1: Logo & Brand Pitch */}
          <div className="space-y-4 md:col-span-1">
            <Logo showText={true} className="h-10 w-10 text-white" />
            <p className="text-sm text-slate-400 leading-relaxed pt-2">
              {businessData.slogan} <br />
              Brindando calidez, confort y seguridad técnica a los hogares de Manizales durante más de {businessData.experienceYears} años.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-semibold bg-emerald-950/20 border border-emerald-900/30 rounded-xl px-3.5 py-1.5 w-fit">
              <Shield className="h-4 w-4" />
              <span>Instalación Garantizada</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Navegación</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={handleScrollToTop}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToId('servicios')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Nuestros Servicios
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToId('novedades')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Equipos en Vitrina
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToId('contacto')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Contacto y Horarios
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Recommended Brands */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Marcas Aliadas</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Bosch (Tecnología Alemana)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Clasic</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Challenger</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Challenger y Haceb</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Site Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Soporte Directo</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`tel:${businessData.contact.phoneNumbers[0].number}`}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{businessData.contact.phoneNumbers[0].number}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${businessData.contact.emails[0]}`}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {businessData.contact.emails[0]}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={`http://${businessData.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span>{businessData.contact.website}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Regulatory Info */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center sm:text-left space-y-1">
            <p>© {new Date().getFullYear()} Mundo Gas. Todos los derechos reservados.</p>
            <p className="text-[10px] text-slate-600 max-w-md">
              Aviso: Todo servicio de gas natural cumple con la Norma Técnica Colombiana (NTC) aplicable y es ejecutado por personal idóneo.
            </p>
          </div>
          
          {/* Scroll to Top */}
          <button
            onClick={handleScrollToTop}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
            title="Volver arriba"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
