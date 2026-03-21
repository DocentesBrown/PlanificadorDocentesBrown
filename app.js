const CONFIG = window.PDB_CONFIG || {};

const views = {
  home: document.getElementById('home-view'),
  loading: document.getElementById('loading-view'),
  result: document.getElementById('result-view'),
  library: document.getElementById('library-view')
};

const form = document.getElementById('planning-form');
const resultContent = document.getElementById('result-content');
const metaSummary = document.getElementById('meta-summary');
const libraryList = document.getElementById('library-list');
const toast = document.getElementById('toast');
const generationStatus = document.getElementById('generation-status');

const loadingMessages = [
  'Traduciendo el pedido a una secuencia concreta y usable.',
  'Bajando la planificación a preguntas, ejemplos y registros reales.',
  'Ajustando la propuesta al nivel, al grupo y a los recursos marcados.',
  'Preparando una salida lista para usar, editar o exportar.'
];

let loadingInterval = null;
let currentPlan = null;
let currentPayload = null;
let currentSource = 'pendiente';

window.openSavedPlan = openSavedPlan;
window.deleteSavedPlan = deleteSavedPlan;

bindEvents();
renderLibrary();
syncClassCountBehavior();
handleCurriculumVisibility();
handleDurationVisibility();

function bindEvents() {
  document.querySelectorAll('[data-view-target]').forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.viewTarget));
  });

  document.getElementById('open-library-btn').addEventListener('click', () => showView('library-view'));
  document.getElementById('quick-class-btn').addEventListener('click', applyQuickClass);
  document.getElementById('quick-sequence-btn').addEventListener('click', applyQuickSequence);
  document.getElementById('toggle-advanced-btn').addEventListener('click', () => {
    document.getElementById('advanced-options').classList.toggle('hidden');
  });
  document.getElementById('alineacionTipo').addEventListener('change', handleCurriculumVisibility);
  document.getElementById('duracion').addEventListener('change', handleDurationVisibility);
  document.getElementById('reset-form-btn').addEventListener('click', resetForm);
  document.getElementById('back-to-form-btn').addEventListener('click', () => showView('home-view'));
  document.getElementById('save-plan-btn').addEventListener('click', saveCurrentPlan);
  document.getElementById('copy-plan-btn').addEventListener('click', copyCurrentPlan);
  document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);

  document.querySelectorAll('input[name="tipoPlanificacion"]').forEach((radio) => {
    radio.addEventListener('change', syncClassCountBehavior);
  });

  form.addEventListener('submit', onSubmitForm);
}

function showView(viewId) {
  Object.values(views).forEach((view) => view.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.viewTarget === viewId);
  });

  if (viewId === 'library-view') renderLibrary();
}

function applyQuickClass() {
  setPlanningType('clase-unica');
  document.getElementById('cantidadClases').value = 1;
  document.getElementById('formato').value = 'completo';
  document.getElementById('nivelDetalle').value = 'premium';
  document.getElementById('modoIA').value = 'ia';
  showToast('Modo clase única premium listo.');
}

function applyQuickSequence() {
  setPlanningType('secuencia-breve');
  document.getElementById('cantidadClases').value = 3;
  document.getElementById('formato').value = 'completo';
  document.getElementById('nivelDetalle').value = 'premium';
  document.getElementById('modoIA').value = 'ia';
  showToast('Modo secuencia breve listo.');
}

function setPlanningType(value) {
  const radio = document.querySelector(`input[name="tipoPlanificacion"][value="${value}"]`);
  if (radio) radio.checked = true;
  syncClassCountBehavior();
}

function syncClassCountBehavior() {
  const type = document.querySelector('input[name="tipoPlanificacion"]:checked')?.value || 'clase-unica';
  const countInput = document.getElementById('cantidadClases');

  if (type === 'clase-unica') {
    countInput.value = 1;
    countInput.setAttribute('readonly', 'readonly');
  } else {
    countInput.removeAttribute('readonly');
    if (Number(countInput.value) < 2) {
      countInput.value = type === 'secuencia-breve' ? 3 : 5;
    }
  }
}

function handleCurriculumVisibility() {
  const type = document.getElementById('alineacionTipo').value;
  document.getElementById('curriculum-text-wrap').classList.toggle('hidden', type !== 'texto');
  document.getElementById('curriculum-keywords-wrap').classList.toggle('hidden', type !== 'claves');
}

function handleDurationVisibility() {
  document.getElementById('custom-duration-wrap').classList.toggle(
    'hidden',
    document.getElementById('duracion').value !== 'otro'
  );
}

function resetForm() {
  form.reset();
  setPlanningType('clase-unica');
  document.getElementById('duracion').value = '80 min';
  document.getElementById('formato').value = 'completo';
  document.getElementById('nivelDetalle').value = 'premium';
  document.getElementById('estilo').value = 'practico-realista';
  document.getElementById('grupo').value = 'heterogeneo';
  document.getElementById('salida').value = 'usable-en-clase';
  document.getElementById('modoIA').value = 'ia';
  clearValidation();
  handleCurriculumVisibility();
  handleDurationVisibility();
}

function clearValidation() {
  document.querySelectorAll('.error-message').forEach((el) => { el.textContent = ''; });
  document.querySelectorAll('input, select, textarea').forEach((el) => { el.style.borderColor = ''; });
}

function validateForm() {
  clearValidation();
  let isValid = true;
  const requiredIds = ['nivel', 'materia', 'curso', 'tema', 'duracion', 'formato', 'cantidadClases'];

  requiredIds.forEach((id) => {
    const el = document.getElementById(id);
    const value = String(el.value || '').trim();
    if (!value) {
      isValid = false;
      el.style.borderColor = '#b85c5c';
      const error = el.closest('.field')?.querySelector('.error-message');
      if (error) error.textContent = 'Completá este campo.';
    }
  });

  if (document.getElementById('duracion').value === 'otro') {
    const custom = document.getElementById('duracionCustom');
    if (!String(custom.value || '').trim()) {
      isValid = false;
      custom.style.borderColor = '#b85c5c';
    }
  }

  return isValid;
}

function getPayload() {
  const tipoPlanificacion = document.querySelector('input[name="tipoPlanificacion"]:checked')?.value || 'clase-unica';
  const recursos = [...document.querySelectorAll('input[name="recursos"]:checked')].map((el) => el.value);
  const alineacionTipo = document.getElementById('alineacionTipo').value;
  const customDuration = document.getElementById('duracionCustom').value.trim();
  const durationValue = document.getElementById('duracion').value === 'otro' ? customDuration : document.getElementById('duracion').value;

  return {
    nivel: document.getElementById('nivel').value,
    materia: document.getElementById('materia').value.trim(),
    curso: document.getElementById('curso').value.trim(),
    tema: document.getElementById('tema').value.trim(),
    tipoPlanificacion,
    cantidadClases: Number(document.getElementById('cantidadClases').value || 1),
    duracion: durationValue,
    formato: document.getElementById('formato').value,
    nivelDetalle: document.getElementById('nivelDetalle').value,
    estilo: document.getElementById('estilo').value,
    grupo: document.getElementById('grupo').value,
    salida: document.getElementById('salida').value,
    modoIA: document.getElementById('modoIA').value,
    recursos,
    imprescindibles: document.getElementById('imprescindibles').value.trim(),
    observaciones: document.getElementById('observaciones').value.trim(),
    alineacionCurricular: {
      tipo: alineacionTipo,
      texto: alineacionTipo === 'texto' ? document.getElementById('alineacionTexto').value.trim() : '',
      keywords: alineacionTipo === 'claves'
        ? document.getElementById('alineacionKeywords').value.split(',').map((k) => k.trim()).filter(Boolean)
        : [],
      estricta: document.getElementById('alineacionEstricta').checked
    }
  };
}

async function onSubmitForm(event) {
  event.preventDefault();
  if (!validateForm()) return;

  currentPayload = getPayload();
  startLoading();

  try {
    const result = await generatePlan(currentPayload);
    currentPlan = result.plan;
    currentSource = result.source;
    renderPlan(currentPlan, currentPayload, currentSource);
    stopLoading();
    showView('result-view');
  } catch (error) {
    stopLoading();
    console.error(error);
    showToast('Hubo un problema al generar la planificación.');
  }
}

async function generatePlan(payload) {
  if (payload.modoIA === 'fallback-local') {
    return {
      plan: ensurePlanShape(window.generateFallbackPlan(payload), payload),
      source: 'fallback-local'
    };
  }

  const functionUrl = String(CONFIG.FUNCTION_URL || '').trim();
  if (!functionUrl || functionUrl.includes('TU-PROJECT-REF')) {
    showToast('No hay endpoint configurado. Genero con el motor local de respaldo.');
    return {
      plan: ensurePlanShape(window.generateFallbackPlan(payload), payload),
      source: 'fallback-local'
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(CONFIG.REQUEST_TIMEOUT_MS || 90000));

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al llamar a la función');
    }

    const data = await response.json();
    return {
      plan: ensurePlanShape(data.plan, payload),
      source: data.source || 'supabase-openai'
    };
  } catch (error) {
    console.warn('Fallo la IA, activo fallback local.', error);
    showToast('La IA no respondió. Genero con el motor local de respaldo.');
    return {
      plan: ensurePlanShape(window.generateFallbackPlan(payload), payload),
      source: 'fallback-local'
    };
  }
}

function ensurePlanShape(plan, payload) {
  const basePlan = plan || {};
  const classes = Array.isArray(basePlan.clases) ? basePlan.clases : [];

  return {
    titulo: basePlan.titulo || `Planificación sobre ${payload.tema}`,
    proposito: basePlan.proposito || 'Sin propósito generado.',
    objetivos: Array.isArray(basePlan.objetivos) ? basePlan.objetivos : [],
    contenidos: Array.isArray(basePlan.contenidos) ? basePlan.contenidos : [],
    clases: classes.map((clase, index) => ({
      numero: clase.numero || index + 1,
      titulo: clase.titulo || `Clase ${index + 1}`,
      momentos: Array.isArray(clase.momentos)
        ? clase.momentos.map((momento) => ({
            nombre: momento.nombre || 'Momento',
            tiempo: momento.tiempo || '',
            objetivo: momento.objetivo || '',
            docente: momento.docente || '',
            estudiantes: momento.estudiantes || '',
            consigna: momento.consigna || '',
            ejemplos: Array.isArray(momento.ejemplos) ? momento.ejemplos : [],
            observar: Array.isArray(momento.observar) ? momento.observar : [],
            registro: momento.registro || '',
            respuestasEsperables: Array.isArray(momento.respuestasEsperables) ? momento.respuestasEsperables : [],
            intervencionDocente: momento.intervencionDocente || ''
          }))
        : []
    })),
    evaluacion: Array.isArray(basePlan.evaluacion) ? basePlan.evaluacion : [],
    observaciones: basePlan.observaciones || '',
    meta: {
      nivel: payload.nivel,
      materia: payload.materia,
      curso: payload.curso,
      tipoPlanificacion: payload.tipoPlanificacion,
      cantidadClases: payload.cantidadClases,
      duracion: payload.duracion,
      formato: payload.formato,
      nivelDetalle: payload.nivelDetalle,
      tema: payload.tema,
      basadaEnCurriculo: payload.alineacionCurricular?.tipo && payload.alineacionCurricular.tipo !== 'none'
    }
  };
}

function renderPlan(plan, payload, source) {
  generationStatus.innerHTML = `
    <p><strong>Modo:</strong> ${payload.modoIA === 'ia' ? 'IA premium' : 'Motor local'}</p>
    <p><strong>Fuente:</strong> ${humanizeSource(source)}</p>
    <p><strong>Detalle:</strong> ${humanizeLabel(payload.nivelDetalle)}</p>
  `;

  const metaChips = [
    payload.nivel,
    payload.materia,
    payload.curso,
    humanizePlanType(payload.tipoPlanificacion),
    payload.duracion,
    payload.formato,
    payload.nivelDetalle,
    payload.alineacionCurricular?.tipo !== 'none' ? 'Con alineación curricular' : ''
  ].filter(Boolean).map((item) => `<span class="meta-chip">${humanizeLabel(item)}</span>`).join('');

  const objectivesHtml = (plan.objetivos || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const contentsHtml = (plan.contenidos || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const evaluationHtml = (plan.evaluacion || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const classesHtml = (plan.clases || []).map(renderClassCard).join('');

  resultContent.innerHTML = `
    <h2 class="result-title">${escapeHtml(plan.titulo)}</h2>
    <div class="result-meta">${metaChips}</div>

    <div class="result-stack" id="pdf-export-area">
      <article class="result-block">
        <h3>Propósito</h3>
        <p>${escapeHtml(plan.proposito)}</p>
      </article>

      <article class="result-block">
        <h3>Objetivos</h3>
        <ul>${objectivesHtml}</ul>
      </article>

      <article class="result-block">
        <h3>Contenidos</h3>
        <ul>${contentsHtml}</ul>
      </article>

      <article class="result-block">
        <h3>${plan.clases.length === 1 ? 'Clase detallada' : 'Secuencia detallada'}</h3>
        ${classesHtml}
      </article>

      <article class="result-block">
        <h3>Criterios de evaluación</h3>
        <ul>${evaluationHtml}</ul>
      </article>

      <article class="result-block">
        <h3>Observaciones docentes</h3>
        <p>${escapeHtml(plan.observaciones || 'Sin observaciones automáticas.')}</p>
      </article>
    </div>
  `;

  metaSummary.innerHTML = `
    <p><strong>Nivel:</strong> ${humanizeLabel(payload.nivel)}</p>
    <p><strong>Materia:</strong> ${escapeHtml(payload.materia)}</p>
    <p><strong>Curso:</strong> ${escapeHtml(payload.curso)}</p>
    <p><strong>Tema:</strong> ${escapeHtml(payload.tema)}</p>
    <p><strong>Tipo:</strong> ${humanizePlanType(payload.tipoPlanificacion)}</p>
    <p><strong>Duración:</strong> ${escapeHtml(payload.duracion)}</p>
    <p><strong>Formato:</strong> ${humanizeLabel(payload.formato)}</p>
    <p><strong>Detalle:</strong> ${humanizeLabel(payload.nivelDetalle)}</p>
  `;
}

function renderClassCard(clase) {
  const momentsHtml = (clase.momentos || []).map((momento) => `
    <article class="moment-card">
      <div class="moment-meta">
        <span class="moment-chip">${escapeHtml(momento.nombre || 'Momento')}</span>
        ${momento.tiempo ? `<span class="moment-chip">${escapeHtml(momento.tiempo)}</span>` : ''}
      </div>
      <div class="moment-grid">
        ${renderMomentPanel('Objetivo del momento', momento.objetivo)}
        ${renderMomentPanel('Qué hace el docente', momento.docente)}
        ${renderMomentPanel('Qué hacen los estudiantes', momento.estudiantes)}
        ${renderMomentPanel('Consigna textual', momento.consigna)}
        ${renderMomentPanel('Ejemplos concretos', momento.ejemplos, true)}
        ${renderMomentPanel('Qué observar', momento.observar, true)}
        ${renderMomentPanel('Cómo registrar', momento.registro)}
        ${renderMomentPanel('Respuestas esperables', momento.respuestasEsperables, true)}
        ${renderMomentPanel('Intervención docente sugerida', momento.intervencionDocente)}
      </div>
    </article>
  `).join('');

  return `
    <article class="class-card">
      <div class="class-head">
        <h3>${escapeHtml(clase.titulo)}</h3>
        <span class="class-number">${escapeHtml(String(clase.numero || ''))}</span>
      </div>
      ${momentsHtml}
    </article>
  `;
}

function renderMomentPanel(title, value, isList = false) {
  const content = isList
    ? renderList(value)
    : `<p>${escapeHtml(value || '—')}</p>`;

  return `
    <div class="moment-panel">
      <strong>${escapeHtml(title)}</strong>
      ${content}
    </div>
  `;
}

function renderList(items) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!safeItems.length) return '<p>—</p>';
  return `<ul>${safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function saveCurrentPlan() {
  if (!currentPlan || !currentPayload) return;

  const saved = getSavedPlans();
  const id = self.crypto?.randomUUID ? self.crypto.randomUUID() : `plan-${Date.now()}`;
  saved.unshift({
    id,
    createdAt: new Date().toISOString(),
    payload: currentPayload,
    plan: currentPlan,
    source: currentSource
  });

  localStorage.setItem('pdb_ia_plans', JSON.stringify(saved));
  renderLibrary();
  showToast('Planificación guardada.');
}

function getSavedPlans() {
  try {
    return JSON.parse(localStorage.getItem('pdb_ia_plans')) || [];
  } catch {
    return [];
  }
}

function renderLibrary() {
  const plans = getSavedPlans();
  if (!plans.length) {
    libraryList.innerHTML = `
      <article class="library-item">
        <h3>Todavía no guardaste planificaciones</h3>
        <p>Generá una con la IA y guardala para retomarla después desde acá.</p>
      </article>
    `;
    return;
  }

  libraryList.innerHTML = plans.map((item) => `
    <article class="library-item">
      <h3>${escapeHtml(item.plan.titulo)}</h3>
      <p>${escapeHtml(item.payload.materia)} · ${escapeHtml(item.payload.curso)} · ${humanizeLabel(item.payload.nivel)}</p>
      <div class="library-actions">
        <button class="btn btn-secondary" type="button" onclick="openSavedPlan('${item.id}')">Abrir</button>
        <button class="btn btn-secondary" type="button" onclick="deleteSavedPlan('${item.id}')">Eliminar</button>
      </div>
    </article>
  `).join('');
}

function openSavedPlan(id) {
  const item = getSavedPlans().find((plan) => plan.id === id);
  if (!item) return;
  currentPayload = item.payload;
  currentPlan = item.plan;
  currentSource = item.source || 'guardada-local';
  renderPlan(currentPlan, currentPayload, currentSource);
  showView('result-view');
}

function deleteSavedPlan(id) {
  const filtered = getSavedPlans().filter((item) => item.id !== id);
  localStorage.setItem('pdb_ia_plans', JSON.stringify(filtered));
  renderLibrary();
  showToast('Planificación eliminada.');
}

async function copyCurrentPlan() {
  if (!currentPlan) return;
  const text = serializePlan(currentPlan, currentPayload);
  await navigator.clipboard.writeText(text);
  showToast('Planificación copiada.');
}

function serializePlan(plan, payload) {
  const classesText = (plan.clases || []).map((clase) => {
    const momentsText = (clase.momentos || []).map((momento) => `
${momento.nombre.toUpperCase()} (${momento.tiempo || 'sin tiempo'})
- Objetivo: ${momento.objetivo}
- Docente: ${momento.docente}
- Estudiantes: ${momento.estudiantes}
- Consigna: ${momento.consigna}
- Ejemplos: ${(momento.ejemplos || []).join('; ')}
- Observar: ${(momento.observar || []).join('; ')}
- Registro: ${momento.registro}
- Respuestas esperables: ${(momento.respuestasEsperables || []).join('; ')}
- Intervención docente: ${momento.intervencionDocente}`.trim()).join('\n\n');

    return `${clase.titulo}\n${momentsText}`;
  }).join('\n\n');

  return `
${plan.titulo}

Nivel: ${payload.nivel}
Materia: ${payload.materia}
Curso: ${payload.curso}
Tipo: ${humanizePlanType(payload.tipoPlanificacion)}
Duración: ${payload.duracion}
Formato: ${payload.formato}
Detalle: ${payload.nivelDetalle}

PROPÓSITO
${plan.proposito}

OBJETIVOS
- ${(plan.objetivos || []).join('\n- ')}

CONTENIDOS
- ${(plan.contenidos || []).join('\n- ')}

CLASES
${classesText}

EVALUACIÓN
- ${(plan.evaluacion || []).join('\n- ')}

OBSERVACIONES
${plan.observaciones || 'Sin observaciones'}
  `.trim();
}

function exportPDF() {
  if (!currentPlan) return;
  const area = document.getElementById('pdf-export-area');
  const filenameBase = String(CONFIG.PDF_FILENAME_PREFIX || 'planificacion-docentes-brown');
  const topicSlug = slugify(currentPayload?.tema || 'plan');

  html2pdf()
    .set({
      margin: [12, 10, 12, 10],
      filename: `${filenameBase}-${topicSlug}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    })
    .from(area)
    .save();
}

function startLoading() {
  showView('loading-view');
  const loadingText = document.getElementById('loading-text');
  let idx = 0;
  loadingText.textContent = loadingMessages[0];
  loadingInterval = setInterval(() => {
    idx = (idx + 1) % loadingMessages.length;
    loadingText.textContent = loadingMessages[idx];
  }, 500);
}

function stopLoading() {
  clearInterval(loadingInterval);
}

function humanizePlanType(value) {
  const map = {
    'clase-unica': 'Clase única',
    'secuencia-breve': 'Secuencia breve',
    'secuencia-completa': 'Secuencia completa'
  };
  return map[value] || value;
}

function humanizeSource(source) {
  const map = {
    'supabase-openai': 'Supabase + IA',
    'fallback-local': 'Motor local de respaldo',
    'guardada-local': 'Planificación guardada localmente'
  };
  return map[source] || source;
}

function humanizeLabel(value) {
  const map = {
    premium: 'Premium',
    'premium-plus': 'Premium Plus',
    desarrollado: 'Desarrollado',
    secundaria: 'Secundaria',
    primaria: 'Primaria',
    inicial: 'Inicial',
    superior: 'Superior',
    otros: 'Otros',
    completo: 'Completo',
    breve: 'Breve',
    'practico-realista': 'Práctico y docente real',
    'formal-institucional': 'Formal institucional',
    'clase-observada': 'Clase observada',
    'usable-en-clase': 'Usable en clase',
    'lista-para-inspeccion': 'Lista para inspección',
    mixta: 'Mixta'
  };
  return map[value] || value;
}

function slugify(value) {
  return String(value || 'plan')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function escapeHtml(value) {
  return String(value ?? '—')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('\n', '<br>');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.add('hidden'), 2400);
}
