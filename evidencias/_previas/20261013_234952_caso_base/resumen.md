# Evidencia de ejecución: caso_base
- Fecha: 2026-10-13T23:49:52 · proveedor: groq
- Duración: 54.5s · tokens: 46,660 · iteraciones: 2

## Inputs
- **pedidos**: Trabajamos con los 18 pedidos base. Entró un pedido urgente de último minuto: Pollería Don Beto en San Borja, 25 kg de pollo refrigerado, recibe de 8:30 a 9:45. Además, la Parrilla El Gaucho Limeño pidió mover su entrega a 9:00-10:30.
- **flota**: Hoy tenemos las 2 furgonetas refrigeradas, la van y 2 motos con caja térmica.
- **horario**: Salimos del almacén a las 7:30 y todos deben estar de vuelta antes de la 1:30 pm.
- **restricciones**: Hay obras en la Vía Expresa: el tráfico hacia Barranco y Chorrillos está 40% más lento. En San Isidro solo se permite descargar entre 9:00 y 12:00.
- **objetivo**: Priorizar la puntualidad, sobre todo de los pedidos urgentes.

## Tool calls
- [analista] `configurar_operacion`(furgonetas_refrigeradas=2, hora_limite='13:30', hora_salida='07:30', motos=2, objetivo='puntualidad', vans=1) → ✅ turno=07:30-13:30, objetivo=puntualidad
- [analista] `agregar_pedido`(cliente='Pollería Don Beto', distrito='San Borja', kg=25, prioridad='urgente', tipo='refrigerado', ventana_fin='09:45', ventana_inicio='08:…) → ✅ id=P19
- [analista] `modificar_pedido`(pedido_id='P03', ventana_fin='10:30', ventana_inicio='09:00') → ✅ id=P03
- [analista] `registrar_restriccion`(distritos=['Barranco', 'Chorrillos'], factor=1.4, motivo='Obras en la Vía Expresa', tipo='congestion') → ✅ registrada=congestión ×1.4 en Barranco, Chorrillos (Obras en la Vía Expresa)
- [analista] `registrar_restriccion`(desde='09:00', distritos=['San Isidro'], hasta='12:00', motivo='Solo se permite descargar entre 9:00 y 12:00', tipo='horario_descarga') → ✅ registrada=descarga solo 09:00-12:00 en San Isidro (Solo se permite descargar entre 9:00 y 12:00)
- [analista] `resumen_operacion`() → ✅ turno=07:30-13:30, objetivo=puntualidad, pedidos=19, kg_total=1317, alertas=0
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (92.7)', 'A (41.1)', 'B (35.5)', 'C (25.2)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje …
- [evaluador] `prueba_estres`(estrategia='H', factor_trafico=1.5) → ✅ pct_a_tiempo=100.0 → 100.0, caida_puntualidad_pts=0.0
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (99.5)', 'B (38.3)', 'A (37.5)', 'C (34.9)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje …
- [evaluador] `prueba_estres`(estrategia='H', factor_trafico=1.5) → ✅ pct_a_tiempo=100.0 → 100.0, caida_puntualidad_pts=0.0

## KPIs simulados
                                 estrategia factible  costo S/     km hora fin  min fuera turno a tiempo urgentes a tiempo  min tarde  puntaje                                                     violaciones
0  H · Línea base: heurística voraz sin LLM       sí     356.1  158.5    12:14                0    19/19               6/6          0     99.5                                                               —
1       B · Protección de ventanas críticas       NO     420.2  186.6    12:35                0    16/19               5/6         64     38.3                                       P19 asignado en dos rutas
2                 A · Agrupación geográfica       NO     355.1  151.7    12:11                0    16/19               4/6         59     37.5  pedidos sin asignar: P15; M2 vuelta 1: 35 kg > capacidad 30 kg
3                  C · Consolidación mínima       NO     346.9  158.8    12:37                0    15/19               4/6        206     34.9  pedidos sin asignar: P15; M2 vuelta 1: 35 kg > capacidad 30 kg

## Decisión: H (S/ 356.1, 19/19 a tiempo, urgentes 6/6)
Se selecciona la línea base H porque es la única estrategia factible, cumple con todos los pesos del objetivo (puntualidad 30%, urgentes 30%, tardanza 15%, costo 15%, tiempo 10%) y supera a las demás en puntaje (99.5). No genera violaciones ni tardanzas, entrega los 6 urgentes a tiempo y mantiene la hora fin dentro del turno sin penalizar puntualidad.

## Auditoría
- ✅ La estrategia elegida existe: el Decisor eligió 'H'
- ✅ El Analista aplicó todas las instrucciones (sin tool calls fallidas pendientes): sí
- ✅ Sin violaciones duras (capacidad, frío, prohibiciones): ninguna
- ✅ Todos los pedidos asignados: 19/19 a tiempo
- ✅ Urgentes dentro de su ventana: 6/6
- ✅ Puntualidad mínima aceptable (≥ 70% a tiempo): 100.0% a tiempo
- ✅ Regreso dentro del turno: último regreso 12:14, 0 min fuera de turno
- ✅ Coincide con el #1 numérico o justifica la desviación: #1 numérico: H (99.5); elegida: H (99.5)
- ✅ Robustez evaluada con prueba de estrés: caída 0.0 pts
- ✅ El Evaluador usó el simulador (tool): sí
- ✅ Las cifras del Decisor existen en el simulador: 13/13 cifras verificadas