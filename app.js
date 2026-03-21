const views = {
  home: document.getElementById("home-view"),
  loading: document.getElementById("loading-view"),
  result: document.getElementById("result-view"),
  library: document.getElementById("library-view"),
};

const form = document.getElementById("planning-form");
const resultContent = document.getElementById("result-content");
const metaSummary = document.getElementById("meta-summary");
const libraryList = document.getElementById("library-list");
const toast = document.getElementById("toast");

const loadingMessages = [
  "Organizando objetivos y contenidos.",
  "Ajustando actividades al contexto del grupo.",
  "Preparando una propuesta lista para editar.",
  "Vinculando la base curricular cargada."
];

let loadingInterval = null;
let currentPlan = null;
let currentFormData = null;

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderLibrary();
  syncClassCountBehavior();
});

function bindEvents() {
  document.querySelectorAll("[data-view-target]").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.viewTarget));
  });

  document.getElementById("open-library-btn").addEventListener("click", () => showView("library-view"));

  document.getElementById("quick-class-btn").addEventListener("click", () => {
    setPlanningType("clase-unica");
    document.getElementById("formato").value = "breve";
    document.getElementById("cantidadClases").value = 1;
    showToast("Modo clase rápida listo.");
  });

  document.getElementById("quick-sequence-btn").addEventListener("click", () => {
    setPlanningType("secuencia-breve");
    document.getElementById("formato").value = "completo";
    document.getElementById("cantidadClases").value = 3;
    showToast("Modo secuencia breve listo.");
  });

  document.getElementById("toggle-advanced-btn").addEventListener("click", () => {
    document.getElementById("advanced-options").classList.toggle("hidden");
  });

  document.getElementById("alineacionTipo").addEventListener("change", handleCurriculumVisibility);
  document.getElementById("duracion").addEventListener("change", handleDurationVisibility);
  document.querySelectorAll('input[name="tipoPlanificacion"]').forEach(radio => {
    radio.addEventListener("change", syncClassCountBehavior);
  });

  document.getElementById("reset-form-btn").addEventListener("click", () => {
    form.reset();
    setPlanningType("clase-unica");
    syncClassCountBehavior();
    handleCurriculumVisibility();
    handleDurationVisibility();
  });

  form.addEventListener("submit", onSubmitForm);

  document.getElementById("back-to-form-btn").addEventListener("click", () => {
    showView("home-view");
  });

  document.getElementById("copy-plan-btn").addEventListener("click", copyCurrentPlan);
  document.getElementById("save-plan-btn").addEventListener("click", saveCurrentPlan);

  document.querySelectorAll(".transform-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!currentPlan) return;
      currentPlan = transformPlan(currentPlan, btn.dataset.transform);
      renderPlan(currentPlan);
      showToast("Planificación ajustada.");
    });
  });
}

function showView(viewId) {
  Object.values(views).forEach(view => view.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.viewTarget === viewId);
  });

  if (viewId === "library-view") renderLibrary();
}

function onSubmitForm(event) {
  event.preventDefault();

  if (!validateForm()) return;

  currentFormData = getFormData();
  startLoading();

  setTimeout(() => {
    stopLoading();
    currentPlan = generatePlanning(currentFormData);
    renderPlan(currentPlan);
    showView("result-view");
  }, 1200);
}

function getFormData() {
  const tipoPlanificacion = document.querySelector('input[name="tipoPlanificacion"]:checked')?.value || "clase-unica";
  const recursos = [...document.querySelectorAll('input[name="recursos"]:checked')].map(el => el.value);

  const alineacionTipo = document.getElementById("alineacionTipo").value;
  const alineacionTexto = document.getElementById("alineacionTexto").value.trim();
  const alineacionKeywordsRaw = document.getElementById("alineacionKeywords").value.trim();

  return {
    nivel: document.getElementById("nivel").value,
    materia: document.getElementById("materia").value,
    curso: document.getElementById("curso").value,
    tema: document.getElementById("tema").value,
    tipoPlanificacion,
    cantidadClases: document.getElementById("cantidadClases").value,
    duracion: document.getElementById("duracion").value === "otro"
      ? document.getElementById("duracionCustom").value.trim() || "otro"
      : document.getElementById("duracion").value,
    formato: document.getElementById("formato").value,
    estilo: document.getElementById("estilo").value,
    grupo: document.getElementById("grupo").value,
    recursos,
    observaciones: document.getElementById("observaciones").value,
    alineacionCurricular: {
      tipo: alineacionTipo,
      texto: alineacionTipo === "texto" ? alineacionTexto : "",
      keywords: alineacionTipo === "claves"
        ? alineacionKeywordsRaw.split(",").map(k => k.trim()).filter(Boolean)
        : [],
      estricto: document.getElementById("alineacionEstricta").checked
    }
  };
}

function validateForm() {
  let isValid = true;

  const requiredFields = [
    { id: "nivel", message: "Completá este campo." },
    { id: "materia", message: "Completá este campo." },
    { id: "curso", message: "Completá este campo." },
    { id: "tema", message: "Completá este campo." },
    { id: "duracion", message: "Completá este campo." },
    { id: "formato", message: "Completá este campo." },
    { id: "cantidadClases", message: "Completá este campo." },
  ];

  requiredFields.forEach(({ id, message }) => {
    const field = document.getElementById(id);
    const wrap = field.closest(".field");
    const error = wrap?.querySelector(".error-message");

    if (!String(field.value).trim()) {
      isValid = false;
      if (error) error.textContent = message;
      field.style.borderColor = "#b85c5c";
    } else {
      if (error) error.textContent = "";
      field.style.borderColor = "";
    }
  });

  return isValid;
}

function renderPlan(plan) {
  const metaChips = `
    <div class="result-meta">
      <span class="meta-chip">${capitalizeMeta(plan.meta.nivel)}</span>
      <span class="meta-chip">${plan.meta.materia}</span>
      <span class="meta-chip">${plan.meta.curso}</span>
      <span class="meta-chip">${humanizeType(plan.meta.tipoPlanificacion)}</span>
      <span class="meta-chip">${plan.meta.duracion}</span>
      <span class="meta-chip">${capitalizeMeta(plan.meta.formato)}</span>
      ${plan.meta.basadaEnCurriculo ? '<span class="meta-chip">Basada en diseño curricular</span>' : ""}
    </div>
  `;

  const objectivesHtml = plan.objetivos.map(item => `<li>${item}</li>`).join("");
  const contentsHtml = plan.contenidos.map(item => `<li>${item}</li>`).join("");
  const resourcesHtml = plan.recursos.map(item => `<li>${item}</li>`).join("");
  const evaluationHtml = plan.evaluacion.map(item => `<li>${item}</li>`).join("");

  const classesHtml = plan.clases.map(clase => `
    <article class="class-card">
      <h4>${clase.titulo}</h4>
      <div class="class-section">
        <strong>Inicio</strong>
        <p>${clase.inicio}</p>
      </div>
      <div class="class-section">
        <strong>Desarrollo</strong>
        <p>${clase.desarrollo}</p>
      </div>
      <div class="class-section">
        <strong>Cierre</strong>
        <p>${clase.cierre}</p>
      </div>
    </article>
  `).join("");

  resultContent.innerHTML = `
    <h2 class="result-title">${plan.titulo}</h2>
    ${metaChips}

    <div class="plan-blocks">
      <article class="block-card">
        <h3>Propósito</h3>
        <p>${plan.proposito}</p>
      </article>

      <article class="block-card">
        <h3>Objetivos</h3>
        <ul>${objectivesHtml}</ul>
      </article>

      <article class="block-card">
        <h3>Contenidos</h3>
        <ul>${contentsHtml}</ul>
      </article>

      <article class="block-card">
        <h3>${plan.clases.length === 1 ? "Clase" : "Desarrollo por clases"}</h3>
        ${classesHtml}
      </article>

      <article class="block-card">
        <h3>Recursos</h3>
        <ul>${resourcesHtml}</ul>
      </article>

      <article class="block-card">
        <h3>Criterios de evaluación</h3>
        <ul>${evaluationHtml}</ul>
      </article>

      <article class="block-card">
        <h3>Observaciones docentes</h3>
        <p>${plan.observaciones || "Sin observaciones automáticas."}</p>
      </article>
    </div>
  `;

  metaSummary.innerHTML = `
    <p><strong>Nivel:</strong> ${capitalizeMeta(plan.meta.nivel)}</p>
    <p><strong>Materia:</strong> ${plan.meta.materia}</p>
    <p><strong>Curso:</strong> ${plan.meta.curso}</p>
    <p><strong>Tipo:</strong> ${humanizeType(plan.meta.tipoPlanificacion)}</p>
    <p><strong>Duración:</strong> ${plan.meta.duracion}</p>
    <p><strong>Formato:</strong> ${capitalizeMeta(plan.meta.formato)}</p>
  `;
}

function saveCurrentPlan() {
  if (!currentPlan || !currentFormData) return;

  const saved = getSavedPlans();
  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    formData: currentFormData,
    plan: currentPlan
  };

  saved.unshift(record);
  localStorage.setItem("pdb_plans", JSON.stringify(saved));
  showToast("Planificación guardada.");
  renderLibrary();
}

function renderLibrary() {
  const saved = getSavedPlans();

  if (!saved.length) {
    libraryList.innerHTML = `
      <div class="library-item">
        <h3>Todavía no guardaste planificaciones</h3>
        <p>Generá una nueva y vas a poder retomarla después desde acá.</p>
      </div>
    `;
    return;
  }

  libraryList.innerHTML = saved.map(item => `
    <article class="library-item">
      <h3>${item.plan.titulo}</h3>
      <p>
        ${capitalizeMeta(item.plan.meta.nivel)} · ${item.plan.meta.materia} · ${item.plan.meta.curso}
      </p>
      <div class="library-actions">
        <button class="btn btn-secondary" onclick="openSavedPlan('${item.id}')">Abrir</button>
        <button class="btn btn-secondary" onclick="deleteSavedPlan('${item.id}')">Eliminar</button>
      </div>
    </article>
  `).join("");
}

function openSavedPlan(id) {
  const saved = getSavedPlans();
  const found = saved.find(item => item.id === id);
  if (!found) return;

  currentFormData = found.formData;
  currentPlan = found.plan;
  renderPlan(currentPlan);
  showView("result-view");
}

function deleteSavedPlan(id) {
  const saved = getSavedPlans().filter(item => item.id !== id);
  localStorage.setItem("pdb_plans", JSON.stringify(saved));
  renderLibrary();
  showToast("Planificación eliminada.");
}

function getSavedPlans() {
  try {
    return JSON.parse(localStorage.getItem("pdb_plans")) || [];
  } catch {
    return [];
  }
}

function copyCurrentPlan() {
  if (!currentPlan) return;

  const text = serializePlanToText(currentPlan);
  navigator.clipboard.writeText(text).then(() => {
    showToast("Planificación copiada.");
  });
}

function serializePlanToText(plan) {
  const classesText = plan.clases.map(clase => {
    return `${clase.titulo}
Inicio: ${clase.inicio}
Desarrollo: ${clase.desarrollo}
Cierre: ${clase.cierre}`;
  }).join("\n\n");

  return `
${plan.titulo}

Nivel: ${plan.meta.nivel}
Materia: ${plan.meta.materia}
Curso: ${plan.meta.curso}
Tipo: ${humanizeType(plan.meta.tipoPlanificacion)}
Duración: ${plan.meta.duracion}
Formato: ${plan.meta.formato}

PROPÓSITO
${plan.proposito}

OBJETIVOS
- ${plan.objetivos.join("\n- ")}

CONTENIDOS
- ${plan.contenidos.join("\n- ")}

CLASES
${classesText}

RECURSOS
- ${plan.recursos.join("\n- ")}

EVALUACIÓN
- ${plan.evaluacion.join("\n- ")}

OBSERVACIONES
${plan.observaciones || "Sin observaciones"}
  `.trim();
}

function startLoading() {
  showView("loading-view");
  let index = 0;
  const loadingText = document.getElementById("loading-text");
  loadingText.textContent = loadingMessages[0];

  loadingInterval = setInterval(() => {
    index = (index + 1) % loadingMessages.length;
    loadingText.textContent = loadingMessages[index];
  }, 450);
}

function stopLoading() {
  clearInterval(loadingInterval);
}

function syncClassCountBehavior() {
  const type = document.querySelector('input[name="tipoPlanificacion"]:checked')?.value;
  const countInput = document.getElementById("cantidadClases");

  if (type === "clase-unica") {
    countInput.value = 1;
    countInput.setAttribute("readonly", "readonly");
  } else {
    countInput.removeAttribute("readonly");
    if (Number(countInput.value) < 2) {
      countInput.value = type === "secuencia-breve" ? 3 : 5;
    }
  }
}

function setPlanningType(value) {
  const radio = document.querySelector(`input[name="tipoPlanificacion"][value="${value}"]`);
  if (radio) radio.checked = true;
  syncClassCountBehavior();
}

function handleCurriculumVisibility() {
  const type = document.getElementById("alineacionTipo").value;
  document.getElementById("curriculum-text-wrap").classList.toggle("hidden", type !== "texto");
  document.getElementById("curriculum-keywords-wrap").classList.toggle("hidden", type !== "claves");
}

function handleDurationVisibility() {
  const show = document.getElementById("duracion").value === "otro";
  document.getElementById("custom-duration-wrap").classList.toggle("hidden", !show);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

function humanizeType(type) {
  const map = {
    "clase-unica": "Clase única",
    "secuencia-breve": "Secuencia breve",
    "secuencia-completa": "Secuencia completa"
  };
  return map[type] || type;
}

function capitalizeMeta(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
