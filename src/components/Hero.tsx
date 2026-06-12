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
    <section className="relative overflow-hidden bg-[#0D2A6B] py-24 lg:py-32">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#FFD700] backdrop-blur-md">
              <Award className="h-4 w-4 text-[#FFD700]" />
              <span>{businessData.experienceYears} años de experiencia en Manizales</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              ¡Calor a tu medida con <br />
              <span className="text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                Mundo Gas!
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto lg:mx-0 max-w-2xl text-lg text-slate-200 leading-relaxed">
              Especialistas en la <strong className="text-[#00E676] font-semibold">venta, instalación y mantenimiento</strong> de calentadores a gas. Disfruta de baños calientes y seguros en Manizales con el respaldo de técnicos certificados.
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white px-8 py-4 font-bold shadow-xs hover:shadow-sm backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                Ver Servicios
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 border-t border-white/15 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-slate-200 justify-center lg:justify-start">
                <BadgeCheck className="h-5 w-5 text-cyan-400 shrink-0" />
                <span className="text-sm">Técnicos Certificados</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 justify-center lg:justify-start">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-sm">Garantía Directa</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 justify-center lg:justify-start col-span-2 sm:col-span-1">
                <Clock className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-sm">Soporte Rápido</span>
              </div>
            </div>
          </div>

          {/* Column 2: Premium Visual Card Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient fire glow around the badge */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 opacity-10 blur-xl animate-pulse" />

            {/* Glassmorphic Guarantee Card */}
            <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0D2A6B] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-cyan-900/50 border border-cyan-800 flex items-center justify-center">
                <Flame className="h-6 w-6 text-cyan-400 animate-bounce" />
              </div>

              {/* Title & Badge */}
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Mundo Gas Manizales</span>
                <h3 className="text-2xl font-bold text-white">Servicio Confiable</h3>
                <p className="text-sm text-slate-300">Protegemos tu hogar asegurando instalaciones seguras y calentadores eficientes.</p>
              </div>

              {/* Showcase list with numbers or checks */}
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 rounded-2xl bg-[#153A8A] p-4 border border-white/10 hover:bg-[#153A8A]/80 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D2A6B] text-[#FFD700] shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Equipos de Alta Gama</h4>
                    <p className="text-xs text-slate-300">Modelos Bosch, Clasic y Challenger listos para despacho inmediato.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-2xl bg-[#153A8A] p-4 border border-white/10 hover:bg-[#153A8A]/80 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D2A6B] text-[#FFD700] shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Mantenimiento de Seguridad</h4>
                    <p className="text-xs text-slate-300">Eliminación de monóxido, limpieza y calibración de gas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-2xl bg-[#153A8A] p-4 border border-white/10 hover:bg-[#153A8A]/80 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D2A6B] text-[#FFD700] shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Instalaciones Certificadas</h4>
                    <p className="text-xs text-slate-300">Técnicos matriculados bajo regulaciones NTC Colombianas.</p>
                  </div>
                </li>
              </ul>

              {/* Visual mini-indicator */}
              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-6">
                <div className="flex -space-x-2">
                  <span className="inline-block h-8 w-8 rounded-full bg-emerald-500 border border-[#003B31] text-[10px] font-extrabold text-white flex items-center justify-center">B</span>
                  <span className="inline-block h-8 w-8 rounded-full bg-cyan-500 border border-[#003B31] text-[10px] font-extrabold text-white flex items-center justify-center">C</span>
                  <span className="inline-block h-8 w-8 rounded-full bg-blue-600 border border-[#003B31] text-[10px] font-extrabold text-white flex items-center justify-center">M</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-teal-400">Cobertura</span>
                  <span className="text-sm font-bold text-white">Toda Manizales</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
