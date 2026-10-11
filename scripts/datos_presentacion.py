"""Extrae de evidencias/ las cifras de la última corrida (caso base y escenario degradado) para la presentación."""
import json, sys
from pathlib import Path

raiz = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
evid = raiz / "evidencias"

def ultima(etiqueta):
    carpetas = sorted(evid.glob(f"*_{etiqueta}"))
    if not carpetas:
        sys.exit(f"No hay evidencias de '{etiqueta}' en {evid}. Ejecuta primero el notebook.")
    return carpetas[-1]

def resumen(carpeta):
    t = json.loads((carpeta / "traza.json").read_text(encoding="utf-8"))
    sims = t["simulaciones"]
    elegida = t["elegida"]
    tools = [x for a in t["agentes"] for x in a["tools"]]
    audit = t["auditoria"]
    return {
        "carpeta": carpeta.name, "proveedor": t.get("proveedor"), "elegida": elegida, "nombre_elegida": t["estrategias"][elegida]["nombre"],
        "objetivo": next((c.split("objetivo ")[-1] for c in t["cambios_aplicados"] if "objetivo" in c), "balanceado"),
        "estrategias": [{"id": k, "nombre": v["nombre"], "costo": v["costo_soles"], "pct": v["pct_a_tiempo"],
                         "urgentes": v["urgentes_a_tiempo"], "hora_fin": v["hora_fin"], "factible": v["factible"],
                         "puntaje": v.get("puntaje")} for k, v in sorted(sims.items())],
        "decision": {k: t["decision"].get(k) for k in ("resumen", "por_que", "riesgos", "revisar_antes_de_aplicar", "confianza")},
        "tokens": sum(c["tokens_total"] for c in t["consumo_api"]), "llamadas": len(t["consumo_api"]),
        "modelos": sorted({c["modelo"] for c in t["consumo_api"]}),
        "tool_calls": len(tools), "tool_calls_por_agente": {a["agente"]: len(a["tools"]) for a in t["agentes"] if a["tools"]},
        "auditoria_ok": sum(f["resultado"] == "✅" for f in audit), "auditoria_total": len(audit),
        "auditoria_criticas": sum(f["resultado"] == "❌" for f in audit),
        "escalar": t["escalar_a_humano"], "iteraciones": 1 + len(t["historial_estrategias"]),
        "segundos": round(sum(a["segundos"] for a in t["agentes"]), 1),
    }

datos = {"base": resumen(ultima("caso_base"))}
comp = ultima("caso_base") / "comparacion_heuristica.json"
if comp.exists():
    c = json.loads(comp.read_text(encoding="utf-8"))
    datos["heuristica"] = {k: {"id": c[k]["id"], "puntaje": c[k]["puntaje"], "costo": c[k]["costo_soles"],
                               "pct": c[k]["pct_a_tiempo"], "urgentes": c[k]["urgentes_a_tiempo"], "factible": c[k]["factible"]}
                           for k in ("elegida", "mejor_agentes", "heuristica")}
if list(evid.glob("*_escenario_degradado")):
    datos["degradado"] = resumen(ultima("escenario_degradado"))
print(json.dumps(datos, ensure_ascii=False, indent=2))
