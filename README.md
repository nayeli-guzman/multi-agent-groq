# RutaBrasa · Las Grills · Hackathon 7

Sistema multi-agente con **Groq** para planificar el reparto de una distribuidora en Lima (Caso 3: planificador logístico).

## Entregables

| # | Entregable (consigna §7) | Archivo |
|---|---|---|
| 1 | Jupyter Notebook funcional | `LasGrills_Hackathon7_RutaBrasa.ipynb` |
| 2 | Diagrama del flujo de agentes | `entregables/diagrama_flujo.png` (también `.svg` y Mermaid dentro del notebook) |
| 3 | Capturas / evidencias de ejecución | `evidencias/<fecha>_<corrida>/` (traza.json, resumen.md, gráficos), generadas automáticamente en cada corrida, + `entregables/notebook_ejecutado.html` |
| 4 | Presentación ejecutiva (máx. 8 slides) | `entregables/Presentacion_LasGrills_Hackathon7.pdf` (y la versión editable `.pptx`) |

`GUIA_DEFENSA.md` es material interno del equipo (guion, preguntas del jurado y checklist de la demo) y no se entrega.

## Cómo ejecutar

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # y pegar las GROQ_API_KEY de los integrantes (hasta 9: GROQ_API_KEY, GROQ_API_KEY_2 … _9)
jupyter lab LasGrills_Hackathon7_RutaBrasa.ipynb
```

**Preparar la entrega final (un solo comando):** ejecuta el notebook con Groq dejando las salidas guardadas, exporta `entregables/notebook_ejecutado.html` y regenera la presentación con las cifras de esa corrida.

```bash
bash scripts/preparar_entrega.sh
```

- Cada corrida del sistema consume ~45 mil tokens (medido con Groq) y el notebook completo hace 2 corridas (caso base y escenario degradado). La capa gratuita da 200 mil tokens por día y por modelo: con 1 key alcanza para unas 4 corridas diarias, así que para la demo conviene tener 2 o 3 keys de integrantes distintas.
- Para ensayar sin gastar cuota: `PROVEEDOR_LLM=ollama` en el `.env` (requiere `ollama pull qwen2.5:7b`). La entrega y la demo van con Groq.
- La demo en vivo está en la sección 8 del notebook (`EJECUTAR_DEMO = True`).
- `scripts/` contiene el generador de la presentación (`generar_presentacion.js`, que necesita `npm install` la primera vez) y el extractor de cifras desde `evidencias/`.

## Arquitectura en una línea

`Prompt (2–5 inputs) → Analista ⇄ 6 tools de datos → Planificador (3 estrategias JSON) + línea base H (código) → Evaluador ⇄ 2 tools de simulación → [¿alguna de las 3 factible? si no, replanificar 1 vez] → Decisor → auditoría → humano`
# multi-agent-groq
