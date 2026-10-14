"""Dibuja el gráfico de puntajes de la slide 7 como imagen (se ve igual en PowerPoint, Keynote, Google Slides y PDF)."""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

AQUI = Path(__file__).resolve().parent
datos = json.loads((AQUI / "datos_presentacion.json").read_text(encoding="utf-8"))["base"]

TINTA, TINTA_2, BASE = "#211F1C", "#5B5954", "#C9C6BF"
ELEGIDA, LINEA_BASE = "#E8590C", "#5B5954"

etiquetas, valores, colores = [], [], []
for e in datos["estrategias"]:
    etiquetas.append(("H\n(sin LLM)" if e["id"] == "H" else e["id"]) + ("" if e["factible"] else "\nno factible"))
    valores.append(e["puntaje"] or 0)
    colores.append(ELEGIDA if e["id"] == datos["elegida"] else LINEA_BASE if e["id"] == "H" else BASE)

plt.rcParams["font.family"] = "Arial"
fig, ax = plt.subplots(figsize=(6.3, 3.75), dpi=220)
barras = ax.bar(range(len(valores)), valores, color=colores, width=0.58)
for b, v in zip(barras, valores):
    ax.annotate(f"{v:.1f}", (b.get_x() + b.get_width() / 2, v), xytext=(0, 4), textcoords="offset points",
                ha="center", va="bottom", fontsize=11, color=TINTA, fontweight="bold")
ax.set_xticks(range(len(valores)), etiquetas, fontsize=10, color=TINTA_2)
ax.set_ylim(0, 112)
ax.set_yticks([])
for lado in ("top", "right", "left"):
    ax.spines[lado].set_visible(False)
ax.spines["bottom"].set_color(BASE)
ax.tick_params(axis="x", length=0, pad=6)
ax.set_title(f"Puntaje 0–100 con el objetivo del día: {datos['objetivo']}  (naranja = elegida)",
             fontsize=11, color=TINTA, loc="left", pad=10)
fig.tight_layout()
salida = AQUI / "grafico_puntajes.png"
fig.savefig(salida, transparent=True)
print("gráfico:", salida)
