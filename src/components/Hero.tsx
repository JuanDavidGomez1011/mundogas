import React from 'react';
import { businessData } from '../data/businessData';
import { Flame, ArrowRight, ShieldCheck, BadgeCheck, Clock, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp) || businessData.contact.phoneNumbers[0];
  const whatsappUrl = `https://wa.me/${primaryPhone.whatsappFormatted.replace('+', '')}?text=Hola%20Mundo%20Gas,%20me%20gustar%C3%ADa%20solicitar%20asesor%C3%ADa%20para%20un%20calentador.`;

  const handleScrollToServices = () => {
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24 lg:py-32">
      {/* Background gradients representing the gas flame and nature (green/blue) */}
      <div className="absolute inset-0 z-0">
        {/* Deep blue/ocean glow */}
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-[120px]" />
        {/* Vibrant emerald/earth glow */}
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-[100px]" />
        {/* Gas flame cyan glow in center */}
        <div className="absolute top-[40%] left-[50%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/30 blur-[80px]" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-200/0 via-slate-100/10 to-slate-50 opacity-10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Column 1: Copywriting */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Experience Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-700 backdrop-blur-md">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>{businessData.experienceYears} años de experiencia en Manizales</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              ¡Calor a tu medida con <br />
              <span className="bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                Mundo Gas
              </span>!
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto lg:mx-0 max-w-2xl text-lg text-slate-600 leading-relaxed">
              Especialistas en la <strong className="text-emerald-600 font-semibold">venta, instalación y mantenimiento</strong> de calentadores a gas. Disfruta de baños calientes y seguros en Manizales con el respaldo de técnicos certificados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-8 py-4 font-bold shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Flame className="h-5 w-5 fill-white/10 animate-pulse text-cyan-200" />
                Solicitar Cotización Gratis
              </a>
              <button
                onClick={handleScrollToServices}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-8 py-4 font-bold shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer"
              >
                Ver Servicios
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 border-t border-slate-100 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <BadgeCheck className="h-5 w-5 text-cyan-600 shrink-0" />
                <span className="text-sm">Técnicos Certificados</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-sm">Garantía Directa</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start col-span-2 sm:col-span-1">
                <Clock className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="text-sm">Soporte Rápido</span>
              </div>
            </div>
          </div>

          {/* Column 2: Premium Visual Card Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient fire glow around the badge */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 opacity-10 blur-xl animate-pulse" />

            {/* Glassmorphic Guarantee Card */}
            <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
              <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                <Flame className="h-6 w-6 text-cyan-600 animate-bounce" />
              </div>

              {/* Title & Badge */}
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wider text-cyan-600 uppercase">Mundo Gas Manizales</span>
                <h3 className="text-2xl font-bold text-slate-900">Servicio Confiable</h3>
                <p className="text-sm text-slate-500">Protegemos tu hogar asegurando instalaciones seguras y calentadores eficientes.</p>
              </div>

              {/* Showcase list with numbers or checks */}
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 rounded-2xl bg-slate-50/50 p-4 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Equipos de Alta Gama</h4>
                    <p className="text-xs text-slate-500">Modelos Bosch, Clasic y Challenger listos para despacho inmediato.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-2xl bg-slate-50/50 p-4 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Mantenimiento de Seguridad</h4>
                    <p className="text-xs text-slate-500">Eliminación de monóxido, limpieza y calibración de gas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-2xl bg-slate-50/50 p-4 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Instalaciones Certificadas</h4>
                    <p className="text-xs text-slate-500">Técnicos matriculados bajo regulaciones NTC Colombianas.</p>
                  </div>
                </li>
              </ul>

              {/* Visual mini-indicator */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="flex -space-x-2">
                  <span className="inline-block h-8 w-8 rounded-full bg-emerald-500 border border-white text-[10px] font-extrabold text-white flex items-center justify-center">B</span>
                  <span className="inline-block h-8 w-8 rounded-full bg-cyan-500 border border-white text-[10px] font-extrabold text-white flex items-center justify-center">C</span>
                  <span className="inline-block h-8 w-8 rounded-full bg-blue-600 border border-white text-[10px] font-extrabold text-white flex items-center justify-center">M</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">Cobertura</span>
                  <span className="text-sm font-bold text-slate-900">Toda Manizales</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
