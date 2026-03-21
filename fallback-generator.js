(function () {
  function pick(arr, idx = 0) {
    return arr[idx % arr.length];
  }

  function normalizeResources(recursos) {
    const labels = {
      pizarron: 'Pizarrón',
      fotocopias: 'Fotocopias',
      celulares: 'Celulares',
      proyector: 'Proyector',
      laboratorio: 'Laboratorio',
      'sin-tecnologia': 'Sin tecnología'
    };
    return recursos.map((r) => labels[r] || r);
  }

  function buildPhysicsNewtonMoment(payload) {
    return [
      {
        nombre: 'Inicio',
        tiempo: '15 min',
        objetivo: 'Activar ideas previas y presentar la noción de inercia a partir de una situación cotidiana cercana.',
        docente: 'Escribe en el pizarrón: “¿Por qué cuando un colectivo frena de golpe nuestro cuerpo se va hacia adelante?” Luego suma otras dos situaciones: una pelota quieta en el piso y una taza sobre una bandeja que se mueve de golpe.',
        estudiantes: 'Responden primero en parejas y después comparten una hipótesis breve con el grupo.',
        consigna: 'Elegí una de las tres situaciones y explicala con tus palabras. Decí qué estaba quieto o en movimiento antes del cambio y qué cambió después.',
        ejemplos: [
          'Colectivo que frena de golpe y pasajero que se inclina hacia adelante.',
          'Pelota quieta en el piso que permanece en reposo si nadie la patea.',
          'Objeto apoyado sobre una superficie que se mueve de golpe.'
        ],
        observar: [
          'Si aparece la idea de que el cuerpo “sigue como venía”.',
          'Si confunden inercia con fuerza.',
          'Si pueden distinguir estado inicial y cambio posterior.'
        ],
        registro: 'Tabla breve en carpeta: Situación / Estado inicial / Qué cambió / Primera explicación.',
        respuestasEsperables: [
          'El cuerpo sigue moviéndose aunque el colectivo frena.',
          'La pelota sigue quieta porque nada la hace cambiar.',
          'El objeto tiende a conservar cómo estaba antes del cambio.'
        ],
        intervencionDocente: 'Si dicen “hay una fuerza hacia adelante”, repreguntar: “¿el cuerpo ya venía moviéndose antes de frenar?” y “¿qué cambió exactamente en la situación?”.'
      },
      {
        nombre: 'Desarrollo',
        tiempo: '45 min',
        objetivo: 'Construir la 1ra Ley de Newton a partir del análisis guiado de ejemplos y del registro ordenado de observaciones.',
        docente: 'Presenta la formulación breve de la ley, organiza una tabla en el pizarrón y guía el análisis de tres ejemplos concretos: libro sobre mesa, bicicleta que frena, moneda sobre tarjeta.',
        estudiantes: 'Completan la tabla, discuten en grupos pequeños y reformulan sus hipótesis iniciales usando vocabulario físico.',
        consigna: 'Para cada ejemplo respondan: 1) ¿estaba en reposo o movimiento?, 2) ¿qué cambió?, 3) ¿cómo lo explica la 1ra Ley de Newton? 4) ¿qué papel juega la fuerza neta en el cambio?',
        ejemplos: [
          'Libro apoyado sobre una mesa.',
          'Bicicleta en movimiento que frena de golpe.',
          'Moneda sobre una tarjeta colocada encima de un vaso.'
        ],
        observar: [
          'Uso de términos como reposo, movimiento e inercia.',
          'Capacidad para diferenciar conservar el estado de cambiarlo.',
          'Si reconocen que una fuerza neta cambia el movimiento.'
        ],
        registro: 'Tabla de cuatro columnas: Ejemplo / Estado inicial / Cambio observado / Explicación con la ley. Luego cierre oral con una frase síntesis por grupo.',
        respuestasEsperables: [
          'El libro permanece en reposo si no actúa una fuerza neta que cambie su estado.',
          'El ciclista tiende a seguir en movimiento cuando la bicicleta frena.',
          'La moneda tiende a mantener su estado mientras la tarjeta se desplaza rápido.'
        ],
        intervencionDocente: 'Si el grupo se queda en respuestas muy cotidianas, modelar una reformulación: “El objeto tendía a conservar su estado; el cambio apareció cuando actuó una fuerza neta”.'
      },
      {
        nombre: 'Cierre',
        tiempo: '20 min',
        objetivo: 'Verificar comprensión y pedir una explicación breve que evidencie apropiación conceptual.',
        docente: 'Propone dos situaciones nuevas y pide una explicación corta con las palabras reposo, movimiento, inercia y fuerza.',
        estudiantes: 'Resuelven individualmente y luego comparten una respuesta final.',
        consigna: 'Elegí una de estas situaciones: mochila en el piso / pasajero parado en un tren que arranca / pelota rodando que se detiene. Explicala en 4 o 5 líneas usando el vocabulario trabajado.',
        ejemplos: [
          'Pasajero de pie en un tren que arranca.',
          'Mochila quieta sobre el piso del aula.',
          'Pelota que rueda y luego se detiene por rozamiento.'
        ],
        observar: [
          'Si usan vocabulario físico con cierta precisión.',
          'Si logran explicar el cambio de estado sin caer en frases vagas.',
          'Si diferencian entre lo que conserva y lo que modifica.'
        ],
        registro: 'Mini producción escrita individual en carpeta, de 4 a 5 líneas, con devolución rápida del docente.',
        respuestasEsperables: [
          'El pasajero tiende a permanecer en reposo cuando el tren arranca.',
          'La mochila sigue quieta si no hay una fuerza neta que cambie su estado.',
          'La pelota cambia su movimiento por la acción del rozamiento.'
        ],
        intervencionDocente: 'Cerrar explicitando la idea clave: la inercia no es una fuerza, sino la tendencia a conservar el estado de movimiento o reposo.'
      }
    ];
  }

  function buildGenericMoments(payload, classIndex) {
    const tema = payload.tema;
    const recursos = payload.recursos.length ? normalizeResources(payload.recursos).join(', ') : 'pizarrón y carpeta';
    const salida = payload.salida;

    return [
      {
        nombre: 'Inicio',
        tiempo: '15 min',
        objetivo: `Introducir ${tema} y activar ideas previas del grupo con una situación concreta y cercana.`,
        docente: `Presenta una situación cotidiana o escolar relacionada con ${tema}, recupera ideas previas y anota en el pizarrón dos o tres hipótesis iniciales del grupo.`,
        estudiantes: 'Escuchan la situación, responden de manera oral o en parejas y proponen una primera explicación.',
        consigna: `Explicá con tus palabras qué sabés o qué intuís sobre ${tema}. Si podés, sumá un ejemplo concreto.`,
        ejemplos: [
          `Una situación cotidiana vinculada con ${tema}.`,
          `Un ejemplo escolar o cercano donde ${tema} pueda reconocerse.`,
          `Un caso simple que permita discutir el contenido antes de formalizarlo.`
        ],
        observar: [
          'Qué ideas previas aparecen.',
          'Qué confusiones o simplificaciones se repiten.',
          'Qué ejemplos traen los estudiantes espontáneamente.'
        ],
        registro: 'Lista breve en carpeta o cuadro simple: lo que ya sé / ejemplo / duda que me queda.',
        respuestasEsperables: [
          `Aparecen explicaciones iniciales parciales sobre ${tema}.`,
          'Surgen ejemplos cercanos que luego pueden retomarse.',
          'Se visualizan dudas que ordenan el desarrollo posterior.'
        ],
        intervencionDocente: `Si las respuestas son demasiado generales, repreguntar: “¿podés describir un ejemplo puntual donde se vea ${tema}?”.`
      },
      {
        nombre: 'Desarrollo',
        tiempo: '45 min',
        objetivo: `Profundizar ${tema} mediante actividades guiadas, ejemplos concretos y registro ordenado de lo trabajado.`,
        docente: `Organiza una actividad principal, modela una forma de resolución o análisis y da soporte con ${recursos}. Ajusta la explicación para que la salida final sea ${salida}.`,
        estudiantes: 'Analizan ejemplos, completan consignas, comparan respuestas y ajustan sus primeras ideas.',
        consigna: `Trabajá con dos o tres ejemplos de ${tema}. En cada caso indicá qué observás, qué concepto aparece y cómo lo explicarías con vocabulario específico.`,
        ejemplos: [
          `Ejemplo 1 directamente vinculado con ${tema}.`,
          `Ejemplo 2 comparativo para ver semejanzas y diferencias.`,
          `Ejemplo 3 breve para aplicar lo aprendido.`
        ],
        observar: [
          'Si pueden pasar de lo cotidiano al lenguaje específico.',
          'Si registran de manera clara qué ven y cómo lo explican.',
          'Si ajustan sus hipótesis con el avance de la clase.'
        ],
        registro: `Tabla sugerida: Caso / Qué observo / Cómo lo explico / Qué concepto de ${tema} aparece.`,
        respuestasEsperables: [
          'Explicaciones cada vez más precisas.',
          'Uso progresivo del vocabulario del área.',
          'Capacidad para comparar ejemplos y justificar.'
        ],
        intervencionDocente: 'Si las respuestas se quedan en lo descriptivo, pedir que nombren explícitamente el concepto o relación que están usando.'
      },
      {
        nombre: 'Cierre',
        tiempo: '20 min',
        objetivo: `Sintetizar ${tema} y obtener una evidencia breve de comprensión.`,
        docente: 'Propone una situación nueva, pide una explicación breve y recupera una o dos respuestas para cerrar con una síntesis clara.',
        estudiantes: 'Resuelven individualmente una consigna de salida y luego escuchan la síntesis final.',
        consigna: `Elegí uno de los casos trabajados o uno nuevo y explicalo en 4 o 5 líneas usando el vocabulario de ${tema}.`,
        ejemplos: [
          `Un caso nuevo para aplicar ${tema}.`,
          `Una reformulación de uno de los ejemplos centrales.`,
          'Una pequeña pregunta de transferencia.'
        ],
        observar: [
          'Si pueden explicar sin copiar literalmente.',
          'Si recuperan ideas centrales de la clase.',
          'Si aparece el vocabulario específico esperado.'
        ],
        registro: 'Producción breve de cierre en carpeta o ticket de salida.',
        respuestasEsperables: [
          `Explicaciones breves pero ordenadas sobre ${tema}.`,
          'Uso básico pero correcto de conceptos trabajados.',
          'Identificación de una idea principal para llevarse de la clase.'
        ],
        intervencionDocente: 'Cerrar con una síntesis oral corta que recupere la idea más importante y nombre el error frecuente que conviene evitar.'
      }
    ];
  }

  function buildEvaluation(payload) {
    return [
      'Comprensión de las ideas centrales trabajadas durante la clase o secuencia.',
      'Capacidad para explicar ejemplos con vocabulario pertinente.',
      'Registro claro de observaciones, respuestas o procedimientos.',
      'Participación pertinente en la actividad propuesta.',
      'Producción final breve que recupere el contenido trabajado.'
    ];
  }

  function buildClass(classNumber, payload) {
    const isNewton = /1ra ley de newton|primera ley de newton|inercia/i.test(payload.tema || '');
    return {
      numero: classNumber,
      titulo: payload.tipoPlanificacion === 'clase-unica' ? 'Clase única' : `Clase ${classNumber}`,
      momentos: isNewton && classNumber === 1 ? buildPhysicsNewtonMoment(payload) : buildGenericMoments(payload, classNumber)
    };
  }

  window.generateFallbackPlan = function generateFallbackPlan(payload) {
    const totalClases = payload.tipoPlanificacion === 'clase-unica'
      ? 1
      : Number(payload.cantidadClases || (payload.tipoPlanificacion === 'secuencia-breve' ? 3 : 5));

    const clases = Array.from({ length: totalClases }, (_, idx) => buildClass(idx + 1, payload));

    return {
      titulo: payload.tipoPlanificacion === 'clase-unica'
        ? `Planificación detallada sobre ${payload.tema}`
        : `Secuencia detallada sobre ${payload.tema}`,
      proposito: `Se propone que los estudiantes trabajen ${payload.tema} mediante una propuesta concreta, con consignas claras, ejemplos específicos, registro guiado y cierre con evidencia breve de aprendizaje.`,
      objetivos: [
        `Reconocer ideas centrales vinculadas a ${payload.tema}.`,
        `Aplicar ${payload.tema} al análisis de ejemplos concretos.`,
        `Registrar observaciones o respuestas de forma ordenada.`,
        'Explicar con sus palabras lo trabajado en clase.'
      ],
      contenidos: [
        payload.tema,
        `Conceptos principales relacionados con ${payload.tema}`,
        'Análisis de ejemplos y situaciones concretas',
        'Registro y síntesis de lo trabajado'
      ],
      clases,
      evaluacion: buildEvaluation(payload),
      observaciones: payload.observaciones || 'Generado con el motor local de respaldo. Conviene usar la función IA para obtener mayor precisión temática.',
      meta: {
        fuente: 'fallback-local'
      }
    };
  };
})();
