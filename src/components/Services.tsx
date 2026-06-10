import React from 'react';
import { businessData } from '../data/businessData';
import { Flame, BadgeCheck, Wrench, CheckCircle2, MessageSquare } from 'lucide-react';

// Map icon string names to actual Lucide components
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame: Flame,
  BadgeCheck: BadgeCheck,
  Wrench: Wrench,
};

export const Services: React.FC = () => {
  const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp) || businessData.contact.phoneNumbers[0];

  return (
    <section id="servicios" className="bg-slate-50 py-24 scroll-mt-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-sm font-bold tracking-widest text-emerald-600 uppercase">
            Lo Que Hacemos
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Servicios Profesionales de Gasodomésticos
          </h2>
          <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-slate-600 text-lg">
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
                className="group relative flex flex-col justify-between rounded-3xl bg-white p-8 shadow-md border border-slate-100 hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
              >
                <div>
                  {/* Icon Badge */}
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                    <IconComponent className="h-7 w-7" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Highlights Bullet List */}
                  <ul className="mt-6 space-y-2 border-t border-slate-100 pt-6">
                    {service.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
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
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 px-4 text-sm transition-all duration-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Consultar {service.id === 'venta' ? 'Marcas' : service.id === 'instalacion' ? 'Instalación' : 'Mantenimiento'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 md:p-12 shadow-lg text-white">
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
                className="inline-flex rounded-2xl bg-white text-emerald-600 px-6 py-3.5 font-extrabold text-sm md:text-base hover:bg-slate-100 shadow-md transition-all duration-300"
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
