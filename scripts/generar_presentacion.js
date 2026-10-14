// Genera la presentación ejecutiva (8 slides) con las cifras de la última corrida del notebook.
//   cd scripts && npm install && npm run presentacion
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require("./apply_theme.js");

const RAIZ = path.resolve(__dirname, "..");
const DATOS = JSON.parse(fs.readFileSync(path.join(__dirname, "datos_presentacion.json"), "utf8"));
const SALIDA = path.join(RAIZ, "entregables", "Presentacion_LasGrills_Hackathon7.pptx");

const THEME = {
  name: "RutaBrasa", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: "211F1C", lt1: "FFFFFF", dk2: "5B5954", lt2: "F3F2EF", accent1: "E8590C", accent2: "2A78D6",
            accent3: "1B9E6F", accent4: "EDA100", accent5: "8A8781", accent6: "C9C6BF", hlink: "2A78D6", folHlink: "5B5954" },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "Las Grills";
pres.title = "RutaBrasa: sistema multi-agente con Groq";
const C = pres.SchemeColor;

// ---------- íconos ----------
async function icono(nombre, color = "FFFFFF") {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[nombre], { color: "#" + color, size: 256 }));
  const png = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}
async function iconoEnCirculo(slide, nombre, x, y, d, fondo, nombreObjeto) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fondo }, line: { color: fondo }, objectName: `${nombreObjeto} círculo` });
  const pad = d * 0.24;
  slide.addImage({ data: await icono(nombre), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, objectName: `${nombreObjeto} ícono` });
}

// ---------- layouts ----------
const PIE = { text: "Las Grills · Hackathon 7 · RutaBrasa", options: { x: 0.6, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.text2, fontFace: "Calibri", margin: 0 } };
pres.defineSlideMaster({
  title: "PORTADA", background: { color: C.text1 },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.9, w: 8.4, h: 1.4, fontSize: 54, bold: true, color: C.background1, fontFace: "Cambria", valign: "bottom", align: "left", margin: 0 }, text: "" } },
            { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.4, w: 8.2, h: 1.2, fontSize: 20, color: C.accent6, fontFace: "Calibri", valign: "top", align: "left", margin: 0 }, text: "" } }],
});
pres.defineSlideMaster({
  title: "CONTENIDO", background: { color: C.background1 },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 12.1, h: 0.85, fontSize: 30, bold: true, color: C.text1, fontFace: "Cambria", valign: "middle", align: "left", margin: 0 }, text: "" } },
            { text: PIE }],
  slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: C.text2, align: "right" },
});
pres.defineSlideMaster({
  title: "OSCURO", background: { color: C.text1 },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 12.1, h: 0.85, fontSize: 30, bold: true, color: C.background1, fontFace: "Cambria", valign: "middle", align: "left", margin: 0 }, text: "" } },
            { text: { ...PIE, options: { ...PIE.options, color: C.accent6 } } }],
  slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
});

const texto = (slide, t, opts) => slide.addText(t, { isTextBox: true, margin: 0, fontFace: "Calibri", color: C.text1, ...opts });

async function filaIcono(slide, ico, titulo, cuerpo, x, y, w, color, oscuro = false, tamCuerpo = 14) {
  await iconoEnCirculo(slide, ico, x, y, 0.55, color, titulo);
  texto(slide, [{ text: titulo, options: { bold: true, fontSize: 16, color: oscuro ? C.background1 : C.text1, breakLine: true } },
                { text: cuerpo, options: { fontSize: tamCuerpo, color: oscuro ? C.accent6 : C.text2 } }],
        { x: x + 0.75, y: y - 0.05, w: w - 0.75, h: 0.95, valign: "top", objectName: `fila ${titulo}` });
}

(async () => {
  const B = DATOS.base, H = DATOS.heuristica, D = DATOS.degradado;
  const elegida = B.estrategias.find((e) => e.id === B.elegida);

  // 1 · Portada ------------------------------------------------------------
  pres.addSection({ title: "Planteamiento" });
  let s = pres.addSlide({ masterName: "PORTADA", sectionTitle: "Planteamiento" });
  s.addText("RutaBrasa", { placeholder: "title" });
  s.addText("Sistema multi-agente con Groq para planificar el reparto de una distribuidora en Lima", { placeholder: "body" });
  texto(s, [{ text: "Las Grills · Caso 3: Planificador logístico", options: { bold: true, breakLine: true } },
            { text: "Jimena Gurbillon · Maria Surco · Nayeli Guzman · Bihonda Epiquien · Andrea Coa", options: { breakLine: true } },
            { text: "Hackathon 7 · Planificación y Toma de Decisiones en IA · UTEC · 14 de octubre de 2026" }],
        { x: 0.6, y: 5.3, w: 8.6, h: 1.2, fontSize: 14, color: C.background1, objectName: "equipo" });
  await iconoEnCirculo(s, "FaTruck", 9.75, 1.85, 2.9, HEX.accent1, "portada camión");
  s.addNotes("Presentar al equipo y el caso. Frase clave: cada mañana el jefe de despacho decide qué vehículo lleva cada pedido; nuestro sistema le da tres alternativas medidas y una recomendación justificada.");

  // 2 · Problema ------------------------------------------------------------
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Planteamiento" });
  s.addText("El problema: cada mañana, ~19 pedidos y 5 vehículos", { placeholder: "title" });
  const filas2 = [
    ["FaStore", "Contexto", "Distribuidora (ficticia) en Surquillo que abastece a pollerías y parrillas con carne refrigerada, carbón y abarrotes."],
    ["FaRoute", "Decisión a apoyar", "Qué vehículo lleva cada pedido, en qué orden y si alguno hace una segunda vuelta."],
    ["FaUserTie", "Usuario", "El jefe de despacho aprueba; choferes y área comercial usan las hojas de ruta y las ETA."],
    ["FaBolt", "Impacto", "Planificar en ~2 min en vez de ~45 y saber antes de salir qué pedidos no se van a cumplir."],
  ];
  for (let i = 0; i < filas2.length; i++) await filaIcono(s, ...filas2[i], 0.6, 1.5 + i * 1.12, 7.2, HEX.accent1);
  const stats = [["×1.7", "tiempo de viaje en hora punta (7:00–10:00)"], ["73%", "de la carga es refrigerada: cadena de frío"], ["8:00–12:30", "ventanas de recepción, antes del almuerzo"]];
  stats.forEach(([n, l], i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.4, y: 1.45 + i * 1.5, w: 4.3, h: 1.3, rectRadius: 0.12, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `dato ${i + 1}` });
    texto(s, [{ text: n, options: { fontSize: 32, bold: true, color: C.accent1, fontFace: "Cambria", breakLine: true } }, { text: l, options: { fontSize: 13, color: C.text2 } }],
          { x: 8.65, y: 1.55 + i * 1.5, w: 3.9, h: 1.1, valign: "middle", objectName: `dato ${i + 1} texto` });
  });
  texto(s, "Criterios:", { x: 0.6, y: 6.18, w: 1.2, h: 0.42, fontSize: 14, bold: true, valign: "middle" });
  ["Factibilidad (dura)", "Puntualidad", "Costo", "Tiempo total", "Robustez", "Complejidad"].forEach((c, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.8 + i * 1.82, y: 6.18, w: 1.7, h: 0.42, rectRadius: 0.21, fill: { color: i === 0 ? C.text1 : C.background2 }, line: { color: i === 0 ? C.text1 : C.background2 }, objectName: `criterio ${c}` });
    texto(s, c, { x: 1.8 + i * 1.82, y: 6.18, w: 1.7, h: 0.42, fontSize: 12, align: "center", valign: "middle", color: i === 0 ? C.background1 : C.text1, objectName: `criterio ${c} texto` });
  });
  s.addNotes("El peso de cada criterio depende del objetivo del día (input 5). La factibilidad es una restricción dura: capacidad, frío, prohibiciones y cobertura.");

  // 3 · Agentes ------------------------------------------------------------
  pres.addSection({ title: "Diseño" });
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Diseño" });
  s.addText("Cuatro agentes, cuatro formas distintas de fallar", { placeholder: "title" });
  const agentes = [
    ["FaClipboardList", "1 · Analista", "qwen3.8-27b · 6 tools", "Traduce el prompt en cambios validados en el estado.", "Inventar datos → tools que validan", HEX.accent2],
    ["FaRoute", "2 · Planificador", "gpt-oss-120b · JSON estricto", "Propone 3 estrategias; el código agrega una línea base H.", "Variantes cosméticas → 3 lógicas obligatorias", HEX.accent1],
    ["FaChartBar", "3 · Evaluador", "gpt-oss-120b · 2 tools", "Simula y compara tiempo, costo, complejidad y riesgo.", "Opinar sin medir → simular es obligatorio", HEX.accent2],
    ["FaGavel", "4 · Decisor", "gpt-oss-120b · JSON estricto", "Elige, justifica y deja riesgos y checklist.", "Cifras inventadas → auditoría", HEX.accent1],
  ];
  for (let i = 0; i < agentes.length; i++) {
    const [ico, nom, mod, hace, falla, col] = agentes[i];
    const x = 0.6 + i * 3.06;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.45, w: 2.9, h: 3.95, rectRadius: 0.12, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `tarjeta ${nom}` });
    await iconoEnCirculo(s, ico, x + 0.25, 1.68, 0.7, col, nom);
    texto(s, [{ text: nom, options: { bold: true, fontSize: 18, fontFace: "Cambria", breakLine: true } }, { text: mod, options: { fontSize: 12, color: C.text2 } }],
          { x: x + 0.25, y: 2.55, w: 2.45, h: 0.75, valign: "top", objectName: `${nom} nombre` });
    texto(s, hace, { x: x + 0.25, y: 3.35, w: 2.45, h: 0.95, fontSize: 14, valign: "top", objectName: `${nom} hace` });
    texto(s, falla, { x: x + 0.25, y: 4.35, w: 2.45, h: 0.85, fontSize: 13, italic: true, color: C.text2, valign: "top", objectName: `${nom} falla` });
  }
  texto(s, [{ text: "¿Por qué no 3? ", options: { bold: true } }, { text: "quien propone no debe evaluarse a sí mismo, y quien mide no debe decidir.", options: { breakLine: true } },
            { text: "¿Por qué no 5? ", options: { bold: true } }, { text: "verificar capacidad y ventanas es cálculo: lo hace un simulador determinista, no otro LLM (exacto, gratis y ahorra ~25% de tokens)." }],
        { x: 0.6, y: 5.65, w: 12.1, h: 1.0, fontSize: 15, valign: "top", paraSpaceAfter: 6, objectName: "justificación" });
  s.addNotes("Principio de diseño: el LLM interpreta y juzga; el código calcula y verifica. Azul = agentes con tools; naranja = agentes que razonan sobre datos verificados.");

  // 4 · Flujo ------------------------------------------------------------
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Diseño" });
  s.addText("Flujo: secuencial, con un bucle de replanificación", { placeholder: "title" });
  s.addImage({ path: path.join(RAIZ, "entregables", "diagrama_flujo.png"), x: 0.6, y: 1.3, h: 5.55, w: 5.55 * 1926 / 2183, objectName: "diagrama de flujo" });
  const pasos = [
    ["Orden", "Analista → Planificador → Evaluador → Decisor → coordinador humano."],
    ["Qué pasa entre agentes", "Datos verificados del estado compartido (no copiados de texto), estrategias en JSON y KPIs del simulador."],
    ["Tipo de flujo", "Secuencial con bucle condicional: si ninguna estrategia es factible, vuelve al Planificador una sola vez con las violaciones exactas."],
    ["Quién integra", "El Decisor elige y justifica; el orquestador (código) arma las hojas de ruta desde la simulación; el coordinador aprueba."],
  ];
  pasos.forEach(([t, c], i) => {
    const y = 1.45 + i * 1.32;
    s.addShape(pres.shapes.OVAL, { x: 6.1, y, w: 0.5, h: 0.5, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: `paso ${i + 1}` });
    texto(s, String(i + 1), { x: 6.1, y, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `paso ${i + 1} número` });
    texto(s, [{ text: t, options: { bold: true, fontSize: 16, breakLine: true } }, { text: c, options: { fontSize: 14, color: C.text2 } }],
          { x: 6.8, y: y - 0.04, w: 5.9, h: 1.15, valign: "top", objectName: `paso ${i + 1} texto` });
  });
  s.addNotes("Hay compuertas de validación en código entre agentes: validación de inputs, del JSON del planificador, simulación de respaldo y auditoría final.");

  // 5 · Groq ------------------------------------------------------------
  pres.addSection({ title: "Implementación" });
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Implementación" });
  s.addText("Groq: 8 tools propias y una demo que no depende de la suerte", { placeholder: "title" });
  texto(s, "Tools propias con tool calling nativo", { x: 0.6, y: 1.45, w: 5.9, h: 0.45, fontSize: 18, bold: true, fontFace: "Cambria" });
  const chips = [["Analista", ["configurar_operacion", "agregar_pedido", "modificar_pedido", "cancelar_pedido", "registrar_restriccion", "resumen_operacion"]],
                 ["Evaluador", ["simular_estrategias", "prueba_estres"]]];
  let yc = 2.05;
  for (const [ag, lista] of chips) {
    texto(s, ag, { x: 0.6, y: yc, w: 5.9, h: 0.35, fontSize: 14, bold: true, color: C.accent2 });
    yc += 0.42;
    lista.forEach((n, i) => {
      const x = 0.6 + (i % 2) * 2.95, y = yc + Math.floor(i / 2) * 0.5;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.8, h: 0.4, rectRadius: 0.2, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `tool ${n}` });
      texto(s, n, { x, y, w: 2.8, h: 0.4, fontSize: 13, align: "center", valign: "middle", objectName: `tool ${n} texto` });
    });
    yc += Math.ceil(lista.length / 2) * 0.5 + 0.2;
  }
  texto(s, "Cada tool valida sus argumentos y responde ok o un error legible, así el agente puede corregir su propia llamada.",
        { x: 0.6, y: yc + 0.05, w: 5.9, h: 0.8, fontSize: 14, color: C.text2, valign: "top" });
  const gestion = [["FaKey", "Una key por integrante", "Se leen del .env y se rotan automáticamente."],
                   ["FaTachometerAlt", "Lectura de rate limits", "Cabeceras x-ratelimit-* y retry-after: espera o cambia de key."],
                   ["FaExchangeAlt", "Modelos de respaldo", "Si un modelo no está disponible, el agente pasa al siguiente."],
                   ["FaCheckDouble", "Preflight antes de la demo", "Verifica keys, modelos disponibles y cuota restante."]];
  for (let i = 0; i < gestion.length; i++) await filaIcono(s, ...gestion[i], 7.1, 1.5 + i * 1.0, 5.6, HEX.accent2);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.1, y: 5.6, w: 5.6, h: 1.05, rectRadius: 0.12, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: "consumo" });
  texto(s, [{ text: `${(B.tokens / 1000).toFixed(1)} mil tokens`, options: { fontSize: 26, bold: true, color: C.accent1, fontFace: "Cambria", breakLine: true } },
            { text: `por corrida completa · ${B.llamadas} llamadas a la API · 2 modelos para repartir la cuota por minuto`, options: { fontSize: 13, color: C.text2 } }],
        { x: 7.35, y: 5.62, w: 5.2, h: 1.0, valign: "middle", objectName: "consumo texto" });
  s.addNotes("Groq limita los tokens por minuto por modelo: el Analista usa qwen3.8-27b (tool calls en paralelo, respuestas cortas) y Planificador, Evaluador y Decisor usan gpt-oss-120b (razonamiento, JSON estricto y respuestas largas: qwen solo admite 1000 tokens de salida por minuto). Llama ya no estaba disponible en Groq: el gestor lo detecta y usa la cadena de respaldo. Recomendamos 3 o más keys para la demo.");

  // 6 · Demo ------------------------------------------------------------
  s = pres.addSlide({ masterName: "OSCURO", sectionTitle: "Implementación" });
  s.addText("Demo en vivo: ustedes dictan el input", { placeholder: "title" });
  const inputs = [["pedidos", "obligatorio", "“Agreguen un urgente de 20 kg de pollo en Lince, 8:30–9:15”"],
                  ["flota", "obligatorio", "“Hoy se malogró una furgoneta”"],
                  ["horario", "opcional", "“Salimos a las 8 y volvemos antes de las 2”"],
                  ["restricciones", "opcional", "“Marcha en el Centro: 50% más lento”"],
                  ["objetivo", "opcional", "“Hoy importa gastar lo menos posible”"]];
  inputs.forEach(([n, o, e], i) => {
    const col = i < 3 ? i : i - 3, fila = i < 3 ? 0 : 1;
    const x = 0.6 + col * 4.1 + (fila ? 2.05 : 0), y = 1.6 + fila * 1.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.9, h: 1.6, rectRadius: 0.12, fill: { color: "34312D" }, line: { color: "34312D" }, objectName: `input ${n}` });
    texto(s, [{ text: `${i + 1} · ${n}`, options: { bold: true, fontSize: 20, color: C.accent1, fontFace: "Cambria", breakLine: true } },
              { text: o, options: { fontSize: 12, color: C.accent6, breakLine: true } },
              { text: e, options: { fontSize: 14, color: C.background1 } }],
          { x: x + 0.25, y: y + 0.15, w: 3.45, h: 1.5, valign: "top", objectName: `input ${n} texto` });
  });
  await iconoEnCirculo(s, "FaWrench", 0.6, 5.55, 0.55, HEX.accent2, "evidencia tools");
  texto(s, "Mientras corre, cada línea con la llave inglesa es una tool que un agente acaba de ejecutar: esa es la evidencia de uso de tools.",
        { x: 1.35, y: 5.5, w: 11.3, h: 0.65, fontSize: 16, color: C.background1, valign: "middle" });
  s.addNotes("Pegar los inputs en SOLICITUD_DEMO, poner EJECUTAR_DEMO = True y ejecutar. Narrar las tool calls del Analista y del Evaluador. Al final mostrar decisión, auditoría y mapa.");

  // 7 · Resultados y evaluación crítica ---------------------------------------
  pres.addSection({ title: "Resultados" });
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Resultados" });
  s.addText("Caso base: qué decidió el sistema y cuánto confiar en eso", { placeholder: "title" });
  const barras = B.estrategias.map((e) => ({ label: `${e.id === "H" ? "H (sin LLM)" : e.id}${e.factible ? "" : " ✗"}`, valor: e.puntaje,
                                              color: e.id === B.elegida ? HEX.accent1 : e.id === "H" ? HEX.dk2 : HEX.accent6 }));
  s.addChart(pres.charts.BAR, [{ name: "Puntaje", labels: barras.map((b) => b.label), values: barras.map((b) => b.valor) }], {
    x: 0.6, y: 1.35, w: 6.3, h: 3.75, barDir: "col", chartColors: barras.map((b) => b.color), barGapWidthPct: 70,
    showTitle: true, title: `Puntaje 0–100 con el objetivo del día: ${B.objetivo}`, titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.0",
    catAxisLabelColor: HEX.dk2, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 100,
    valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, objectName: "gráfico puntajes",
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.25, w: 6.3, h: 1.45, rectRadius: 0.12, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: "decisión" });
  texto(s, [{ text: `Elegida: ${B.elegida} · ${B.nombre_elegida}`.slice(0, 70), options: { bold: true, fontSize: 16, breakLine: true } },
            { text: `S/ ${elegida.costo} · ${elegida.pct}% a tiempo · urgentes ${elegida.urgentes} · regreso ${elegida.hora_fin}`, options: { fontSize: 14, color: C.text2 } }],
        { x: 0.85, y: 5.35, w: 5.85, h: 1.25, valign: "middle", objectName: "decisión texto" });
  const hallazgos = [
    ["FaBalanceScale", "Agentes vs. línea base H (sin LLM)", H ? `Mejor propuesta de los agentes ${H.mejor_agentes.puntaje} vs H ${H.heuristica.puntaje} puntos. ${H.mejor_agentes.puntaje > H.heuristica.puntaje ? "Los agentes aportan sobre la regla simple." : "Gana la regla simple: H funciona como red de seguridad."}` : "Ver §7.2 del notebook."],
    ["FaClipboardCheck", "Auditoría automática", `${B.auditoria_ok} de ${B.auditoria_total} verificaciones OK; ${B.auditoria_criticas} críticas fallidas. Revisa que las cifras citadas existan en el simulador.`],
    ["FaExclamationTriangle", "Datos incorrectos", "Los errores de formato se rechazan. Un error plausible (150 kg en vez de 15) pasa: por eso revisa una persona."],
    ["FaUserShield", "Flota insuficiente", D ? `${D.iteraciones - 1} replanificación(es); la auditoría marcó ${D.auditoria_total - D.auditoria_ok} problemas (incluidos errores del Decisor) y ${D.escalar ? "escaló a una persona" : "no escaló"}.` : "Ver §7.4 del notebook."],
  ];
  for (let i = 0; i < hallazgos.length; i++) await filaIcono(s, ...hallazgos[i], 7.3, 1.45 + i * 1.33, 5.4, HEX.accent1, false, 13);
  if (B.proveedor !== "groq") {
    texto(s, "BORRADOR: cifras de un ensayo local (Ollama). Regenerar con scripts/preparar_entrega.sh tras la corrida con Groq.",
          { x: 0.6, y: 6.75, w: 9.5, h: 0.25, fontSize: 10, bold: true, color: "D03B3B", objectName: "aviso borrador" });
  }
  s.addNotes("Las cifras salen del simulador, no del texto del LLM. Ser honestos con la comparación contra la heurística: el valor de los agentes está en entender lenguaje natural, proponer lógicas distintas y explicar los trade-offs.");

  // 8 · Cierre ------------------------------------------------------------
  s = pres.addSlide({ masterName: "OSCURO", sectionTitle: "Resultados" });
  s.addText("Lo que el sistema no decide solo", { placeholder: "title" });
  const columnas = [["FaUserCheck", "Dónde interviene una persona", ["Confirma los cambios que interpretó el Analista", "Hace el checklist antes de despachar", "Decide en cualquier escalamiento (subcontratar, renegociar)", "Aprueba o rechaza el plan final"], HEX.accent3],
                    ["FaRocket", "Siguiente versión", ["Tiempos reales con una API de rutas y tráfico", "OR-Tools (VRPTW) como tool del Planificador", "Validar contra el histórico de cada cliente", "Varias corridas y voto para medir estabilidad"], HEX.accent1]];
  for (let i = 0; i < columnas.length; i++) {
    const [ico, tit, items, col] = columnas[i];
    const x = 0.6 + i * 6.2;
    await iconoEnCirculo(s, ico, x, 1.5, 0.6, col, tit);
    texto(s, tit, { x: x + 0.8, y: 1.5, w: 5.0, h: 0.6, fontSize: 20, bold: true, color: C.background1, fontFace: "Cambria", valign: "middle" });
    texto(s, items.map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < items.length - 1 } })),
          { x: x + 0.1, y: 2.35, w: 5.6, h: 2.6, fontSize: 16, color: C.background1, paraSpaceAfter: 10, valign: "top", objectName: `${tit} lista` });
  }
  texto(s, [{ text: "El LLM interpreta y juzga; el código calcula y verifica; la persona decide.", options: { fontSize: 22, italic: true, color: C.accent1, fontFace: "Cambria", breakLine: true } },
            { text: "Gracias · ¿Preguntas?", options: { fontSize: 16, color: C.accent6 } }],
        { x: 0.6, y: 5.35, w: 12.1, h: 1.2, valign: "top", objectName: "mensaje final" });
  s.addNotes("Cerrar con el principio de diseño. Quedarse para la ronda de preguntas y hacer al menos una pregunta o sugerencia a otro equipo (1 punto de la rúbrica).");

  await pres.writeFile({ fileName: SALIDA });
  await applyTheme(SALIDA, THEME);
  console.log("Presentación escrita en", SALIDA);
})();
