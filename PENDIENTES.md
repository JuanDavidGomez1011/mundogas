# 📋 Pendientes — landing-mundogas

## 🔍 SEO — Logo en resultados de Google

**Contexto:** El logo no aparecía en los resultados de búsqueda de Google porque el favicon estaba configurado con un emoji SVG inline (`🔥`) en lugar del `logo.png` real.

**Cambios ya aplicados en el código:**
- `index.html` → favicon actualizado a `/logo.png`
- `index.html` → `og:image` apunta a `https://mundogasmanizales.com/logo.png`
- Build de producción (`dist/`) generado y listo

**Pasos pendientes por hacer:**

- [ ] Subir el `dist/` actualizado al servidor en Hostinger
- [ ] Verificar que `https://mundogasmanizales.com/logo.png` sea accesible en el navegador
- [ ] Solicitar re-indexación en [Google Search Console](https://search.google.com/search-console):
  1. Ir a **Inspección de URL**
  2. Pegar `https://mundogasmanizales.com/`
  3. Clic en **"Solicitar indexación"**
- [ ] Esperar 2–7 días para que Google actualice el favicon en los resultados

> **Nota:** El `logo.png` debe ser cuadrado (1:1) para que Google lo muestre correctamente.
