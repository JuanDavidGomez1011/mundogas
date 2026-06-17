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
  Loader
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  details: string;
  imageUrl: string;
}

export const AdminPage: React.FC = () => {
  const { token, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [details, setDetails] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      const response = await fetch('/api/products');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !imageFile) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    setMessage(null);
    setFormSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('details', details);
    formData.append('image', imageFile);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar el producto');
      }

      setMessage({ type: 'success', text: '¡Producto agregado correctamente!' });
      // Reset form
      setName('');
      setPrice('');
      setStock('');
      setDetails('');
      setImageFile(null);
      setImagePreview(null);
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
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
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

              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-semibold">
                  Imagen del Producto *
                </label>
                <div className="border-2 border-dashed border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center bg-[#153A8A]/20 hover:border-amber-400 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    required
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="w-full flex flex-col items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="h-28 object-cover rounded-xl"
                      />
                      <span className="text-xs text-slate-400 truncate max-w-full">
                        {imageFile?.name}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <ImageIcon className="mx-auto h-8 w-8 text-slate-400 group-hover:text-amber-400 transition-colors" />
                      <p className="text-xs font-semibold text-slate-300">Sube una imagen aquí</p>
                      <p className="text-[10px] text-slate-500">Soporta PNG, JPG, WEBP de hasta 5MB</p>
                    </div>
                  )}
                </div>
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
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-xl border border-white/10 bg-[#153A8A]/30"
                          />
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
