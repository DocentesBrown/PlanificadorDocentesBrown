# Paso a paso — GitHub Pages + Supabase + IA

## 1) Crear o elegir el proyecto en Supabase

Usá un proyecto ya existente o creá uno nuevo.

No hace falta crear tablas para la versión inicial. La app guarda planificaciones en `localStorage` y Supabase se usa como backend seguro para la IA.

---

## 2) Instalar Supabase CLI

Si no la tenés instalada, instalala desde la forma que uses normalmente.

Después, en la carpeta del proyecto:

```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
```

---

## 3) Crear y desplegar la Edge Function

Este proyecto ya trae el código de la función en:

- `supabase/functions/generate-plan/index.ts`
- `supabase/functions/_shared/cors.ts`

Desplegala así:

```bash
supabase functions deploy generate-plan
```

---

## 4) Cargar los secretos en Supabase

Cargá estos secrets:

```bash
supabase secrets set OPENAI_API_KEY=tu_api_key_real
supabase secrets set OPENAI_MODEL=tu_modelo_disponible
supabase secrets set ALLOWED_ORIGINS=https://TU_USUARIO.github.io,http://127.0.0.1:5500,http://localhost:5500
```

### Qué poner en `OPENAI_MODEL`

Usá un modelo que exista en tu cuenta y te resulte económico para texto estructurado. Yo arrancaría con un modelo “mini” o económico disponible en tu cuenta.

### Qué poner en `ALLOWED_ORIGINS`

Poné:
- tu URL real de GitHub Pages
- y opcionalmente las URLs de desarrollo local

Ejemplo:

```text
https://docentesbrown.github.io,http://127.0.0.1:5500,http://localhost:5500
```

---

## 5) Probar la función

Podés probar con curl o desde la propia app local.

Ejemplo mínimo:

```bash
curl -X POST "https://TU_PROJECT_REF.supabase.co/functions/v1/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{
    "nivel":"secundaria",
    "materia":"Física",
    "curso":"3° año",
    "tema":"1ra Ley de Newton",
    "tipoPlanificacion":"clase-unica",
    "cantidadClases":1,
    "duracion":"80 min",
    "formato":"completo",
    "nivelDetalle":"premium",
    "estilo":"practico-realista",
    "grupo":"heterogeneo",
    "salida":"usable-en-clase",
    "modoIA":"ia",
    "recursos":["pizarron"],
    "imprescindibles":"pregunta disparadora concreta, tabla de registro, intervención docente",
    "observaciones":"grupo heterogéneo",
    "alineacionCurricular":{"tipo":"none","texto":"","keywords":[],"estricta":false}
  }'
```

---

## 6) Configurar el frontend

Editá `config.js` y reemplazá la URL de ejemplo:

```js
window.PDB_CONFIG = {
  APP_NAME: "Planificador Docentes Brown",
  FUNCTION_URL: "https://TU-PROJECT-REF.supabase.co/functions/v1/generate-plan",
  REQUEST_TIMEOUT_MS: 90000,
  PDF_FILENAME_PREFIX: "planificacion-docentes-brown"
};
```

No pongas ninguna API key en el frontend.

---

## 7) Publicar en GitHub Pages

Subí estos archivos a tu repo.

Después:

1. Entrá al repo en GitHub.
2. Abrí **Settings**.
3. Buscá **Pages**.
4. En **Build and deployment**, elegí:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (o la que uses)
   - **Folder**: `/root`
5. Guardá.

GitHub te va a dar una URL del tipo:

```text
https://TU_USUARIO.github.io/TU_REPO/
```

Esa URL tiene que estar también en `ALLOWED_ORIGINS` si querés restringir orígenes.

---

## 8) Desarrollo local rápido

Podés abrir la carpeta con Live Server o un servidor local simple.

Ejemplo con Python:

```bash
python -m http.server 5500
```

Y abrir:

```text
http://127.0.0.1:5500
```

Si `config.js` ya apunta a la función desplegada y `ALLOWED_ORIGINS` incluye esa URL local, ya podés probar todo.

---

## 9) Qué hace la app aunque la IA falle

Si la función no responde o todavía no está configurada, la app usa `fallback-generator.js`.

Eso te permite:
- seguir probando el flujo
- mostrar algo funcional
- no quedarte con la interfaz rota

Pero la calidad premium real la da la Edge Function con IA.

---

## 10) Mi configuración recomendada

### Para arrancar simple
- Frontend en GitHub Pages
- Supabase Edge Function pública con `ALLOWED_ORIGINS`
- OpenAI configurado en secrets
- Guardado local en navegador

### Para una segunda etapa
- Auth con Supabase
- Guardado online de planificaciones por usuario
- Historial de versiones
- Regeneración parcial por bloque
- Banco de prompts por tipo de planificación

---

## 11) Problemas frecuentes

### La app genera con el fallback y no con IA
Revisá:
- `config.js`
- si la función está desplegada
- si `OPENAI_API_KEY` existe
- si `ALLOWED_ORIGINS` incluye tu dominio

### La función devuelve 403
Casi seguro el `Origin` no coincide con `ALLOWED_ORIGINS`.

### La función devuelve 502
Suele ser por error en la respuesta de OpenAI o en el modelo configurado.

### El frontend funciona pero la IA tarda mucho
Podés:
- usar un modelo más económico/rápido
- bajar el detalle cuando no necesites “premium-plus”

