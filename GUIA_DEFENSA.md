# Guía de exposición y defensa: Las Grills · Hackathon 7

Este documento es solo para el equipo y no se entrega. Sirve para preparar la exposición del miércoles: cubre los puntos de la rúbrica que se juegan en vivo (presencia, demo, defensa del diseño y participación).

---

## 1. Rúbrica y dónde se gana cada punto

| Criterio (pts) | Qué hacer |
|---|---|
| Definición del problema (2) | Notebook §1 y slide 2. Decirlo en una frase: *"cada mañana el jefe de despacho decide qué vehículo lleva cada pedido; nosotros le damos 3 alternativas medidas y una recomendación justificada"*. |
| Diseño de agentes y orquestación (5) | Slides 3–4 y notebook §2–3. **Saber defender** por qué son 4 agentes, por qué el evaluador simula y por qué el orquestador es código (ver §3 de esta guía). |
| Implementación con Groq (3) | Demo en vivo **con Groq, no Ollama** (con Ollama baja a 2 pts). Mostrar el *preflight* y la rotación de keys. |
| Evaluación crítica (2) | Notebook §7 y slide 7: auditoría, comparación con la heurística, datos incorrectos y escenario degradado. |
| Claridad del notebook (2) | Ya está ordenado según 6.1–6.8. Entregar el notebook **ejecutado con Groq** (con salidas). |
| Presencia (2) | **Al menos 3 de los 5 integrantes conectados.** Si no hay nadie, es cero en todo el trabajo. |
| Exposición (1) | Buena presentación **y hacer al menos una pregunta o sugerencia de input a otro equipo** (ver §5). |

---

## 2. Guion de 8 minutos (máximo 8 slides)

| Tiempo | Slide | Quién | Qué decir |
|---|---|---|---|
| 0:00–0:40 | 1. Portada | Integrante 1 | Equipo, caso 3 y la frase del problema. |
| 0:40–1:30 | 2. Problema | Integrante 1 | Restricciones reales: frío, ventanas antes del almuerzo, hora punta 7–10. Usuario: jefe de despacho. Criterios. |
| 1:30–2:30 | 3. Agentes | Integrante 2 | 4 roles y por qué no 3 ni 5. "El LLM interpreta y juzga; el código calcula". |
| 2:30–3:15 | 4. Flujo | Integrante 2 | Secuencial con bucle condicional (máx. 1 replanificación), auditoría y humano al final. |
| 3:15–3:45 | 5. Groq | Integrante 3 | Dos modelos para repartir la cuota por modelo, rotación de keys y *preflight*. |
| 3:45–6:15 | **Demo en vivo** | Integrante 3 (pantalla) + 4 (narra) | El otro equipo dicta los inputs. Narrar las líneas 🔧 (evidencia de tools). Mostrar la decisión y el mapa. |
| 6:15–7:15 | 6–7. Resultado y evaluación crítica | Integrante 4 | Comparación con la heurística, auditoría, error plausible (150 kg) y dónde interviene el humano. |
| 7:15–8:00 | 8. Cierre | Integrante 5 | Mejoras (OR-Tools, API de tráfico, histórico de clientes) y preguntas. |

> Mientras corre la demo (60–120 s) **no dejen silencio**: lean en voz alta qué tool está llamando cada agente y por qué.

---

## 2b. Resultados de la corrida final con Groq (para las slides 6–7)

**Caso base (5 inputs, objetivo: puntualidad).** El Analista (qwen3.8-27b) hizo 6 *tool calls* correctas en paralelo. El Planificador (gpt-oss-120b) propuso 3 estrategias: A y B factibles, C no factible (P19 asignado dos veces). El Decisor eligió **H** (19/19 a tiempo, 6/6 urgentes, S/ 356.1, puntaje 100) frente a la mejor del LLM, B (73.2 puntos: 15/19 a tiempo). Auditoría 11/11. Duración 51 s y ~31 mil tokens.

**Cómo contarlo:** "Los agentes generaron alternativas factibles, el simulador las midió y el Decisor eligió la mejor, que en este caso fue nuestra línea base. Lo reportamos tal cual: para este día, la regla simple fue más puntual. El valor del sistema está en interpretar el pedido en lenguaje natural, medir todas las opciones con el mismo criterio y no dejar pasar un plan malo."

**Escenario degradado (2 inputs, flota insuficiente).** El sistema replanificó una vez. El Decisor eligió A, que no era factible y estaba por debajo del #1 numérico, sin justificarlo, y citó una cifra (9.0) que no existe en el simulador. **La auditoría detectó las tres cosas** (violaciones duras, desviación no justificada y cifra no verificada) y escaló a una persona. Es el mejor ejemplo de por qué la decisión final no puede quedar solo en manos del LLM.

**Historia de mejoras (sirve para defender el "uso metódico", no el "copiar sugerencias"):**
1. Groq ya no ofrecía Llama → el *preflight* lo detectó y reasignamos el Analista y el Evaluador a qwen3.8-27b (verificamos sus *tool calls* en paralelo).
2. Con razonamiento "medium", gpt-oss-120b truncaba el JSON (límite de 8 mil TPM) → pasamos a "low".
3. El Evaluador hizo 9 pruebas de estrés en una corrida y gastó ~45% de la cuota diaria → limitamos a 3 rondas y 1 prueba extra.
4. El Planificador ponía pollo en la van sin frío y dejaba pedidos sin asignar → le dimos la vista por distrito con kg refrigerados y la regla para repartir distritos mixtos. Pasó de 0/3 a 2/3 estrategias factibles en la corrida final.
5. Las motos salían a las 7:30 y esperaban con pollo en la caja térmica → agregamos la salida diferida al simulador.

Las corridas anteriores quedaron como evidencia en `evidencias/_previas/`.

---

## 3. Preguntas probables del jurado (y respuesta corta)

**¿Por qué 4 agentes y no 3?**
Generar y criticar son tareas opuestas: el planificador necesita diversidad (temperatura 0.5) y el evaluador necesita rigor (0.2). Si los fusionamos, el modelo evalúa sus propias propuestas y tiende a aprobarlas. Además, quien mide (evaluador) no debe ser quien decide (decisor).

**¿Por qué no 5? ¿Por qué no un agente verificador?**
Verificar capacidad o ventanas es cálculo, no juicio. Lo hace un simulador determinista: exacto, gratis e instantáneo. Un quinto LLM costaría ~25% más tokens y podría equivocarse sumando kg. En la capa gratuita de Groq, esos tokens son la diferencia entre que la demo funcione o no.

**¿Qué tool usa cada agente? ¿Las hicieron ustedes?**
Sí, son 8 funciones Python propias expuestas con *tool calling* nativo de Groq. El Analista tiene 6 (configurar la operación, agregar/modificar/cancelar pedidos, registrar restricciones, resumen con alertas). El Evaluador tiene 2 (simular estrategias y prueba de estrés). El Planificador y el Decisor no usan tools: razonan sobre datos ya verificados.

**¿Cómo saben que el Evaluador usó la tool y no inventó los números?**
1. La primera ronda va con `tool_choice="required"`. 2. Cada *tool call* queda registrada y se imprime (🔧). 3. Si por algo no simulara, el orquestador simula de respaldo. 4. La auditoría revisa que los montos y porcentajes del Decisor existan en el simulador.

**¿Por qué el orquestador no es un LLM?**
Para que el flujo sea reproducible y auditable. Qué agente va después y cuándo replanificar son reglas fijas; no hace falta gastar tokens ni arriesgarse a que un LLM se salte un paso.

**¿Qué pasa si en la demo se acaba la cuota de Groq?**
El gestor lee las cabeceras `x-ratelimit-*` de cada respuesta y elige la key con más margen. Ante un 429, bloquea esa key los segundos que indica `retry-after` y rota a otra. Si un modelo no está disponible, pasa al de respaldo. Por eso llevamos keys de 3 o más integrantes.

**¿Por qué dos modelos distintos?**
Groq limita los tokens por minuto por modelo (8 mil en la capa gratuita). El Analista y el Evaluador usan `qwen3.8-27b` y el Planificador y el Decisor usan `gpt-oss-120b`, así cada par consume una cuota distinta. Además, cada modelo calza con su rol: qwen hace *tool calls* en paralelo (lo verificamos: registra varios cambios en una sola respuesta), y gpt-oss razona y admite JSON con esquema estricto, ideal para las estrategias y la decisión.

**¿No iban a usar Llama?**
Sí, lo diseñamos con `llama-3.3-70b`, pero el día de la corrida Groq ya no lo ofrecía. El *preflight* lo detectó (`models.list()`) y reasignamos los agentes. Aunque no lo hubiéramos hecho, la cadena de respaldo de cada agente habría usado otro modelo disponible. Es un buen ejemplo de por qué la gestión de modelos es parte del diseño.

**¿El sistema es mejor que hacerlo a mano o con una regla simple?**
Lo medimos (§7.2). El orquestador agrega a las 3 propuestas del LLM una línea base H: una regla voraz sin LLM. En nuestras pruebas, H fue una línea base fuerte en puntualidad. Hay que leer el resultado de la corrida y ser honestos. Si los agentes ganan, lo mostramos. Si gana H, el sistema la elige y eso demuestra que la red de seguridad funciona. En cualquier caso, el valor de los agentes está en (a) entender inputs en lenguaje natural sin formularios (H se calcula sobre la operación que configuró el Analista), (b) proponer lógicas distintas, como la consolidación para bajar costo, y (c) explicar *trade-offs* y riesgos según el objetivo del día.

**¿Por qué meter una heurística si el trabajo es multi-agente?**
Porque un sistema de decisión serio necesita una vara de medida y un plan B. Sin H no sabríamos si los agentes aportan algo, y si el LLM propone tres malas opciones, el Decisor tendría que elegir "la menos mala". H no es un agente: no razona ni decide, solo es una alternativa más que el Evaluador mide y el Decisor puede elegir o descartar. El bucle de replanificación ignora H a propósito: replanifica si fallan las tres propuestas del LLM.

**¿Qué pasa con datos incorrectos?**
Los errores de formato se rechazan o se corrigen con un aviso (§7.3). Un error **plausible** (150 kg en vez de 15) **pasa**: es la limitación principal. Por eso una persona revisa la bitácora de cambios antes de despachar, y la mejora propuesta es validar contra el histórico de cada cliente.

**¿Qué tan realista es el simulador?**
Es una aproximación: distancia en línea recta × 1.4, un perfil de tráfico por hora y centroides de distrito. Sirve para **comparar** estrategias entre sí, no para prometer ETA exactas. La prueba de estrés (+30% de tráfico) mide qué tan frágil es cada plan. La mejora sería usar una API de rutas real.

**¿Dónde interviene el humano?**
Al validar los cambios que interpretó el Analista, al hacer el checklist antes de despachar, en cualquier escalamiento (sin estrategia factible) y en la aprobación final. El sistema nunca despacha solo.

---

## 4. Checklist del día de la demo

- [ ] `.env` con `GROQ_API_KEY` … `GROQ_API_KEY_3` (mínimo 3 keys de integrantes distintos).
- [ ] **No** correr el notebook completo esa mañana; solo §4 (definiciones). El notebook entregado ya tiene las salidas.
- [ ] Celda 4.3 (*preflight*) en verde: keys OK y modelos asignados.
- [ ] `EJECUTAR_DEMO = True` y `SOLICITUD_DEMO` vacía, lista para completar.
- [ ] Una pestaña con el notebook ejecutado (salidas de §5–7) por si algo falla: mostrar ese resultado da 1 pt en vez de 0.
- [ ] Plan C: Ollama con `qwen2.5:7b` (`PROVEEDOR_LLM=ollama`). Con esto se obtienen 2 pts en vez de 3, así que es solo para emergencias.
- [ ] Zoom: compartir pantalla con la letra del notebook agrandada (Cmd + +).

**Inputs de ejemplo por si el otro equipo no sabe qué decir:**
- pedidos: "Agreguen un pedido urgente de 20 kg de pollo en Lince entre 8:30 y 9:15 y cancelen el de Carbón y Sazón."
- flota: "Hoy se malogró una furgoneta."
- horario: "Salimos a las 8 y volvemos antes de las 2."
- restricciones: "Hay una marcha en el Centro de Lima y Jesús María: 50% más lento. Las vans no pueden entrar a Miraflores."
- objetivo: "Hoy lo que importa es gastar lo menos posible."

---

## 5. Participación en otros equipos (1 pt)

Hay que hacer **al menos una** pregunta o sugerencia de input a otro equipo. Algunas ideas:

**Planificador de estudio (NAN, Camacho quiere egresar):**
- Input: "Tengo 3 parciales la misma semana y trabajo de lunes a miércoles hasta las 6 pm."
- Pregunta: "¿Qué hace su sistema si las horas disponibles no alcanzan para todos los cursos? ¿Lo detecta o reparte de todas formas?"
- Pregunta: "¿La tool calcula las horas o las suma el LLM?"

**Asistente retail (Grupo7, El valor absoluto de Mitsuo):**
- Input: "Un producto se quedó sin stock ayer y la demanda subió 40% por una promoción."
- Pregunta: "¿Cómo distinguen un pico de demanda puntual de una tendencia?"
- Pregunta: "¿El decisor puede elegir algo distinto a lo que recomienda el evaluador? ¿Cómo lo justifica?"

**Planificador logístico (Ehkyppoh), mismo caso que nosotros:**
- Input: "Un pedido refrigerado tiene que llegar en menos de una hora y solo hay motos."
- Pregunta: "¿Cómo verifican que las rutas que propone el LLM cumplen la capacidad?"

**Tema libre (Los prompteros):**
- Pregunta: "¿Qué dato de entrada hace fallar a su sistema y cómo lo detectan?"
