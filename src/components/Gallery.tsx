import React, { useState } from 'react';
import { businessData } from '../data/businessData';
import type { PostItem } from '../data/businessData';
import { Logo } from './Logo';
import { ThumbsUp, MessageCircle, Share2, Globe, Check, X, MessageSquare, ChevronRight } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  
  // Local state to keep track of liked posts
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>(
    businessData.posts.reduce((acc, post) => {
      acc[post.id] = post.likes;
      return acc;
    }, {} as Record<string, number>)
  );

  const toggleLike = (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    setLikesCount(prev => ({
      ...prev,
      [postId]: isLiked ? prev[postId] - 1 : prev[postId] + 1
    }));
  };

  const primaryPhone = businessData.contact.phoneNumbers.find(p => p.isWhatsApp) || businessData.contact.phoneNumbers[0];

  return (
    <section id="novedades" className="bg-white py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-sm font-bold tracking-widest text-cyan-600 uppercase">
            Nuestra Vitrina
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Novedades y Equipos en Exhibición
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full" />
          <p className="text-slate-600 text-lg">
            Explora las marcas de calentadores y servicios que destacamos en nuestro catálogo. Hacé clic en cualquier publicación para ver especificaciones técnicas.
          </p>
        </div>

        {/* Social Feed Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessData.posts.map((post) => {
            const isLiked = likedPosts[post.id];
            
            return (
              <article
                key={post.id}
                className="flex flex-col justify-between rounded-3xl bg-slate-50/50 border border-slate-100 shadow-md overflow-hidden hover:border-slate-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Header (FB style profile info) */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Small rounded Logo as Avatar */}
                    <div className="h-10 w-10 rounded-full bg-white p-1 flex items-center justify-center border border-slate-100">
                      <Logo showText={false} className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-800 text-sm hover:underline cursor-pointer">
                          Mundo Gas Manizales
                        </span>
                        {/* Verified badge */}
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white">
                          <Check className="h-2 w-2 stroke-[3.5]" />
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>{post.date}</span>
                        <span>•</span>
                        <Globe className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content text */}
                <div className="px-5 pb-4">
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                  {/* Hashtags */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-cyan-600 text-xs hover:underline cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Media Image */}
                <div
                  className="relative cursor-pointer overflow-hidden aspect-4/3 bg-slate-100 flex items-center justify-center border-y border-slate-100 group"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 text-xs font-bold">
                      Ver Ficha Técnica
                    </span>
                  </div>
                </div>

                {/* Interactions counts bar */}
                <div className="px-5 py-2.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      <ThumbsUp className="h-3 w-3 fill-white" />
                    </span>
                    <span className="font-medium text-slate-600">{likesCount[post.id]}</span>
                  </div>
                  <div className="flex gap-3">
                    <span>{post.commentsCount} comentarios</span>
                    <span>{post.shares} veces compartido</span>
                  </div>
                </div>

                {/* Buttons Bar (Like, Comment, Share) */}
                <div className="px-3 py-1 flex justify-around text-slate-500 text-sm font-semibold">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer ${
                      isLiked ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-blue-600' : ''}`} />
                    <span>Me gusta</span>
                  </button>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Comentar</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}#novedades`);
                      alert('Enlace copiado al portapapeles para compartir.');
                    }}
                    className="flex-1 py-2 flex items-center justify-center gap-2 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Compartir</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Detailed Product Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
            <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* Product Image */}
                <div className="rounded-2xl overflow-hidden aspect-4/3 md:aspect-square bg-slate-50 flex items-center justify-center border border-slate-100">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold border border-emerald-100 uppercase">
                      Línea {selectedPost.brand}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {selectedPost.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedPost.content}
                    </p>

                    {/* Features details according to brand */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beneficios del Producto</span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {selectedPost.brand === 'Bosch' && (
                          <>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Ahorro de hasta el 60% en gas</li>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Sensor de sobretemperatura y gases</li>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Display digital inteligente</li>
                          </>
                        )}
                        {selectedPost.brand === 'Clasic' && (
                          <>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Encendido electrónico de baja presión</li>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Válvula de seguridad por sobrepresión</li>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Diseño metálico ultraduradero</li>
                          </>
                        )}
                        {selectedPost.brand === 'Servicio Técnico' && (
                          <>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Diagnóstico de fugas certificado</li>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Limpieza de hollín e inyectores</li>
                            <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-cyan-600" /> Certificado de revisión incluido</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* CTA button */}
                  <a
                    href={`https://wa.me/${primaryPhone.whatsappFormatted.replace('+', '')}?text=${encodeURIComponent(
                      `Hola Mundo Gas, vi su publicación sobre el *${selectedPost.title}* y me gustaría recibir asesoría y costos.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 transition-all duration-300"
                  >
                    <MessageSquare className="h-5 w-5 fill-white/10" />
                    Preguntar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
