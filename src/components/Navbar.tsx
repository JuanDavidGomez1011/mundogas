import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { businessData } from '../data/businessData';
import { getBusinessStatus } from '../utils/scheduleHelper';
import type { BusinessStatus } from '../utils/scheduleHelper';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<BusinessStatus>({ isOpen: false, message: 'Cargando...', nextStatusChange: '' });

  // Update business status in real time
  useEffect(() => {
    setStatus(getBusinessStatus());
    const interval = setInterval(() => {
      setStatus(getBusinessStatus());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const primaryWhatsApp = businessData.contact.phoneNumbers.find(p => p.isWhatsApp)?.whatsappFormatted || businessData.whatsappPrimary;
  const whatsappUrl = `https://wa.me/${primaryWhatsApp.replace('+', '')}?text=Hola%20Mundo%20Gas,%20me%20gustar%C3%ADa%20recibir%20asesor%C3%ADa%20sobre%20calentadores.`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-900/50 bg-[#0D2A6B]/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo showText={true} className="h-10 w-10 text-slate-900" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => handleScroll('servicios')}
              className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Servicios
            </button>
            <button
              onClick={() => handleScroll('novedades')}
              className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Novedades
            </button>
            <button
              onClick={() => handleScroll('contacto')}
              className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Contacto
            </button>
          </nav>

          {/* Business Status Pill & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Status Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-xs transition-colors duration-300 ${
                status.isOpen
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {status.isOpen ? 'Abierto Ahora' : 'Cerrado Ahora'}
            </span>

            {/* CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-sm font-bold shadow-md hover:shadow-emerald-950/20 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <MessageSquare className="h-4 w-4 fill-white/20" />
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                status.isOpen
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {status.isOpen ? 'Abierto' : 'Cerrado'}
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:bg-[#153A8A] hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 opacity-100 border-t border-blue-900/50' : 'max-h-0 opacity-0 pointer-events-none'
        } bg-[#0D2A6B]`}
      >
        <div className="space-y-1 px-4 py-3 pb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-[#153A8A] hover:text-white"
          >
            Inicio
          </button>
          <button
            onClick={() => handleScroll('servicios')}
            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-[#153A8A] hover:text-white"
          >
            Servicios
          </button>
          <button
            onClick={() => handleScroll('novedades')}
            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-[#153A8A] hover:text-white"
          >
            Novedades
          </button>
          <button
            onClick={() => handleScroll('contacto')}
            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-[#153A8A] hover:text-white"
          >
            Contacto
          </button>
          
          <div className="pt-2 border-t border-blue-900/50 flex gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-center text-sm font-bold text-white shadow-xs"
            >
              <MessageSquare className="h-4 w-4" />
              Escríbenos
            </a>
            <a
              href={`tel:${businessData.contact.phoneNumbers[2].number}`}
              className="inline-flex items-center justify-center rounded-lg bg-slate-100 p-2.5 text-slate-700 hover:bg-slate-200"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
