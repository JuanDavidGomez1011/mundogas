import React, { useEffect, useState } from 'react';
import { ShoppingBag, MessageSquare, Loader } from 'lucide-react';
import { businessData } from '../data/businessData';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  details: string;
  imageUrl: string;
}

export const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener teléfono de WhatsApp principal o por defecto
  const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp)?.whatsappFormatted || businessData.whatsappPrimary;
  const cleanedPhone = primaryPhone.replace('+', '');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error al cargar catálogo de productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0D2A6B] py-16 flex flex-col items-center justify-center text-slate-200">
        <Loader className="h-8 w-8 animate-spin text-amber-500 mb-2" />
        <span className="text-sm font-semibold">Cargando catálogo...</span>
      </div>
    );
  }

  // Si no hay productos cargados en el backend, no renderizamos la sección para no dejar espacio vacío
  if (products.length === 0) {
    return null;
  }

  return (
    <section id="catalogo" className="bg-[#011B3E] py-24 scroll-mt-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-amber-400 uppercase">
            <ShoppingBag className="h-4 w-4" />
            Catálogo
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Nuestros Calentadores y Equipos Disponibles
          </h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-300 text-lg">
            Compra tu equipo hoy mismo de forma directa. Selecciona un producto para iniciar tu pedido personalizado por WhatsApp.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const formattedPrice = product.price.toLocaleString('es-CO');
            
            // Construir enlace de WhatsApp
            const message = `Hola, estoy interesado en el producto: ${product.name} que cuesta $${formattedPrice}.`;
            const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between rounded-3xl bg-[#0D2A6B] border border-white/10 hover:border-white/25 shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-square w-full bg-[#153A8A] overflow-hidden border-b border-white/10">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                        <span className="bg-red-650/80 border border-red-500/50 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-white text-lg leading-tight group-hover:text-amber-400 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    
                    {/* Price and Stock */}
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-2xl font-black text-amber-400">
                        ${formattedPrice}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        product.stock > 0 ? 'bg-emerald-950/40 text-emerald-300' : 'bg-red-950/40 text-red-300'
                      }`}>
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                      </span>
                    </div>

                    {/* Description Details */}
                    {product.details && (
                      <p className="text-slate-300 text-xs leading-relaxed pt-2 border-t border-white/5 line-clamp-3">
                        {product.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-6 pt-0">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full font-bold py-3.5 px-4 rounded-2xl text-sm transition-all duration-200 ${
                      product.stock > 0
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <MessageSquare className="h-4.5 w-4.5 fill-white/10" />
                    Comprar por WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
