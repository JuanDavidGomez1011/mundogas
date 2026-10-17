import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Package,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader,
  X,
  Star,
  Layers,
  Pencil,
  Sparkles,
  Save
} from 'lucide-react';
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

const SPEC_TEMPLATE = `• Capacidad: 16 Litros/minuto
• Tipo de tiro: Tiro Natural
• Tipo de gas: Gas Natural
• Presión de agua: Apto para baja y alta presión
• Serpentín: 100% Cobre de alta pureza
• Garantía: 3 Años de garantía total de fábrica
• Seguridad: Sensor de llama y termostato de sobrecalentamiento
• Instalación: Asesoría y servicio técnico en Manizales`;

export const AdminPage: React.FC = () => {
  const { token, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Create form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [details, setDetails] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Edit modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Status states
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch products function
  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl('/api/products'));
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  // Image handling for Create Form
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const combinedFiles = [...imageFiles, ...files].slice(0, 8);
    setImageFiles(combinedFiles);

    const previewPromises = combinedFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previews) => {
      setImagePreviews(previews);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newFiles = imageFiles.filter((_, idx) => idx !== indexToRemove);
    const newPreviews = imagePreviews.filter((_, idx) => idx !== indexToRemove);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    const file = imageFiles[indexToPrimary];
    const preview = imagePreviews[indexToPrimary];

    const newFiles = [file, ...imageFiles.filter((_, idx) => idx !== indexToPrimary)];
    const newPreviews = [preview, ...imagePreviews.filter((_, idx) => idx !== indexToPrimary)];

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Quick insertion of specification lines
  const insertSpecSnippet = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    snippet: string
  ) => {
    setter((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return snippet;
      return `${trimmed}\n${snippet}`;
    });
  };

  // Submit Create Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || imageFiles.length === 0) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos requeridos y sube al menos una imagen.' });
      return;
    }

    setMessage(null);
    setFormSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('details', details);
    
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('image', imageFiles[0]);

    try {
      const response = await fetch(apiUrl('/api/products'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/admin/login');
        }
        throw new Error(data.message || 'Error al guardar el producto');
      }

      setMessage({ type: 'success', text: `¡Producto agregado con ${imageFiles.length} foto(s) correctamente!` });
      setName('');
      setPrice('');
      setStock('');
      setDetails('');
      setImageFiles([]);
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';

      fetchProducts();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error de red o conexión.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditStock(product.stock.toString());
    setEditDetails(product.details || '');
    setEditImageFiles([]);
    const existingImgs = (product.images && product.images.length > 0)
      ? product.images
      : [product.imageUrl];
    setEditImagePreviews(existingImgs.filter(Boolean));
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditImageFiles([]);
    setEditImagePreviews([]);
  };

  // Image handling for Edit Modal
  const handleEditImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const combinedFiles = [...editImageFiles, ...files].slice(0, 8);
    setEditImageFiles(combinedFiles);

    const previewPromises = combinedFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previews) => {
      setEditImagePreviews(previews);
    });

    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  // Submit Edit Form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName || !editPrice || !editStock) {
      setMessage({ type: 'error', text: 'Nombre, precio y stock son requeridos para actualizar.' });
      return;
    }

    setEditSubmitting(true);
    const formData = new FormData();
    formData.append('name', editName);
    formData.append('price', editPrice);
    formData.append('stock', editStock);
    formData.append('details', editDetails);

    editImageFiles.forEach((file) => {
      formData.append('images', file);
    });
    if (editImageFiles.length > 0) {
      formData.append('image', editImageFiles[0]);
    }

    try {
      const response = await fetch(apiUrl(`/api/products/${editingProduct.id}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/admin/login');
        }
        throw new Error(data.message || 'Error al actualizar el producto');
      }

      setMessage({ type: 'success', text: `¡Producto "${editName}" y sus especificaciones actualizados con éxito!` });
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'No se pudo actualizar el producto.' });
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(apiUrl(`/api/products/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/admin/login');
        }
        throw new Error(data.message || 'Error al eliminar el producto');
      }

      setProducts(products.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Producto eliminado con éxito.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'No se pudo eliminar el producto.' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#011B3E] flex items-center justify-center text-white">
        <Loader className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-3 font-semibold">Cargando administrador...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#011B3E] text-slate-200 py-10 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#153A8A]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header Dashboard */}
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-8 mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 bg-[#153A8A]/50 hover:bg-[#153A8A] border border-white/10 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Consola de Administración</h1>
              <p className="text-slate-400 text-sm">Gestiona productos, fotos y especificaciones técnicas de Mundo Gas</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </header>

        {/* Global Notifications */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl mb-8 border animate-fade-in ${
              message.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-950 text-emerald-200'
                : 'bg-red-950/40 border-red-950 text-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            )}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Create Product (5 col) */}
          <div className="lg:col-span-5 bg-[#0D2A6B]/80 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl h-fit">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-amber-400" />
              Agregar Nuevo Producto
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-semibold" htmlFor="name">
                  Nombre del Producto *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Calentador TITANIUM 16 Litros Tiro Natural"
                  className="w-full px-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 text-xs font-semibold" htmlFor="price">
                    Precio ($ COP) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <input
                      id="price"
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1650000"
                      className="w-full pl-9 pr-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 text-xs font-semibold" htmlFor="stock">
                    Stock / Disponibles *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Package className="h-4 w-4" />
                    </span>
                    <input
                      id="stock"
                      type="number"
                      required
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="1"
                      className="w-full pl-9 pr-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Especificaciones / Ficha Técnica */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 text-xs font-semibold flex items-center gap-1.5" htmlFor="details">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    Especificaciones / Ficha Técnica
                  </label>
                  <button
                    type="button"
                    onClick={() => setDetails(SPEC_TEMPLATE)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer underline"
                  >
                    <Sparkles className="h-3 w-3" /> Cargar plantilla
                  </button>
                </div>

                {/* Botones de sugerencias rápidas */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setDetails, '• Capacidad: 16 Litros/minuto')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Capacidad
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setDetails, '• Tipo de tiro: Tiro Natural')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Tiro Natural
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setDetails, '• Tipo de gas: Gas Natural')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Gas Natural
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setDetails, '• Presión de agua: Apto para baja y alta presión')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Presión Agua
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setDetails, '• Garantía: 3 Años de garantía total de fábrica')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Garantía
                  </button>
                </div>

                <textarea
                  id="details"
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Escribe las especificaciones aquí (se mostrarán cuando el cliente haga clic en 'Ver especificaciones' o en la foto):&#10;• Capacidad: 16 Litros&#10;• Tipo de tiro: Tiro Natural&#10;• Garantía: 3 Años"
                  className="w-full px-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm font-sans"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 text-xs font-semibold">
                    Fotos del Producto * {imagePreviews.length > 0 && `(${imagePreviews.length}/8)`}
                  </label>
                  <span className="text-[11px] text-amber-400 font-medium">
                    {imagePreviews.length === 0 ? 'Sube 1 o varias fotos' : 'La 1ª es la portada'}
                  </span>
                </div>

                <div className="border-2 border-dashed border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center bg-[#153A8A]/20 hover:border-amber-400 transition-colors relative group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="text-center space-y-1 py-2 pointer-events-none">
                    <ImageIcon className="mx-auto h-8 w-8 text-slate-400 group-hover:text-amber-400 transition-colors" />
                    <p className="text-xs font-semibold text-slate-200">
                      Haz clic o arrastra fotos aquí
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Puedes subir hasta 8 imágenes (PNG, JPG, WEBP)
                    </p>
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className={`relative group/thumb rounded-xl overflow-hidden border aspect-square bg-white flex items-center justify-center p-1 ${
                          index === 0 ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-white/10'
                        }`}
                      >
                        <img
                          src={preview}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-contain"
                        />

                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-[#011B3E] font-bold text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                            <Star className="h-2.5 w-2.5 fill-[#011B3E]" /> Portada
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white p-1 rounded-md transition-opacity cursor-pointer shadow-sm z-20"
                          title="Eliminar esta foto"
                        >
                          <X className="h-3 w-3" />
                        </button>

                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetPrimary(index);
                            }}
                            className="absolute bottom-1 inset-x-1 bg-[#011B3E]/90 hover:bg-amber-500 hover:text-[#011B3E] text-slate-200 text-[9px] font-semibold py-0.5 rounded transition-colors text-center cursor-pointer z-20"
                          >
                            Hacer portada
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-[#011B3E] font-extrabold py-3.5 px-4 rounded-2xl transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm shadow-lg"
              >
                {formSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Guardando producto...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Crear Producto
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List Products (7 col) */}
          <div className="lg:col-span-7 bg-[#0D2A6B]/80 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Productos Registrados ({products.length})</h2>

            {loadingProducts ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader className="h-8 w-8 animate-spin text-amber-500 mb-2" />
                <span className="text-sm">Obteniendo catálogo...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20 text-center text-slate-400 border border-white/10 rounded-2xl bg-[#153A8A]/10">
                <Package className="h-12 w-12 text-slate-500 mb-2" />
                <p className="text-sm font-semibold">No hay productos cargados en el catálogo</p>
                <p className="text-xs text-slate-500 mt-1">Usa el formulario de la izquierda para agregar el primero.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase font-bold">
                      <th className="pb-3 pr-4">Imagen</th>
                      <th className="pb-3 pr-4">Nombre y Specs</th>
                      <th className="pb-3 pr-4">Precio</th>
                      <th className="pb-3 pr-4">Stock</th>
                      <th className="pb-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {products.map((product) => {
                      const displayImg = (product.images && product.images.length > 0)
                        ? product.images[0]
                        : product.imageUrl;

                      return (
                        <tr key={product.id} className="hover:bg-[#153A8A]/20 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="relative inline-block">
                              <img
                                src={displayImg}
                                alt={product.name}
                                className="h-14 w-14 object-contain rounded-xl border border-white/10 bg-white p-1"
                              />
                              {product.images && product.images.length > 1 && (
                                <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-blue-900 flex items-center gap-0.5">
                                  <Layers className="h-2.5 w-2.5" />
                                  {product.images.length}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="font-bold text-white block text-sm">
                              {product.name}
                            </span>
                            {product.details ? (
                              <span className="text-slate-400 text-xs line-clamp-1 mt-0.5">
                                {product.details}
                              </span>
                            ) : (
                              <span className="text-amber-400/80 text-[11px] italic">
                                Sin especificaciones (clic en Editar para agregar)
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-4 font-bold text-amber-400 whitespace-nowrap">
                            ${product.price.toLocaleString('es-CO')}
                          </td>
                          <td className="py-4 pr-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                                product.stock > 0 ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-red-950/40 text-red-300 border border-red-800/40'
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock} un.` : 'Agotado'}
                            </span>
                          </td>
                          <td className="py-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleStartEdit(product)}
                                className="p-2 bg-amber-400/15 hover:bg-amber-400 border border-amber-400/30 hover:border-amber-400 text-amber-300 hover:text-[#011B3E] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                                title="Editar producto y especificaciones"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Editar</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-red-650/15 hover:bg-red-600 border border-red-900/30 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                                title="Eliminar producto"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN DE PRODUCTO Y ESPECIFICACIONES */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in"
          onClick={handleCancelEdit}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0B2256] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#011B3E]/80 hover:bg-red-600 text-white transition-colors cursor-pointer border border-white/10"
              title="Cerrar (Esc)"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Pencil className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">
                Editar Producto y Especificaciones
              </h2>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-semibold" htmlFor="edit-name">
                  Nombre del Producto *
                </label>
                <input
                  id="edit-name"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 text-xs font-semibold" htmlFor="edit-price">
                    Precio ($ COP) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <input
                      id="edit-price"
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 text-xs font-semibold" htmlFor="edit-stock">
                    Stock / Disponibles *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Package className="h-4 w-4" />
                    </span>
                    <input
                      id="edit-stock"
                      type="number"
                      required
                      min="0"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Especificaciones / Ficha Técnica en Modal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 text-xs font-semibold flex items-center gap-1.5" htmlFor="edit-details">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    Especificaciones Técnicas (Lo que sale al dar clic en la imagen o ver detalles)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditDetails(SPEC_TEMPLATE)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer underline"
                  >
                    <Sparkles className="h-3 w-3" /> Cargar plantilla
                  </button>
                </div>

                {/* Botones de sugerencias rápidas */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setEditDetails, '• Capacidad: 16 Litros/minuto')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Capacidad
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setEditDetails, '• Tipo de tiro: Tiro Natural')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Tiro Natural
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setEditDetails, '• Tipo de gas: Gas Natural')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Gas Natural
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setEditDetails, '• Presión de agua: Apto para baja y alta presión')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Presión Agua
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSpecSnippet(setEditDetails, '• Garantía: 3 Años de garantía total de fábrica')}
                    className="text-[10px] bg-[#153A8A]/70 hover:bg-[#153A8A] text-slate-300 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                  >
                    + Garantía
                  </button>
                </div>

                <textarea
                  id="edit-details"
                  rows={6}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  placeholder="Escribe las especificaciones detalladas aquí..."
                  className="w-full px-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm font-sans"
                />
              </div>

              {/* Fotos actuales y selector opcional de nuevas fotos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 text-xs font-semibold">
                    Fotos del Producto {editImagePreviews.length > 0 && `(${editImagePreviews.length} actuales)`}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Opcional: Sube nuevas fotos si deseas reemplazarlas
                  </span>
                </div>

                {editImagePreviews.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {editImagePreviews.map((img, idx) => (
                      <div
                        key={idx}
                        className="h-16 w-16 shrink-0 rounded-xl bg-white p-1 border border-white/10 relative"
                      >
                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-contain" />
                        {idx === 0 && (
                          <span className="absolute top-0.5 left-0.5 bg-amber-500 text-[#011B3E] font-bold text-[8px] px-1 rounded">
                            Portada
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-center bg-[#153A8A]/20 hover:border-amber-400 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    ref={editFileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleEditImagesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-2 text-xs text-slate-300 pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-amber-400" />
                    <span>Seleccionar nuevas fotos para reemplazar las actuales</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#011B3E] font-extrabold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer text-sm shadow-md"
                >
                  {editSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
