import React, { useState, useEffect } from 'react';
import { businessData } from '../data/businessData';
import { getBusinessStatus } from '../utils/scheduleHelper';
import type { BusinessStatus } from '../utils/scheduleHelper';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<BusinessStatus>({ isOpen: false, message: 'Cargando...', nextStatusChange: '' });
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('General');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Update schedule status in real time
  useEffect(() => {
    setStatus(getBusinessStatus());
    const interval = setInterval(() => {
      setStatus(getBusinessStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Compile WhatsApp message
    const formattedMessage = encodeURIComponent(
      `Hola Mundo Gas! Mi nombre es *${name}* (${phone}).\nMe interesa: *${interest}*.\n\n*Mensaje:*\n${message || 'Solicito asesoría técnica.'}`
    );
    const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp)?.whatsappFormatted || businessData.whatsappPrimary;
    const waUrl = `https://wa.me/${primaryPhone.replace('+', '')}?text=${formattedMessage}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');
    setSubmitted(true);
    
    // Reset form after a small delay
    setTimeout(() => {
      setName('');
      setPhone('');
      setInterest('General');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section id="contacto" className="bg-slate-50 py-24 scroll-mt-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-sm font-bold tracking-widest text-emerald-600 uppercase">
            Hablemos Hoy
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Ponte en Contacto con Nosotros
          </h2>
          <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-slate-600 text-lg">
            ¿Tienes dudas sobre instalación, fallas en tu calentador o deseas comprar uno nuevo? Visítanos, llámanos o escríbenos a través del formulario.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Contact details & Schedule (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Box */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                {/* Phone numbers */}
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Líneas de Atención</h4>
                    <div className="mt-1 space-y-1">
                      {businessData.contact.phoneNumbers.map((phoneItem, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <a
                            href={phoneItem.isWhatsApp ? `https://wa.me/${phoneItem.whatsappFormatted.replace('+', '')}` : `tel:${phoneItem.number}`}
                            target={phoneItem.isWhatsApp ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="text-slate-700 text-sm font-semibold hover:text-cyan-600 transition-colors"
                          >
                            {phoneItem.number}
                          </a>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {phoneItem.label.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Emails */}
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correos Electrónicos</h4>
                    <div className="mt-1 space-y-1">
                      {businessData.contact.emails.map((email, idx) => (
                        <a
                          key={idx}
                          href={`mailto:${email}`}
                          className="block text-slate-700 text-sm font-semibold hover:text-emerald-600 transition-colors"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dirección Física</h4>
                    <p className="mt-1 text-slate-700 text-sm font-semibold">
                      {businessData.contact.address.street}, {businessData.contact.address.neighborhood}
                    </p>
                    <p className="text-xs text-slate-400">
                      {businessData.contact.address.city}, {businessData.contact.address.department}, {businessData.contact.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time schedule panel */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-100 space-y-6">
              
              {/* Dynamic opening status */}
              <div
                className={`rounded-2xl p-4 flex items-center gap-3 border ${
                  status.isOpen
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-rose-50 border-rose-100'
                }`}
              >
                <span className="relative flex h-3.5 w-3.5 shrink-0">
                  {status.isOpen && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${status.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </span>
                <div>
                  <span className={`block font-bold text-sm ${status.isOpen ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {status.message}
                  </span>
                  <span className="text-xs text-slate-500">
                    {status.nextStatusChange}
                  </span>
                </div>
              </div>

              {/* Schedule listing */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <span className="font-bold text-sm">Horario de Atención</span>
                </div>

                <div className="space-y-3 pt-2 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-medium">Lunes a Viernes</span>
                    <span className="font-bold">08:00 AM - 12:30 PM y 02:00 PM - 06:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-medium">Sábados</span>
                    <span className="font-bold">08:00 AM - 01:30 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span className="font-medium">Domingos y Festivos</span>
                    <span className="font-bold">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form & Map (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Form */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Cotiza o Agenda tu Visita</h3>
              
              {submitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-emerald-700">¡Mensaje Preparado!</h4>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Hemos abierto WhatsApp para que envíes tu solicitud. Estaremos listos para responderte en breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Celular / Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej. 313 1234567"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Servicio / Equipo de Interés</label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    >
                      <option value="General">Asesoría General</option>
                      <option value="Calentador Bosch">Calentador Bosch (Paso/Digital)</option>
                      <option value="Calentador Classic">Calentador Classic (Baja Presión)</option>
                      <option value="Instalación Profesional">Instalación Certificada</option>
                      <option value="Otro">Otro Calentador / Emergencia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mensaje / Comentarios</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Descríbenos tu necesidad (Ej. El calentador se apaga solo, busco calentador para 2 duchas...)"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 px-6 transition-all duration-300 transform active:scale-95"
                  >
                    <Send className="h-4.5 w-4.5" />
                    Enviar Solicitud vía WhatsApp
                  </button>
                </form>
              )}
            </div>

            {/* Stylized map card */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Ubicación de Mundo Gas</h4>
                  <p className="text-xs text-slate-500">Calle 25 #21-43 Centro, Manizales, Caldas</p>
                </div>
                <a
                  href={businessData.contact.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-slate-50 hover:bg-slate-100 text-cyan-600 border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 text-xs font-bold transition-all duration-300"
                >
                  Abrir en Google Maps
                </a>
              </div>

              {/* Styled SVG Map of Manizales center grid */}
              <div className="h-48 rounded-2xl bg-slate-100/60 relative overflow-hidden border border-slate-200/80 flex items-center justify-center">
                {/* SVG City Roads Illustration */}
                <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 400 200" fill="none">
                  {/* Streets (horizontal) */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="0" y1="70" x2="400" y2="70" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="0" y1="110" x2="400" y2="110" stroke="#94a3b8" strokeWidth="3" /> {/* Carrera 21/Main avenue */}
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#cbd5e1" strokeWidth="2" />

                  {/* Calles (vertical) */}
                  <line x1="40" y1="0" x2="40" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="120" y1="0" x2="120" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="#94a3b8" strokeWidth="3" /> {/* Calle 25/Our Street */}
                  <line x1="280" y1="0" x2="280" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="360" y1="0" x2="360" y2="200" stroke="#cbd5e1" strokeWidth="2" />

                  {/* Neighborhood landmarks block highlights */}
                  <rect x="125" y="75" width="70" height="30" rx="3" fill="#e2e8f0" />
                  <text x="160" y="93" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Plaza Bolívar</text>
                  
                  <rect x="205" y="75" width="70" height="30" rx="3" fill="#e2e8f0" />
                  <text x="240" y="93" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Centro</text>
                </svg>

                {/* Target Intersection Label */}
                <div className="absolute top-[88px] left-[155px] text-[9px] font-bold text-slate-500 rotate-[-90deg]">
                  Calle 25
                </div>
                <div className="absolute top-[114px] left-[220px] text-[9px] font-bold text-slate-500">
                  Carrera 21
                </div>

                {/* Animated Store Pin on Intersection */}
                <div className="absolute top-[108px] left-[200px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative flex h-4 w-4 rounded-full bg-cyan-500 border-2 border-white items-center justify-center shadow-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  </span>
                  
                  {/* Pin Flag Label */}
                  <div className="absolute bottom-6 bg-emerald-600 text-white border border-emerald-500 px-2 py-1 rounded-md text-[9px] font-extrabold whitespace-nowrap shadow-xl">
                    MUNDO GAS
                  </div>
                </div>

                {/* Grid Overlay Compass */}
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  N ↑
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
