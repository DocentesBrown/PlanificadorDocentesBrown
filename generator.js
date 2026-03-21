const templates = {
  "clase-unica": {
    breve: { objetivosCantidad: 3, contenidosCantidad: 4, evaluacionCantidad: 3 },
    completo: { objetivosCantidad: 5, contenidosCantidad: 6, evaluacionCantidad: 5 }
  },
  "secuencia-breve": {
    breve: { objetivosCantidad: 4, contenidosCantidad: 5, evaluacionCantidad: 4 },
    completo: { objetivosCantidad: 5, contenidosCantidad: 6, evaluacionCantidad: 5 }
  },
  "secuencia-completa": {
    breve: { objetivosCantidad: 5, contenidosCantidad: 6, evaluacionCantidad: 5 },
    completo: { objetivosCantidad: 6, contenidosCantidad: 7, evaluacionCantidad: 6 }
  }
};

const subjectFamilyMatchers = [
  { family: "ciencias-naturales", matches: ["química", "quimica", "física", "fisica", "biología", "biologia", "ciencias naturales"] },
  { family: "ciencias-sociales", matches: ["historia", "geografía", "geografia", "ciencias sociales", "política", "politica"] },
  { family: "lengua-literatura", matches: ["lengua", "literatura", "prácticas del lenguaje", "practicas del lenguaje"] },
  { family: "matematica", matches: ["matemática", "matematica"] },
  { family: "tecnologia-informatica", matches: ["informática", "informatica", "tecnología", "tecnologia", "programación", "programacion"] },
  { family: "filosofia-pedagogia", matches: ["filosofía", "filosofia", "pedagogía", "pedagogia", "ética", "etica"] },
  { family: "arte-expresion", matches: ["arte", "música", "musica", "teatro", "plástica", "plastica"] }
];

const subjectFamilies = {
  "ciencias-naturales": {
    objectiveVerbs: ["observar", "explicar", "relacionar", "interpretar", "reconocer"],
    evaluationCriteria: [
      "Comprensión de los conceptos centrales",
      "Relación entre ejemplos y contenido trabajado",
      "Uso pertinente del vocabulario específico",
      "Interpretación de situaciones o fenómenos observados"
    ],
    startIdeas: [
      "una pregunta disparadora sobre una situación cotidiana",
      "la observación inicial de ejemplos cercanos",
      "una breve recuperación de saberes previos"
    ],
    developmentIdeas: [
      "el análisis guiado de ejemplos",
      "el registro de observaciones",
      "la explicación progresiva del contenido",
      "la comparación entre situaciones"
    ],
    closureIdeas: [
      "una síntesis oral de lo trabajado",
      "un registro breve de conclusiones",
      "una consigna integradora final"
    ]
  },

  "ciencias-sociales": {
    objectiveVerbs: ["analizar", "comparar", "interpretar", "contextualizar", "reconocer"],
    evaluationCriteria: [
      "Contextualización adecuada del contenido",
      "Interpretación de información relevante",
      "Establecimiento de relaciones entre procesos o conceptos",
      "Argumentación basada en lo trabajado"
    ],
    startIdeas: [
      "una pregunta inicial sobre un problema social o histórico",
      "un breve análisis de una situación disparadora",
      "la recuperación de saberes previos"
    ],
    developmentIdeas: [
      "la lectura guiada de materiales",
      "la comparación de perspectivas",
      "el análisis de casos",
      "la construcción de relaciones entre procesos"
    ],
    closureIdeas: [
      "una puesta en común",
      "una síntesis colectiva",
      "una breve conclusión escrita"
    ]
  },

  "lengua-literatura": {
    objectiveVerbs: ["leer", "analizar", "producir", "revisar", "argumentar"],
    evaluationCriteria: [
      "Comprensión de textos o consignas",
      "Producción pertinente y coherente",
      "Uso de categorías trabajadas",
      "Participación en el intercambio de ideas"
    ],
    startIdeas: [
      "una lectura breve disparadora",
      "una pregunta de anticipación",
      "un intercambio oral inicial"
    ],
    developmentIdeas: [
      "la lectura guiada",
      "el análisis de fragmentos",
      "una producción escrita breve",
      "la revisión colectiva"
    ],
    closureIdeas: [
      "la socialización de producciones",
      "una síntesis de ideas principales",
      "una breve revisión final"
    ]
  },

  "matematica": {
    objectiveVerbs: ["resolver", "aplicar", "identificar", "justificar", "verificar"],
    evaluationCriteria: [
      "Resolución correcta de consignas",
      "Justificación del procedimiento",
      "Reconocimiento de relaciones matemáticas",
      "Verificación de resultados"
    ],
    startIdeas: [
      "una situación problemática breve",
      "la recuperación de estrategias previas",
      "un desafío inicial"
    ],
    developmentIdeas: [
      "la resolución guiada de problemas",
      "la comparación de procedimientos",
      "el análisis de errores frecuentes",
      "la formalización de estrategias"
    ],
    closureIdeas: [
      "una puesta en común de procedimientos",
      "una síntesis de estrategias válidas",
      "una resolución final breve"
    ]
  },

  "tecnologia-informatica": {
    objectiveVerbs: ["diseñar", "resolver", "programar", "aplicar", "analizar"],
    evaluationCriteria: [
      "Aplicación adecuada del procedimiento trabajado",
      "Resolución del problema planteado",
      "Uso pertinente de herramientas",
      "Explicación del proceso realizado"
    ],
    startIdeas: [
      "la presentación de un problema técnico",
      "una exploración inicial de una herramienta",
      "una situación práctica disparadora"
    ],
    developmentIdeas: [
      "la resolución paso a paso",
      "la práctica guiada",
      "el análisis de una secuencia de acciones",
      "el diseño de una solución"
    ],
    closureIdeas: [
      "la verificación del resultado",
      "una puesta en común de soluciones",
      "un registro de pasos realizados"
    ]
  },

  "filosofia-pedagogia": {
    objectiveVerbs: ["problematizar", "reflexionar", "argumentar", "relacionar", "analizar"],
    evaluationCriteria: [
      "Capacidad para argumentar con claridad",
      "Vinculación entre conceptos trabajados",
      "Lectura comprensiva",
      "Pertinencia de las intervenciones"
    ],
    startIdeas: [
      "una pregunta inicial de carácter problematizador",
      "una lectura breve disparadora",
      "la presentación de una situación dilemática"
    ],
    developmentIdeas: [
      "el debate guiado",
      "la lectura y el análisis conceptual",
      "la escritura reflexiva",
      "la relación entre ideas o autores"
    ],
    closureIdeas: [
      "una síntesis argumentativa",
      "la recuperación de posiciones trabajadas",
      "una breve reflexión final"
    ]
  },

  "arte-expresion": {
    objectiveVerbs: ["explorar", "crear", "representar", "experimentar", "apreciar"],
    evaluationCriteria: [
      "Participación en la propuesta expresiva",
      "Exploración de recursos trabajados",
      "Producción acorde a la consigna",
      "Explicación de decisiones tomadas"
    ],
    startIdeas: [
      "una observación o escucha inicial",
      "un disparador visual o sonoro",
      "una propuesta breve de exploración"
    ],
    developmentIdeas: [
      "la experimentación con materiales o lenguajes",
      "una producción individual o grupal",
      "el análisis de referentes",
      "el ensayo de variantes expresivas"
    ],
    closureIdeas: [
      "la socialización de producciones",
      "un comentario sobre lo realizado",
      "un registro breve del proceso"
    ]
  },

  "otras": {
    objectiveVerbs: ["comprender", "analizar", "aplicar", "reconocer"],
    evaluationCriteria: [
      "Comprensión de contenidos trabajados",
      "Resolución pertinente de consignas",
      "Participación en las actividades propuestas"
    ],
    startIdeas: [
      "una pregunta inicial",
      "la recuperación de saberes previos"
    ],
    developmentIdeas: [
      "una actividad guiada",
      "el análisis de ejemplos",
      "la resolución de consignas"
    ],
    closureIdeas: [
      "una síntesis final",
      "una puesta en común"
    ]
  }
};

const transformers = {
  simpler(plan) {
    const copy = structuredClone(plan);
    copy.objetivos = copy.objetivos.slice(0, Math.max(2, copy.objetivos.length - 1));
    copy.contenidos = copy.contenidos.slice(0, Math.max(3, copy.contenidos.length - 1));
    copy.evaluacion = copy.evaluacion.slice(0, Math.max(2, copy.evaluacion.length - 1));
    copy.clases = copy.clases.map(clase => ({
      ...clase,
      desarrollo: clase.desarrollo.replace("Finalmente, ", ""),
      cierre: clase.cierre.replace("A modo de cierre, ", "Como cierre, ")
    }));
    return copy;
  },

  stronger(plan) {
    const copy = structuredClone(plan);
    copy.proposito += " Se busca además favorecer una apropiación más consistente del contenido y su relación con situaciones de análisis, producción o aplicación.";
    copy.evaluacion = unique([
      ...copy.evaluacion,
      "Capacidad para recuperar y vincular lo trabajado con nuevas situaciones"
    ]);
    return copy;
  },

  moreCreative(plan) {
    const copy = structuredClone(plan);
    copy.titulo = `Exploración de ${copy.meta.tema || "los contenidos propuestos"} desde una propuesta más creativa`;
    copy.clases = copy.clases.map(clase => ({
      ...clase,
      inicio: "La propuesta comenzará con un disparador atractivo y breve, orientado a despertar interés y activar saberes previos. " + clase.inicio,
      cierre: "Como cierre, se propondrá una producción o reformulación breve que permita resignificar lo trabajado. " + clase.cierre
    }));
    return copy;
  },

  moreClassic(plan) {
    const copy = structuredClone(plan);
    copy.clases = copy.clases.map(clase => ({
      ...clase,
      inicio: "La clase se organizará de manera clara y ordenada desde el comienzo. " + clase.inicio,
      cierre: "El cierre recuperará los contenidos trabajados mediante una síntesis clara. " + clase.cierre
    }));
    return copy;
  }
};

function generatePlanning(formData) {
  const normalized = normalizeFormData(formData);
  const familiaMateria = detectSubjectFamily(normalized.materia);
  const template = getBaseTemplate(normalized.tipoPlanificacion, normalized.formato);
  const curriculumKeywords = extractCurriculumKeywords(
    normalized.alineacionCurricular?.texto || "",
    normalized.alineacionCurricular?.keywords || []
  );

  const profile = {
    ...normalized,
    familiaMateria,
    template,
    subjectConfig: subjectFamilies[familiaMateria] || subjectFamilies.otras,
    alineacion: {
      activa: normalized.alineacionCurricular.tipo !== "none",
      tipo: normalized.alineacionCurricular.tipo,
      estricto: normalized.alineacionCurricular.estricto,
      keywords: curriculumKeywords
    }
  };

  return {
    titulo: buildTitle(profile),
    meta: buildMeta(profile),
    proposito: buildPurpose(profile),
    objetivos: buildObjectives(profile, template.objetivosCantidad),
    contenidos: buildContents(profile, template.contenidosCantidad),
    clases: buildClasses(profile),
    recursos: buildResources(profile),
    evaluacion: buildEvaluation(profile, template.evaluacionCantidad),
    observaciones: buildObservations(profile)
  };
}

function normalizeFormData(formData) {
  const data = {
    nivel: cleanString(formData.nivel),
    materia: cleanString(formData.materia),
    curso: cleanString(formData.curso),
    tema: cleanString(formData.tema),
    tipoPlanificacion: formData.tipoPlanificacion || "clase-unica",
    cantidadClases: Number(formData.cantidadClases || 1),
    duracion: cleanString(formData.duracion),
    formato: cleanString(formData.formato || "breve"),
    estilo: cleanString(formData.estilo || "clasica"),
    grupo: cleanString(formData.grupo || "tranquilo"),
    recursos: Array.isArray(formData.recursos) ? formData.recursos : [],
    observaciones: cleanString(formData.observaciones || ""),
    alineacionCurricular: formData.alineacionCurricular || {
      tipo: "none",
      texto: "",
      keywords: [],
      estricto: false
    }
  };

  if (data.tipoPlanificacion === "clase-unica") {
    data.cantidadClases = 1;
  } else if (data.cantidadClases < 2) {
    data.cantidadClases = data.tipoPlanificacion === "secuencia-breve" ? 3 : 5;
  }

  if (data.recursos.includes("sin-tecnologia")) {
    data.recursos = data.recursos.filter(r => !["celulares", "proyector"].includes(r));
    if (!data.recursos.includes("sin-tecnologia")) data.recursos.push("sin-tecnologia");
  }

  return data;
}

function detectSubjectFamily(materia) {
  const normalized = normalizeText(materia);

  for (const matcher of subjectFamilyMatchers) {
    for (const keyword of matcher.matches) {
      if (normalized.includes(keyword)) return matcher.family;
    }
  }

  return "otras";
}

function getBaseTemplate(tipoPlanificacion, formato) {
  return templates?.[tipoPlanificacion]?.[formato] || templates["clase-unica"].breve;
}

function extractCurriculumKeywords(texto, existingKeywords) {
  const base = [];

  if (Array.isArray(existingKeywords)) {
    base.push(
      ...existingKeywords
        .flatMap(k => String(k).split(","))
        .map(k => cleanString(k))
        .filter(Boolean)
    );
  }

  if (texto) {
    const words = normalizeText(texto)
      .split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 10);

    base.push(...words);
  }

  return unique(base).slice(0, 8);
}

function buildMeta(profile) {
  return {
    nivel: profile.nivel,
    materia: profile.materia,
    curso: profile.curso,
    tipoPlanificacion: profile.tipoPlanificacion,
    cantidadClases: profile.cantidadClases,
    duracion: profile.duracion,
    formato: profile.formato,
    familiaMateria: profile.familiaMateria,
    basadaEnCurriculo: profile.alineacion.activa,
    tema: profile.tema
  };
}

function buildTitle(profile) {
  if (profile.alineacion.estricto && profile.alineacion.keywords.length) {
    return `Propuesta de trabajo sobre ${profile.tema} en relación con ${profile.alineacion.keywords[0]}`;
  }

  if (profile.tipoPlanificacion !== "clase-unica") {
    return `Secuencia didáctica sobre ${profile.tema}`;
  }

  if (profile.estilo === "creativa") {
    return `Exploración de ${profile.tema} a partir de situaciones significativas`;
  }

  return `Introducción a ${profile.tema}`;
}

function buildPurpose(profile) {
  let starter = "Se propone que los estudiantes puedan acercarse";
  if (profile.nivel === "primaria") starter = "Se espera que los alumnos puedan aproximarse";
  if (profile.nivel === "superior") starter = "La propuesta busca promover que los estudiantes logren profundizar";

  let text = `${starter} a ${profile.tema} mediante una propuesta ajustada al nivel ${profile.nivel}, favoreciendo la comprensión, el trabajo con consignas pertinentes y la recuperación de saberes previos.`;

  if (profile.alineacion.activa && profile.alineacion.keywords.length) {
    text += ` Se priorizarán contenidos vinculados a ${joinKeywords(profile.alineacion.keywords, 3)}.`;
  }

  return text;
}

function buildObjectives(profile, count) {
  const verbs = profile.subjectConfig.objectiveVerbs;
  const objetivos = [];

  for (let i = 0; i < count; i += 1) {
    const verb = verbs[i % verbs.length];
    let text = `${capitalize(verb)} contenidos vinculados a ${profile.tema}.`;

    if (profile.familiaMateria === "ciencias-sociales") {
      text = `${capitalize(verb)} procesos y perspectivas relacionados con ${profile.tema}.`;
    } else if (profile.familiaMateria === "matematica") {
      text = `${capitalize(verb)} situaciones problemáticas relacionadas con ${profile.tema}.`;
    } else if (profile.familiaMateria === "lengua-literatura") {
      text = `${capitalize(verb)} lecturas, producciones o intercambios vinculados con ${profile.tema}.`;
    }

    objetivos.push(text);
  }

  return unique(objetivos).slice(0, count);
}

function buildContents(profile, count) {
  const contenidos = [];
  if (profile.alineacion.keywords.length) {
    contenidos.push(...profile.alineacion.keywords.map(k => capitalize(k)));
  }

  contenidos.push(
    capitalize(profile.tema),
    `Conceptos centrales vinculados a ${profile.tema}`,
    `Relaciones y ejemplos asociados a ${profile.tema}`,
    "Recuperación y aplicación de saberes previos",
    "Análisis de consignas y producciones",
    "Síntesis e integración de lo trabajado"
  );

  return unique(contenidos).slice(0, count);
}

function buildClasses(profile) {
  if (profile.tipoPlanificacion === "clase-unica") {
    return [buildSingleClass(profile, 1, "desarrollo")];
  }

  const stages =
    profile.tipoPlanificacion === "secuencia-breve"
      ? ["apertura", "desarrollo", "integracion"]
      : ["introduccion", "exploracion", "profundizacion", "aplicacion", "integracion"];

  return Array.from({ length: profile.cantidadClases }, (_, index) => {
    const stage = stages[index] || "desarrollo";
    return buildSingleClass(profile, index + 1, stage);
  });
}

function buildSingleClass(profile, number, stage) {
  return {
    numero: number,
    titulo: `Clase ${number}`,
    inicio: buildInicio(profile, stage),
    desarrollo: buildDesarrollo(profile, stage),
    cierre: buildCierre(profile, stage)
  };
}

function buildInicio(profile, stage) {
  const idea = profile.subjectConfig.startIdeas[0] || "una breve activación inicial";

  if (profile.estilo === "participativa") {
    return `La propuesta comenzará con ${idea}, favoreciendo el intercambio inicial de ideas y la participación del grupo en torno a ${profile.tema}.`;
  }

  if (profile.estilo === "observada") {
    return `Al inicio se explicitará con claridad el propósito de la clase y luego se trabajará a partir de ${idea}, con el fin de situar a los estudiantes en el contenido a abordar.`;
  }

  return `La clase comenzará con ${idea}, a fin de introducir el trabajo sobre ${profile.tema}.`;
}

function buildDesarrollo(profile, stage) {
  const ideas = profile.subjectConfig.developmentIdeas;
  const parts = [];

  parts.push(`En un primer momento se propondrá ${ideas[0] || "una actividad guiada"} orientada al abordaje de ${profile.tema}.`);

  if (profile.duracion === "80 min" || profile.duracion === "90 min" || profile.duracion === "2 módulos" || profile.formato === "completo") {
    parts.push(`Luego se avanzará con ${ideas[1] || "una segunda actividad de profundización"}, de manera que los estudiantes puedan afianzar lo trabajado.`);
  }

  if (profile.estilo === "participativa") {
    parts.push("Se promoverán instancias de intercambio, trabajo con consignas y construcción colectiva de ideas.");
  }

  if (profile.grupo === "inquieto") {
    parts.push("Las consignas serán breves, claras y organizadas en tramos para sostener la atención del grupo.");
  }

  if (profile.grupo === "heterogeneo") {
    parts.push("Se contemplarán distintas vías de acceso al contenido mediante apoyos, ejemplos y niveles de complejidad gradual.");
  }

  if (profile.alineacion.estricto && profile.alineacion.keywords.length) {
    parts.push(`Durante el desarrollo se priorizará el trabajo con nociones como ${joinKeywords(profile.alineacion.keywords, 3)}.`);
  }

  return parts.join(" ");
}

function buildCierre(profile, stage) {
  const idea = profile.subjectConfig.closureIdeas[0] || "una síntesis final";

  if (profile.estilo === "creativa") {
    return `A modo de cierre, se propondrá ${idea}, de manera que los estudiantes puedan resignificar lo trabajado desde una producción o reflexión final.`;
  }

  if (profile.estilo === "participativa") {
    return `El cierre se organizará a partir de ${idea}, recuperando aportes del grupo y sintetizando los aspectos centrales abordados.`;
  }

  return `Como cierre, se llevará a cabo ${idea}, con el fin de recuperar y organizar lo trabajado durante la clase.`;
}

function buildResources(profile) {
  const recursos = profile.recursos.map(formatResourceLabel);

  if (!recursos.includes("Consignas y registro en carpeta")) {
    recursos.push("Consignas y registro en carpeta");
  }

  if (profile.recursos.includes("pizarron")) {
    recursos.push("Registro colectivo en pizarrón");
  }

  if (profile.recursos.includes("sin-tecnologia")) {
    return unique(recursos.filter(r => !/video|digital|online|proyección/i.test(r)));
  }

  return unique(recursos);
}

function buildEvaluation(profile, count) {
  const criterios = [...profile.subjectConfig.evaluationCriteria];

  if (profile.estilo === "participativa") {
    criterios.push("Participación pertinente en los intercambios y actividades colectivas");
  }

  if (profile.alineacion.keywords.length) {
    criterios.unshift(`Reconocimiento y uso pertinente de nociones vinculadas a ${joinKeywords(profile.alineacion.keywords, 2)}`);
  }

  return unique(criterios).slice(0, count);
}

function buildObservations(profile) {
  if (profile.observaciones) return profile.observaciones;
  if (profile.grupo === "inquieto") return "Se recomienda sostener un ritmo ágil y segmentar claramente las consignas.";
  if (profile.grupo === "heterogeneo") return "Conviene prever apoyos y distintos niveles de complejidad en las tareas propuestas.";
  return "";
}

function transformPlan(plan, action) {
  if (!transformers[action]) return plan;
  return transformers[action](plan);
}

function cleanString(value) {
  return String(value || "").trim();
}

function normalizeText(value) {
  return cleanString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function joinKeywords(keywords, max = 3) {
  return keywords.slice(0, max).join(", ");
}

function formatResourceLabel(resource) {
  const map = {
    pizarron: "Pizarrón",
    fotocopias: "Fotocopias",
    celulares: "Celulares",
    proyector: "Proyector",
    laboratorio: "Laboratorio",
    "sin-tecnologia": "Sin tecnología",
  };

  return map[resource] || capitalize(resource);
}
