import React from 'react';
import { businessData } from '../data/businessData';
import { Flame, BadgeCheck, Wrench, CheckCircle2, MessageSquare, ShoppingCart, ShieldCheck, Package, Activity, Droplet, Wind, UserCog, MessageCircle, Thermometer, Database, Settings } from 'lucide-react';

// Map icon string names to actual Lucide components
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame: Flame,
  BadgeCheck: BadgeCheck,
  Wrench: Wrench,
};

const getServiceIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('venta de calentadores')) return ShoppingCart;
  if (lower.includes('instalación')) return Wrench;
  if (lower.includes('reparación de calentadores')) return Wrench;
  if (lower.includes('mantenimiento')) return ShieldCheck;
  if (lower.includes('repuestos')) return Package;
  if (lower.includes('redes')) return Activity;
  if (lower.includes('chimeneas a gas')) return Flame;
  if (lower.includes('chimeneas de alcohol')) return Droplet;
  if (lower.includes('quemadores')) return Flame;
  if (lower.includes('ductos')) return Wind;
  if (lower.includes('servicio técnico')) return UserCog;
  if (lower.includes('estufas')) return Flame;
  if (lower.includes('asesoría')) return MessageCircle;
  
  if (lower.includes('paso')) return Thermometer;
  if (lower.includes('acumulación')) return Database;
  if (lower.includes('accesorios')) return Settings;
  
  return CheckCircle2;
};

export const Services: React.FC = () => {
  const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp) || businessData.contact.phoneNumbers[0];

  return (
    <section id="servicios" className="bg-[#0D2A6B] py-24 scroll-mt-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-sm font-bold tracking-widest text-emerald-400 uppercase">
            Lo Que Hacemos
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Servicios Profesionales de Gasodomésticos
          </h2>
          <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-slate-200 text-lg">
            Garantizamos soluciones integrales para calentadores a gas en Manizales. Seguridad, respaldo técnico y eficiencia energética en tu hogar.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessData.services.map((service) => {
            const IconComponent = IconMap[service.iconName] || Wrench;
            
            // Build direct WhatsApp link per service
            const serviceMessage = encodeURIComponent(
              `Hola Mundo Gas! Me interesa el servicio de: *${service.title}* en Manizales. ¿Podrían brindarme información y tarifas?`
            );
            const waLink = `https://wa.me/${primaryPhone.whatsappFormatted.replace('+', '')}?text=${serviceMessage}`;

            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-[#0D2A6B] p-8 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:scale-[1.03] transition-all duration-300"
              >
                <div>
                  {/* Icon Badge */}
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#153A8A] text-[#FFD700] mb-6 group-hover:bg-[#FFD700] group-hover:text-[#0D2A6B] transition-all duration-300">
                    <IconComponent className="h-7 w-7" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#FFD700] transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Highlights Bullet List */}
                  <ul className="mt-6 space-y-2 border-t border-white/15 pt-6">
                    {service.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-200">
                        <CheckCircle2 className="h-4.5 w-4.5 text-[#00E676] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA Button */}
                <div className="mt-8 pt-4">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#153A8A] hover:bg-[#1A45A0] text-white font-bold py-3 px-4 text-sm transition-all duration-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Consultar {service.id === 'venta' ? 'Marcas' : service.id === 'instalacion' ? 'Instalación' : 'Mantenimiento'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Services & Categories List */}
        <div className="mt-16 space-y-12">
          {/* Catálogo de Servicios */}
          <div className="bg-[#0D2A6B] p-8 md:p-12 rounded-3xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-[#153A8A] rounded-xl">
                <Wrench className="h-6 w-6 text-[#FFD700]" />
              </div>
              Catálogo de Servicios
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {businessData.allServices.map((item, i) => {
                const IconComponent = getServiceIcon(item);
                return (
                  <div key={i} className="flex items-center gap-3 bg-[#153A8A] border border-white/10 rounded-xl p-4 shadow-lg hover:bg-[#1A45A0] hover:border-[#FFD700]/50 hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(255,215,0,0.15)] transition-all duration-300 group">
                    <IconComponent className="h-6 w-6 text-[#00E676] shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-white text-sm font-semibold leading-snug">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categorías de Productos */}
          <div className="bg-[#0D2A6B] p-8 md:p-12 rounded-3xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-[#153A8A] rounded-xl">
                <Flame className="h-6 w-6 text-[#FFD700]" />
              </div>
              Categorías de Productos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {businessData.categories.map((cat, i) => {
                const IconComponent = getServiceIcon(cat);
                return (
                  <div key={i} className="flex items-center gap-3 bg-[#153A8A] border border-white/10 rounded-xl p-4 shadow-lg hover:bg-[#1A45A0] hover:border-[#FFD700]/50 hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(255,215,0,0.15)] transition-all duration-300 group">
                    <IconComponent className="h-6 w-6 text-[#00E676] shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-white text-sm font-semibold leading-snug">{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 md:p-12 shadow-lg text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <h4 className="text-2xl font-bold">¿Necesitas asistencia técnica de emergencia?</h4>
              <p className="text-white/80">
                Atendemos fallas urgentes de calentadores, fugas de gas o problemas de presión de agua. Técnicos disponibles para visitas rápidas.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <a
                href={`tel:${businessData.contact.phoneNumbers[0].number.replace(/\s+/g, '')}`}
                className="inline-flex rounded-2xl bg-white text-orange-600 px-6 py-3.5 font-extrabold text-sm md:text-base hover:bg-slate-100 shadow-md transition-all duration-300"
              >
                Llamar Ahora: {businessData.contact.phoneNumbers[0].number}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
