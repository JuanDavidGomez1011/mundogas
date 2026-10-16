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
  Layers
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

export const AdminPage: React.FC = () => {
  const { token, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [details, setDetails] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Status states
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    // Permitir hasta 8 imágenes en total
    const combinedFiles = [...imageFiles, ...files].slice(0, 8);
    setImageFiles(combinedFiles);

    // Generar previews para todos
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

    // Reset input para permitir volver a seleccionar si se desea
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
    
    // Adjuntar todas las imágenes seleccionadas
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    // Retrocompatibilidad con single image
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
      // Reset form
      setName('');
      setPrice('');
      setStock('');
      setDetails('');
      setImageFiles([]);
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh list
      fetchProducts();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error de red o conexión.' });
    } finally {
      setFormSubmitting(false);
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
              <p className="text-slate-400 text-sm">Gestiona el catálogo de productos de Mundo Gas</p>
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
          {/* Form Create Product (4 col) */}
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
                  placeholder="Ej. Calentador Bosch 10L Paso"
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
                      placeholder="950000"
                      className="w-full pl-9 pr-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 text-xs font-semibold" htmlFor="stock">
                    Stock / Cantidad *
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
                      placeholder="12"
                      className="w-full pl-9 pr-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-semibold" htmlFor="details">
                  Detalles / Especificaciones (Opcional)
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3.5 text-slate-400">
                    <FileText className="h-4 w-4" />
                  </span>
                  <textarea
                    id="details"
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Detalles de instalación, consumo de gas, garantía, etc..."
                    className="w-full pl-10 pr-4 py-3 bg-[#153A8A]/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 text-xs font-semibold">
                    Imágenes del Producto * {imagePreviews.length > 0 && `(${imagePreviews.length}/8)`}
                  </label>
                  <span className="text-[11px] text-amber-400 font-medium">
                    {imagePreviews.length === 0 ? 'Sube 1 o varias fotos' : 'La 1ª es la principal'}
                  </span>
                </div>

                {/* Subida o selector de archivos */}
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

                {/* Grilla de Miniaturas */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className={`relative group/thumb rounded-xl overflow-hidden border aspect-square bg-[#08152e] flex items-center justify-center ${
                          index === 0 ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-white/10'
                        }`}
                      >
                        <img
                          src={preview}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                        />

                        {/* Badge Principal */}
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-[#011B3E] font-bold text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                            <Star className="h-2.5 w-2.5 fill-[#011B3E]" /> Portada
                          </span>
                        )}

                        {/* Botón Eliminar Foto */}
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

                        {/* Botón Hacer Principal si no lo es */}
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
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-[#011B3E] font-extrabold py-3.5 px-4 rounded-2xl transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                {formSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Guardando...
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

          {/* List Products (8 col) */}
          <div className="lg:col-span-7 bg-[#0D2A6B]/80 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Productos Registrados ({products.length})</h2>

            {loadingProducts ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader className="h-8 w-8 animate-spin text-amber-500 mb-2" />
                <span className="text-sm">Obteniendo productos...</span>
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
                      <th className="pb-3 pr-4">Nombre</th>
                      <th className="pb-3 pr-4">Precio</th>
                      <th className="pb-3 pr-4">Stock</th>
                      <th className="pb-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-[#153A8A]/20 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="relative inline-block">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-12 w-12 object-contain rounded-xl border border-white/10 bg-white p-0.5"
                            />
                            {product.images && product.images.length > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-blue-900 flex items-center gap-0.5">
                                <Layers className="h-2.5 w-2.5" />
                                {product.images.length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 pr-4 font-semibold text-white truncate max-w-[150px]">
                          {product.name}
                        </td>
                        <td className="py-4 pr-4 font-medium text-amber-400">
                          ${product.price.toLocaleString('es-CO')}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                              product.stock > 0 ? 'bg-emerald-950/40 text-emerald-300' : 'bg-red-950/40 text-red-300'
                            }`}
                          >
                            {product.stock} unidades
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-red-650/10 hover:bg-red-600 border border-red-900/30 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
