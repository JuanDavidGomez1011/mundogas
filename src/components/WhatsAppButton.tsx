import React from 'react';
import { businessData } from '../data/businessData';

export const WhatsAppButton: React.FC = () => {
  const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp) || businessData.contact.phoneNumbers[0];
  const message = encodeURIComponent('¡Hola Mundo Gas! Me gustaría obtener más información sobre sus servicios.');
  const waLink = `https://wa.me/${primaryPhone.whatsappFormatted.replace('+', '')}?text=${message}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.5)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-all duration-300 animate-bounce group"
      aria-label="Chat en WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-9 h-9 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.75.454 3.4 1.255 4.84L2 22l5.323-1.19A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.353c-1.558 0-3.076-.41-4.417-1.189l-.316-.183-3.275.73.744-3.14-.206-.325A8.309 8.309 0 013.647 12c0-4.606 3.747-8.353 8.353-8.353 4.606 0 8.353 3.747 8.353 8.353 0 4.606-3.747 8.353-8.353 8.353z"/>
      </svg>
    </a>
  );
};
