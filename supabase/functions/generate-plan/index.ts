import { corsHeaders, resolveAllowedOrigin } from '../_shared/cors.ts';

type Payload = {
  nivel: string;
  materia: string;
  curso: string;
  tema: string;
  tipoPlanificacion: 'clase-unica' | 'secuencia-breve' | 'secuencia-completa';
  cantidadClases: number;
  duracion: string;
  formato: 'breve' | 'completo';
  nivelDetalle: 'desarrollado' | 'premium' | 'premium-plus';
  estilo: string;
  grupo: string;
  salida: string;
  modoIA: string;
  recursos: string[];
  imprescindibles?: string;
  observaciones?: string;
  alineacionCurricular?: {
    tipo: 'none' | 'texto' | 'claves';
    texto?: string;
    keywords?: string[];
    estricta?: boolean;
  };
};

type Moment = {
  nombre: string;
  tiempo: string;
  objetivo: string;
  docente: string;
  estudiantes: string;
  consigna: string;
  ejemplos: string[];
  observar: string[];
  registro: string;
  respuestasEsperables: string[];
  intervencionDocente: string;
};

type PlanClass = {
  numero: number;
  titulo: string;
  momentos: Moment[];
};

type Plan = {
  titulo: string;
  proposito: string;
  objetivos: string[];
  contenidos: string[];
  clases: PlanClass[];
  evaluacion: string[];
  observaciones: string;
};

Deno.serve(async (req) => {
  const headers = corsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ ok: true }), { headers, status: 200 });
  }

  const allowedOrigin = resolveAllowedOrigin(req);
  if (allowedOrigin === null) {
    return json({ error: 'Origen no permitido por ALLOWED_ORIGINS.' }, 403, headers);
  }

  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido.' }, 405, headers);
  }

  try {
    const payload = await req.json() as Payload;
    const validationError = validatePayload(payload);
    if (validationError) return json({ error: validationError }, 400, headers);

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4.1-mini';
    if (!apiKey) return json({ error: 'Falta configurar OPENAI_API_KEY en Supabase.' }, 500, headers);

    const prompt = buildSystemPrompt();
    const userMessage = buildUserMessage(payload);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const raw = await openAIResponse.text();
    if (!openAIResponse.ok) {
      return json({ error: 'La API de OpenAI devolvió un error.', detail: raw }, 502, headers);
    }

    const parsed = parseOpenAIResponse(raw);
    const normalizedPlan = normalizePlanShape(parsed, payload);

    return json({ ok: true, source: 'supabase-openai', plan: normalizedPlan }, 200, headers);
  } catch (error) {
    return json({ error: 'Error inesperado en la función.', detail: String(error) }, 500, headers);
  }
});

function validatePayload(payload: Payload) {
  const required = ['nivel', 'materia', 'curso', 'tema', 'tipoPlanificacion', 'duracion', 'formato', 'nivelDetalle'];
  for (const key of required) {
    if (!String((payload as Record<string, unknown>)[key] || '').trim()) {
      return `Falta el campo requerido: ${key}`;
    }
  }
  return '';
}

function buildSystemPrompt() {
  return `
Sos un planificador didáctico experto para docentes argentinos.

Tu tarea es generar PLANIFICACIONES MUY CONCRETAS, no estructuras generales.
La salida debe ser solamente JSON válido, sin markdown, sin comentarios, sin texto fuera del JSON.

Objetivo principal:
- Devolver una planificación detallada, realista y usable en aula.
- Evitar frases vacías como “hacer una pregunta disparadora” o “analizar ejemplos” sin especificar cuáles.
- Bajar la propuesta a acciones concretas del docente y de los estudiantes.

Reglas obligatorias:
1. Escribí en español rioplatense claro, profesional y docente real.
2. No inventes recursos que el usuario no marcó. Si dice “sin tecnología”, evitá tecnología.
3. Respetá duración, cantidad de clases, tipo de planificación, nivel, grupo y tono de salida.
4. Cada momento debe incluir:
   - nombre
   - tiempo
   - objetivo
   - docente
   - estudiantes
   - consigna
   - ejemplos (array)
   - observar (array)
   - registro
   - respuestasEsperables (array)
   - intervencionDocente
5. Si el tema admite ejemplos cotidianos, proponelos de forma concreta.
6. La planificación debe sentirse viable. No sobrecargues con 10 actividades por clase.
7. El cierre debe dejar evidencia clara de aprendizaje.
8. Si hay alineación curricular, respetala y, si es estricta, usá su vocabulario.
9. Si el usuario pide “premium” o “premium-plus”, la planificación debe incluir detalles realmente útiles: preguntas concretas, ejemplos precisos, tabla o modalidad de registro, errores frecuentes o respuestas esperables.
10. No pongas títulos genéricos. Hacé títulos específicos.

Formato JSON exacto esperado:
{
  "titulo": "",
  "proposito": "",
  "objetivos": [""],
  "contenidos": [""],
  "clases": [
    {
      "numero": 1,
      "titulo": "",
      "momentos": [
        {
          "nombre": "Inicio",
          "tiempo": "15 min",
          "objetivo": "",
          "docente": "",
          "estudiantes": "",
          "consigna": "",
          "ejemplos": [""],
          "observar": [""],
          "registro": "",
          "respuestasEsperables": [""],
          "intervencionDocente": ""
        }
      ]
    }
  ],
  "evaluacion": [""],
  "observaciones": ""
}

Cantidad de momentos recomendada por clase:
- Clase única: 3 momentos (Inicio, Desarrollo, Cierre)
- Secuencia breve: 3 momentos por clase, salvo que el tema pida 2 o 4
- Secuencia completa: mantené la propuesta razonable y progresiva

No devuelvas otra cosa que JSON válido.
`.trim();
}

function buildUserMessage(payload: Payload) {
  return JSON.stringify({
    instruccion: 'Generar una planificación premium, concreta y usable.',
    pedido: payload,
    recordatorio: 'Necesito detalle real: pregunta disparadora concreta, ejemplos concretos, qué observar, cómo registrar y respuestas esperables.'
  });
}

function parseOpenAIResponse(raw: string) {
  const parsedTop = JSON.parse(raw);
  const content = parsedTop?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('OpenAI no devolvió content en choices[0].message.content');
  }

  const cleaned = stripCodeFences(content);
  return JSON.parse(cleaned);
}

function stripCodeFences(text: string) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

function normalizePlanShape(plan: Partial<Plan>, payload: Payload): Plan {
  const classes = Array.isArray(plan.clases) ? plan.clases : [];

  return {
    titulo: safeText(plan.titulo, `Planificación sobre ${payload.tema}`),
    proposito: safeText(plan.proposito, `Se propone trabajar ${payload.tema} mediante una secuencia concreta y usable.`),
    objetivos: safeArray(plan.objetivos),
    contenidos: safeArray(plan.contenidos),
    clases: classes.map((clase, index) => ({
      numero: Number(clase?.numero || index + 1),
      titulo: safeText(clase?.titulo, `Clase ${index + 1}`),
      momentos: Array.isArray(clase?.momentos)
        ? clase.momentos.map((momento) => ({
            nombre: safeText(momento?.nombre, 'Momento'),
            tiempo: safeText(momento?.tiempo, ''),
            objetivo: safeText(momento?.objetivo, ''),
            docente: safeText(momento?.docente, ''),
            estudiantes: safeText(momento?.estudiantes, ''),
            consigna: safeText(momento?.consigna, ''),
            ejemplos: safeArray(momento?.ejemplos),
            observar: safeArray(momento?.observar),
            registro: safeText(momento?.registro, ''),
            respuestasEsperables: safeArray(momento?.respuestasEsperables),
            intervencionDocente: safeText(momento?.intervencionDocente, '')
          }))
        : []
    })),
    evaluacion: safeArray(plan.evaluacion),
    observaciones: safeText(plan.observaciones, '')
  };
}

function safeText(value: unknown, fallback = '') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function safeArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item ?? '').trim()).filter(Boolean)
    : [];
}

function json(body: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers });
}
