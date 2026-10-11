# Evidencia de ejecución: escenario_degradado
- Fecha: 2026-10-11T16:19:28 · proveedor: groq
- Duración: 374.5s · tokens: 61,525 · iteraciones: 2

## Inputs
- **pedidos**: Los pedidos base y además 3 urgentes: 180 kg de pollo para La Molina entre 8:00 y 9:30, 90 kg de carne para el Callao entre 8:00 y 9:00, y 40 kg de carbón en Miraflorez entre 9 y 10. Cancelar el pedido de Pollería Mi Causa.
- **flota**: Solo 1 furgoneta refrigerada y 1 moto; la van y la otra furgoneta están en el taller.

## Tool calls
- [analista] `configurar_operacion`(furgonetas_refrigeradas=1, motos=1, vans=0) → ✅ turno=07:30-13:30, objetivo=balanceado
- [analista] `agregar_pedido`(distrito='La Molina', kg=180, prioridad='urgente', tipo='refrigerado', ventana_fin='09:30', ventana_inicio='08:00') → ✅ id=P19
- [analista] `agregar_pedido`(distrito='Callao', kg=90, prioridad='urgente', tipo='refrigerado', ventana_fin='09:00', ventana_inicio='08:00') → ✅ id=P20
- [analista] `agregar_pedido`(distrito='Miraflores', kg=40, prioridad='urgente', tipo='seco', ventana_fin='10:00', ventana_inicio='09:00') → ✅ id=P21
- [analista] `cancelar_pedido`(motivo='Cancelado por coordinador de despacho', pedido_id='P15') → ✅ cancelado=P15
- [analista] `resumen_operacion`() → ✅ turno=07:30-13:30, objetivo=balanceado, pedidos=20, kg_total=1512, alertas=3
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (24.0)', 'A (11.2)', 'B (10.2)', 'C (4.9)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje s…
- [evaluador] `prueba_estres`(estrategia='A', factor_trafico=1.5) → ✅ pct_a_tiempo=35.0 → 35.0, caida_puntualidad_pts=0.0
- [evaluador] `prueba_estres`(estrategia='B', factor_trafico=1.5) → ✅ pct_a_tiempo=25.0 → 25.0, caida_puntualidad_pts=0.0
- [evaluador] `prueba_estres`(estrategia='C', factor_trafico=1.5) → ✅ pct_a_tiempo=30.0 → 25.0, caida_puntualidad_pts=5.0
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (24.0)', 'A (8.1)', 'C (7.4)', 'B (4.3)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje se …
- [evaluador] `prueba_estres`(estrategia='A', factor_trafico=1.5) → ✅ pct_a_tiempo=30.0 → 25.0, caida_puntualidad_pts=5.0
- [evaluador] `prueba_estres`(estrategia='C', factor_trafico=1.5) → ✅ pct_a_tiempo=25.0 → 10.0, caida_puntualidad_pts=15.0
- [evaluador] `prueba_estres`(estrategia='B', factor_trafico=1.5) → ✅ pct_a_tiempo=10.0 → 10.0, caida_puntualidad_pts=0.0

## KPIs simulados
                                 estrategia factible  costo S/     km hora fin  min fuera turno a tiempo urgentes a tiempo  min tarde  puntaje                                                                     violaciones
0  H · Línea base: heurística voraz sin LLM       NO     220.8   96.8    13:14                0     2/20               2/8        772     24.0      pedidos sin asignar: P01, P02, P04, P05, P06, P08, P10, P12, P14, P17, P18
1                 A · Agrupación geográfica       NO     560.3  186.3    21:21              471     6/20               3/8       3702      8.1                            P02 asignado en dos rutas; P09 asignado en dos rutas
2     C · Consolidación mínima de vehículos       NO     592.6  220.0    20:52              442     5/20               3/8       3930      7.4  F1 vuelta 1: 857 kg > capacidad 600 kg; F1 vuelta 2: 610 kg > capacidad 600 kg
3       B · Protección de ventanas críticas       NO     564.0  182.4    21:37              487     2/20               2/8       5292      4.3                            P09 asignado en dos rutas; P02 asignado en dos rutas

## Decisión: H (S/ 220.8, 2/20 a tiempo, urgentes 2/8)
Se opta por la línea base H porque, aunque no cubre toda la demanda, es la única que no genera sobrecarga de capacidad ni duplicados de pedidos y no genera tiempo fuera de turno. Su costo es el menor (S/ 220.8) y la tardanza total (772 min) es mucho menor que en A, B o C. Sin embargo, quedan 11 pedidos sin asignar, por lo que se requiere intervención humana para replanificar y asignar esos pedidos o añadir recursos.

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
- ✅ Las cifras del Decisor existen en el simulador: 6/6 cifras verificadas