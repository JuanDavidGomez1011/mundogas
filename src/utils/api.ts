/**
 * URL base de la API.
 * - En desarrollo local: usa el proxy de Vite (rutas relativas).
 * - En producción (Hostinger u otro hosting estático): apunta al backend de Render.
 *
 * Para cambiar la URL del backend de producción, modifica VITE_API_URL en el archivo .env:
 *   VITE_API_URL=https://mundogas.onrender.com
 */
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://mundogas.onrender.com');

export function apiUrl(path: string): string {
  // Asegurarse de que el path empiece con '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
