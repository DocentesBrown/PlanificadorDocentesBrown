# Arquitectura elegida

## Objetivo
Mantener la interfaz simple de publicar en GitHub Pages, pero mover la generación premium al backend para no exponer la API key de OpenAI.

## Decisión tomada

### Frontend
- GitHub Pages
- HTML/CSS/JS sin build
- guardado local en `localStorage`
- exportación PDF en el navegador

### Backend
- Supabase Edge Function
- función pública con restricción por `ALLOWED_ORIGINS`
- llamada a OpenAI desde el backend

## Por qué esta arquitectura

### Lo que evita
- exponer la API key en el navegador
- depender de una biblioteca gigante de planificaciones cargadas a mano
- quedar atados a un motor local demasiado rígido

### Lo que permite
- generación de detalle premium
- cambios rápidos del prompt sin tocar mucho el frontend
- seguir usando GitHub Pages para publicar
- escalar luego a auth y guardado online

## Qué queda para una etapa 2
- cuentas con Supabase Auth
- guardado de planificaciones por usuario en tablas
- reintentos / historial / favoritos
- regeneración parcial por bloque
