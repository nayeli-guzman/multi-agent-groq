#!/usr/bin/env bash
# Ejecuta el notebook con Groq (deja las salidas guardadas), exporta el HTML de evidencia
# y regenera la presentación con las cifras reales de esa corrida.
#   bash scripts/preparar_entrega.sh
set -euo pipefail
cd "$(dirname "$0")/.."
PY="${PYTHON:-.venv/bin/python}"
PY="$(cd "$(dirname "$PY")" && pwd)/$(basename "$PY")"   # ruta absoluta: el script cambia de carpeta

test -f .env || { echo "Falta .env con GROQ_API_KEY (copia .env.example)"; exit 1; }
if grep -q "^PROVEEDOR_LLM=ollama" .env; then echo "El .env apunta a Ollama: la entrega debe correr con Groq"; exit 1; fi

echo "1/3 Ejecutando el notebook con Groq (5-10 min)…"
"$PY" -m nbconvert --to notebook --execute --inplace LasGrills_Hackathon7_RutaBrasa.ipynb \
      --ExecutePreprocessor.timeout=1800

echo "2/3 Exportando evidencia HTML…"
"$PY" -m nbconvert --to html LasGrills_Hackathon7_RutaBrasa.ipynb --output-dir entregables --output notebook_ejecutado

echo "3/3 Regenerando la presentación con las cifras de la corrida…"
cd scripts
"$PY" datos_presentacion.py .. > datos_presentacion.json
"$PY" grafico_presentacion.py
test -d node_modules || npm install --silent
node generar_presentacion.js
cd ..
if [ -d /Applications/Keynote.app ]; then
  echo "Exportando PDF con Keynote…"
  osascript -e "tell application \"Keynote\"" -e "set d to open POSIX file \"$PWD/entregables/Presentacion_LasGrills_Hackathon7.pptx\"" -e "delay 3" -e "export d to POSIX file \"$PWD/entregables/Presentacion_LasGrills_Hackathon7.pdf\" as PDF" -e "close d saving no" -e "end tell"
fi
echo "Listo: notebook ejecutado, HTML, presentación (.pptx) y PDF en entregables/"
