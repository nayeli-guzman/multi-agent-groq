# Evidencia de ejecución: escenario_degradado
- Fecha: 2026-10-11T16:35:08 · proveedor: groq
- Duración: 96.0s · tokens: 39,396 · iteraciones: 2

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
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (24.0)', 'B (11.7)', 'A (9.0)', 'C (5.6)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje se…
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (24.0)', 'A (11.8)', 'C (11.6)', 'B (8.7)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje s…

## KPIs simulados
                                 estrategia factible  costo S/     km hora fin  min fuera turno a tiempo urgentes a tiempo  min tarde  puntaje                                                                 violaciones
0  H · Línea base: heurística voraz sin LLM       NO     217.7   96.8    13:14                0     2/20               2/8        772     24.0  pedidos sin asignar: P01, P02, P04, P05, P06, P08, P10, P12, P14, P17, P18
1                 A · Agrupación geográfica       NO     474.9  172.5    19:57              387     6/20               5/8       3459     11.8            pedidos sin asignar: P17; F1 vuelta 2: 655 kg > capacidad 600 kg
2     C · Consolidación mínima de vehículos       NO     519.3  199.6    19:29              359     6/20               5/8       2723     11.6           pedidos sin asignar: P17; F1 vuelta 1: 1440 kg > capacidad 600 kg
3       B · Protección de ventanas críticas       NO     436.2  147.3    19:07              337     4/20               3/8       3191      8.7                        P09 asignado en dos rutas; P16 asignado en dos rutas

## Decisión: A (S/ 474.9, 6/20 a tiempo, urgentes 5/8)
Se opta por la estrategia A (agrupación geográfica) como la de menor daño pese a ser no factible. Necesita ajustes: asignar el pedido P17, reducir el sobrepeso de la segunda vuelta de F1 (655 kg > 600 kg) moviendo ~55 kg a otra vuelta o a un vehículo extra, y validar la capacidad de frío. Estos cambios permiten cumplir con los pesos del objetivo (puntualidad 25 %, urgentes 20 %) sin romper la capacidad de los vehículos.

## Auditoría
- ✅ La estrategia elegida existe: el Decisor eligió 'A'
- ✅ El Analista aplicó todas las instrucciones (sin tool calls fallidas pendientes): sí
- ❌ Sin violaciones duras (capacidad, frío, prohibiciones): pedidos sin asignar: P17; F1 vuelta 2: 655 kg > capacidad 600 kg
- ❌ Todos los pedidos asignados: 6/20 a tiempo
- ⚠️ Urgentes dentro de su ventana: 5/8
- ❌ Puntualidad mínima aceptable (≥ 70% a tiempo): 30.0% a tiempo → bajo el umbral: el plan no sale sin revisión humana
- ⚠️ Regreso dentro del turno: último regreso 19:57, 387 min fuera de turno
- ⚠️ Coincide con el #1 numérico o justifica la desviación: #1 numérico: H (24.0); elegida: A (11.8)
- ✅ Robustez evaluada con prueba de estrés: caída 5.0 pts
- ✅ El Evaluador usó el simulador (tool): sí
- ⚠️ Las cifras del Decisor existen en el simulador: 11/12 cifras verificadas; no encontradas: [9.0]