# Evidencia de ejecución: escenario_degradado
- Fecha: 2026-10-11T16:28:31 · proveedor: groq
- Duración: 248.4s · tokens: 43,708 · iteraciones: 2

## Inputs
- **pedidos**: Los pedidos base y además 3 urgentes: 180 kg de pollo para La Molina entre 8:00 y 9:30, 90 kg de carne para el Callao entre 8:00 y 9:00, y 40 kg de carbón en Miraflorez entre 9 y 10. Cancelar el pedido de Pollería Mi Causa.
- **flota**: Solo 1 furgoneta refrigerada y 1 moto; la van y la otra furgoneta están en el taller.

## Tool calls
- [analista] `configurar_operacion`(furgonetas_refrigeradas=1, motos=1, vans=0) → ✅ turno=07:30-13:30, objetivo=balanceado
- [analista] `agregar_pedido`(distrito='La Molina', kg=180, prioridad='urgente', tipo='refrigerado', ventana_fin='09:30', ventana_inicio='08:00') → ✅ id=P19
- [analista] `agregar_pedido`(distrito='Callao', kg=90, prioridad='urgente', tipo='refrigerado', ventana_fin='09:00', ventana_inicio='08:00') → ✅ id=P20
- [analista] `agregar_pedido`(distrito='Miraflores', kg=40, prioridad='urgente', tipo='seco', ventana_fin='10:00', ventana_inicio='09:00') → ✅ id=P21
- [analista] `cancelar_pedido`(motivo='Solicitud del coordinador de despacho', pedido_id='P15') → ✅ cancelado=P15
- [analista] `resumen_operacion`() → ✅ turno=07:30-13:30, objetivo=balanceado, pedidos=20, kg_total=1512, alertas=3
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (24.0)', 'B (6.6)', 'A (6.1)', 'C (3.2)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje se …
- [evaluador] `prueba_estres`(estrategia='B', factor_trafico=1.5) → ✅ pct_a_tiempo=20.0 → 20.0, caida_puntualidad_pts=0.0
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (24.0)', 'A (7.9)', 'B (7.2)', 'C (2.6)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje se …
- [evaluador] `prueba_estres`(estrategia='A', factor_trafico=1.5) → ✅ pct_a_tiempo=25.0 → 25.0, caida_puntualidad_pts=0.0

## KPIs simulados
                                 estrategia factible  costo S/     km hora fin  min fuera turno a tiempo urgentes a tiempo  min tarde  puntaje                                                                 violaciones
0  H · Línea base: heurística voraz sin LLM       NO     217.7   96.8    13:14                0     2/20               2/8        772     24.0  pedidos sin asignar: P01, P02, P04, P05, P06, P08, P10, P12, P14, P17, P18
1                 A · Agrupación geográfica       NO     537.3  198.4    20:34              424     5/20               3/8       2746      7.9                                                    pedidos sin asignar: P10
2       B · Protección de ventanas críticas       NO     536.0  198.8    20:42              432     4/20               3/8       2926      7.2                                                    pedidos sin asignar: P10
3      C · Consolidación mínima de recursos       NO     619.0  235.4    21:38              488     2/20               1/8       3821      2.6                                                    pedidos sin asignar: P10

## Decisión: H (S/ 217.7, 2/20 a tiempo, urgentes 2/8)
Ninguna de las estrategias propuestas es factible bajo las restricciones de capacidad y tiempo. La estrategia H (línea base) presenta el menor costo total (S/ 217.7) y el mayor puntaje (24.0), pero aún deja 11 pedidos sin asignar y supera la capacidad de carga y refrigeración en una sola vuelta. Por lo tanto, se requiere intervención humana para autorizar recursos adicionales (segunda vuelta o vehículo extra) antes de despachar.

## Auditoría
- ✅ La estrategia elegida existe: el Decisor eligió 'H'
- ✅ El Analista aplicó todas las instrucciones (sin tool calls fallidas pendientes): sí
- ❌ Sin violaciones duras (capacidad, frío, prohibiciones): pedidos sin asignar: P01, P02, P04, P05, P06, P08, P10, P12, P14, P17, P18
- ❌ Todos los pedidos asignados: 2/20 a tiempo
- ⚠️ Urgentes dentro de su ventana: 2/8
- ❌ Puntualidad mínima aceptable (≥ 70% a tiempo): 10.0% a tiempo → bajo el umbral: el plan no sale sin revisión humana
- ✅ Regreso dentro del turno: último regreso 13:14, 0 min fuera de turno
- ✅ Coincide con el #1 numérico o justifica la desviación: #1 numérico: H (24.0); elegida: H (24.0)
- ✅ Robustez evaluada con prueba de estrés: caída 0.0 pts
- ✅ El Evaluador usó el simulador (tool): sí
- ✅ Las cifras del Decisor existen en el simulador: 2/2 cifras verificadas