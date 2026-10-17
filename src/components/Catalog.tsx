import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  MessageSquare,
  Loader,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Wrench,
  Info,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { businessData } from '../data/businessData';
import { apiUrl } from '../utils/api';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  details: string;
  imageUrl: string;
  images?: string[];
}

export const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'warranty' | 'installation'>('details');

  // Obtener teléfono de WhatsApp principal o por defecto
  const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp)?.whatsappFormatted || businessData.whatsappPrimary;
  const cleanedPhone = primaryPhone.replace('+', '');
  const supportPhone = businessData.contact.phoneNumbers[0]?.number || '313 6076305';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl('/api/products'));
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

  // Bloquear scroll de la página cuando el modal de detalles está abierto
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeProductDetails();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProduct]);

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setActiveTab('details');
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

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
            Compra tu equipo hoy mismo de forma directa. Haz clic en cualquier producto para ver todas sus fotos, especificaciones completas e iniciar tu pedido por WhatsApp.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const formattedPrice = product.price.toLocaleString('es-CO');
            const productImages = (product.images && product.images.length > 0) ? product.images : [product.imageUrl];
            
            // Construir enlace de WhatsApp
            const message = `Hola Mundo Gas, estoy interesado en el producto: ${product.name} que cuesta $${formattedPrice}. ¿Me podrían brindar más información?`;
            const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between rounded-3xl bg-[#0D2A6B] border border-white/10 hover:border-amber-400/50 shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden"
              >
                <div>
                  {/* Product Image Container con object-contain y fondo blanco para no recortar */}
                  <div
                    onClick={() => openProductDetails(product)}
                    className="relative h-64 sm:h-72 w-full bg-white overflow-hidden border-b border-white/10 flex items-center justify-center p-4 cursor-pointer"
                  >
                    <img
                      src={productImages[0] || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge contador de imágenes si tiene más de 1 */}
                    {productImages.length > 1 && (
                      <div className="absolute top-3 right-3 bg-[#011B3E]/85 backdrop-blur-xs text-amber-400 border border-amber-400/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{productImages.length} fotos</span>
                      </div>
                    )}

                    {/* Badge si está agotado */}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                        <span className="bg-red-650/80 border border-red-500/50 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full">
                          Agotado
                        </span>
                      </div>
                    )}

                    {/* Overlay sutil para invitar a ver detalles */}
                    <div className="absolute inset-x-0 bottom-0 py-1.5 bg-[#011B3E]/90 backdrop-blur-xs text-white text-[11px] font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Clic para ver especificaciones y fotos
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div
                      onClick={() => openProductDetails(product)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-extrabold text-white text-lg leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">
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

                    {/* Description Preview */}
                    {product.details && (
                      <p
                        onClick={() => openProductDetails(product)}
                        className="text-slate-300 text-xs leading-relaxed pt-2 border-t border-white/5 line-clamp-2 cursor-pointer hover:text-white"
                      >
                        {product.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => openProductDetails(product)}
                    className="w-full bg-[#153A8A] hover:bg-[#1C4CB5] text-slate-200 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Info className="h-4 w-4 text-amber-400" />
                    Ver especificaciones
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 ${
                      product.stock > 0
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 fill-white/10" />
                    Comprar por WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL / PESTAÑA DE ESPECIFICACIONES DEL PRODUCTO */}
      {selectedProduct && (() => {
        const productImages = (selectedProduct.images && selectedProduct.images.length > 0)
          ? selectedProduct.images
          : [selectedProduct.imageUrl];
        const formattedPrice = selectedProduct.price.toLocaleString('es-CO');
        const message = `Hola Mundo Gas, estoy interesado en el producto: *${selectedProduct.name}* ($${formattedPrice}). Me gustaría conocer más detalles y coordinar la compra.`;
        const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fade-in"
            onClick={closeProductDetails}
          >
            <div
              className="relative w-full max-w-4xl bg-[#0B2256] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón Cerrar */}
              <button
                onClick={closeProductDetails}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#011B3E]/80 hover:bg-red-600 text-white transition-colors cursor-pointer border border-white/10"
                title="Cerrar (Esc)"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
                {/* Columna Izquierda: Galería de Imágenes */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-[#081B44] border-b lg:border-b-0 lg:border-r border-white/10">
                  <div>
                    {/* Visor Principal */}
                    <div className="relative w-full h-72 sm:h-96 bg-white rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-white/10 shadow-inner group">
                      <img
                        src={productImages[activeImageIndex] || selectedProduct.imageUrl}
                        alt={`${selectedProduct.name} - Imagen ${activeImageIndex + 1}`}
                        className="w-full h-full object-contain"
                      />

                      {/* Flechas de navegación si hay más de 1 imagen */}
                      {productImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#011B3E]/80 hover:bg-amber-500 hover:text-[#011B3E] text-white p-2 rounded-full transition-colors cursor-pointer shadow-md"
                            title="Foto anterior"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setActiveImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#011B3E]/80 hover:bg-amber-500 hover:text-[#011B3E] text-white p-2 rounded-full transition-colors cursor-pointer shadow-md"
                            title="Siguiente foto"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {/* Contador de fotos */}
                      {productImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-[#011B3E]/85 text-amber-400 border border-amber-400/30 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          {activeImageIndex + 1} / {productImages.length}
                        </div>
                      )}
                    </div>

                    {/* Miniaturas */}
                    {productImages.length > 1 && (
                      <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2">
                        {productImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`h-16 w-16 shrink-0 rounded-xl bg-white p-1 overflow-hidden border-2 transition-all cursor-pointer ${
                              activeImageIndex === idx
                                ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                                : 'border-white/10 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="Miniatura" className="w-full h-full object-contain" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sello de Confianza */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Producto 100% Original
                    </span>
                    <span>Mundo Gas Manizales</span>
                  </div>
                </div>

                {/* Columna Derecha: Especificaciones y Compra */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Encabezado */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          Gasodomésticos
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            selectedProduct.stock > 0
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                              : 'bg-red-950/60 text-red-300 border border-red-800/40'
                          }`}
                        >
                          {selectedProduct.stock > 0 ? `${selectedProduct.stock} disponibles en tienda` : 'Agotado'}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        {selectedProduct.name}
                      </h2>

                      {/* Precio */}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-amber-400">
                          ${formattedPrice}
                        </span>
                        <span className="text-xs text-slate-400">COP (Pesos Colombianos)</span>
                      </div>
                    </div>

                    {/* Pestañas de Especificaciones */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex gap-2 border-b border-white/10 pb-2">
                        <button
                          onClick={() => setActiveTab('details')}
                          className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                            activeTab === 'details'
                              ? 'bg-amber-400 text-[#011B3E]'
                              : 'text-slate-300 hover:bg-[#153A8A]'
                          }`}
                        >
                          <Info className="h-3.5 w-3.5" />
                          Especificaciones
                        </button>
                        <button
                          onClick={() => setActiveTab('warranty')}
                          className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                            activeTab === 'warranty'
                              ? 'bg-amber-400 text-[#011B3E]'
                              : 'text-slate-300 hover:bg-[#153A8A]'
                          }`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Garantía
                        </button>
                        <button
                          onClick={() => setActiveTab('installation')}
                          className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                            activeTab === 'installation'
                              ? 'bg-amber-400 text-[#011B3E]'
                              : 'text-slate-300 hover:bg-[#153A8A]'
                          }`}
                        >
                          <Wrench className="h-3.5 w-3.5" />
                          Instalación
                        </button>
                      </div>

                      {/* Contenido según la pestaña activa */}
                      <div className="pt-4 min-h-[140px]">
                        {activeTab === 'details' && (
                          <div className="space-y-3">
                            <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                              <Info className="h-3.5 w-3.5" /> Ficha Técnica y Especificaciones
                            </h4>
                            <div className="bg-[#081B44]/80 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
                              {selectedProduct.details && selectedProduct.details.trim() ? (
                                <div className="text-sm text-slate-200 leading-relaxed space-y-1.5">
                                  {selectedProduct.details.split('\n').map((line, idx) => {
                                    const trimmed = line.trim();
                                    if (!trimmed) return <div key={idx} className="h-1" />;
                                    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                                      const text = trimmed.replace(/^[•\-\*]\s*/, '');
                                      if (text.includes(':')) {
                                        const [key, ...rest] = text.split(':');
                                        return (
                                          <div key={idx} className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold shrink-0 mt-0.5">✓</span>
                                            <div>
                                              <strong className="text-white font-semibold">{key.trim()}:</strong>{' '}
                                              <span className="text-slate-300">{rest.join(':').trim()}</span>
                                            </div>
                                          </div>
                                        );
                                      }
                                      return (
                                        <div key={idx} className="flex items-start gap-2">
                                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">✓</span>
                                          <span className="text-slate-200">{text}</span>
                                        </div>
                                      );
                                    }
                                    if (trimmed.includes(':')) {
                                      const [key, ...rest] = trimmed.split(':');
                                      return (
                                        <div key={idx} className="flex items-start gap-2">
                                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">✓</span>
                                          <div>
                                            <strong className="text-white font-semibold">{key.trim()}:</strong>{' '}
                                            <span className="text-slate-300">{rest.join(':').trim()}</span>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return <p key={idx} className="text-slate-200">{trimmed}</p>;
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-300 italic">
                                  Calentador a gas de alta eficiencia y rendimiento. Comunícate con nuestros asesores por WhatsApp para conocer la ficha técnica completa y cotizar tu instalación.
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {activeTab === 'warranty' && (
                          <div className="space-y-2.5 text-sm bg-[#081B44]/60 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-start gap-2.5">
                              <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Garantía Directa de Fábrica</strong>
                                <span className="text-slate-300 text-xs">
                                  Respaldo oficial de la marca y garantía en piezas y componentes originales.
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Servicio Técnico Especializado</strong>
                                <span className="text-slate-300 text-xs">
                                  Contamos con taller propio y repuestos originales disponibles en Manizales.
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === 'installation' && (
                          <div className="space-y-2.5 text-sm bg-[#081B44]/60 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-start gap-2.5">
                              <Wrench className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Técnicos Certificados en Gas</strong>
                                <span className="text-slate-300 text-xs">
                                  Instalación profesional cumpliendo con la norma técnica colombiana NTC 3567.
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Entrega Inmediata en Manizales</strong>
                                <span className="text-slate-300 text-xs">
                                  Llevamos el equipo a tu domicilio o puedes retirarlo en nuestro local Centro (Calle 25 #21-43).
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Compra y Contacto */}
                  <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2.5 font-extrabold py-4 px-6 rounded-2xl text-base shadow-lg transition-all duration-300 ${
                        selectedProduct.stock > 0
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:shadow-emerald-950/30 hover:-translate-y-0.5'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      <MessageSquare className="h-5 w-5 fill-white/10" />
                      {selectedProduct.stock > 0 ? 'Pedir por WhatsApp Ahora' : 'Producto sin stock'}
                    </a>

                    <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
                      <span>¿Prefieres llamar?</span>
                      <a
                        href={`tel:${supportPhone}`}
                        className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Phone className="h-3.5 w-3.5" /> {supportPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </section>
  );
};
