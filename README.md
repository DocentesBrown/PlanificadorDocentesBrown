# Planificador Docentes Brown — GitHub Pages + Supabase + IA

Proyecto listo para publicar la interfaz en **GitHub Pages** y usar una **Supabase Edge Function** como backend seguro para generar planificaciones con IA sin exponer la clave de OpenAI en el frontend.

## Estructura

- `index.html`, `style.css`, `app.js`: frontend estático para GitHub Pages.
- `config.js`: archivo editable con la URL de la Edge Function.
- `fallback-generator.js`: motor local de respaldo si la IA falla o todavía no está configurada.
- `supabase/functions/generate-plan/index.ts`: función que llama a OpenAI.
- `docs/SETUP_PASO_A_PASO.md`: guía paso a paso de configuración.

## Idea de arquitectura

- **GitHub Pages**: sirve la app pública.
- **Supabase Edge Function**: recibe el formulario y llama a OpenAI.
- **OpenAI**: genera una planificación premium en JSON estructurado.
- **Frontend**: renderiza el JSON y permite copiar, guardar localmente y exportar PDF.

## Antes de publicar

1. Editá `config.js` con la URL real de tu función:
   - `https://TU-PROJECT-REF.supabase.co/functions/v1/generate-plan`
2. Desplegá la función en Supabase.
3. Cargá en Supabase los secretos:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `ALLOWED_ORIGINS`
4. Subí estos archivos al repo que va a ir a GitHub Pages.

## Recomendación de despliegue

Para simplificar, usá el repo así:

- raíz del repo: `index.html`, `style.css`, `app.js`, `config.js`, `fallback-generator.js`
- carpeta `supabase/`: solo para que tengas versionado el backend

GitHub Pages va a servir la app desde la raíz y la función quedará del lado de Supabase.
