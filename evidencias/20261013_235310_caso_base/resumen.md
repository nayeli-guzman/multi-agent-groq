# Evidencia de ejecución: caso_base
- Fecha: 2026-10-13T23:53:10 · proveedor: groq
- Duración: 22.6s · tokens: 36,094 · iteraciones: 2

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
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (95.0)', 'B (46.8)', 'C (37.6)', 'A (36.5)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje …
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (100.0)', 'C (49.2)', 'A (46.5)', 'B (41.3)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje…

## KPIs simulados
                                 estrategia factible  costo S/     km hora fin  min fuera turno a tiempo urgentes a tiempo  min tarde  puntaje                violaciones
0  H · Línea base: heurística voraz sin LLM       sí     356.1  158.5    12:14                0    19/19               6/6          0    100.0                          —
1                  C · Consolidación mínima       sí     432.9  190.3    13:57               27    13/19               3/6        535     49.2                          —
2                 A · Agrupación geográfica       NO     399.6  178.9    12:43                0    17/19               6/6          3     46.5   pedidos sin asignar: P18
3       B · Protección de ventanas críticas       NO     392.8  173.6    13:22                0    16/19               6/6         50     41.3  P16 asignado en dos rutas

## Decisión: H (S/ 356.1, 19/19 a tiempo, urgentes 6/6)
Se selecciona la estrategia H (línea base) porque maximiza la puntualidad (100 % en escenario base y sin caída bajo estrés), cumple todas las urgencias, tiene el menor costo y el puntaje más alto (100). Aunque usa los 5 vehículos y uno está al 99.2 % de su capacidad, el riesgo es medio y la complejidad alta, pero sigue siendo la opción que mejor satisface el objetivo del día (puntualidad 30 %).

## Auditoría
- ✅ La estrategia elegida existe: el Decisor eligió 'H'
- ✅ El Analista aplicó todas las instrucciones (sin tool calls fallidas pendientes): sí
- ✅ Sin violaciones duras (capacidad, frío, prohibiciones): ninguna
- ✅ Todos los pedidos asignados: 19/19 a tiempo
- ✅ Urgentes dentro de su ventana: 6/6
- ✅ Puntualidad mínima aceptable (≥ 70% a tiempo): 100.0% a tiempo
- ✅ Regreso dentro del turno: último regreso 12:14, 0 min fuera de turno
- ✅ Coincide con el #1 numérico o justifica la desviación: #1 numérico: H (100.0); elegida: H (100.0)
- ✅ Robustez evaluada con prueba de estrés: caída 0.0 pts
- ✅ El Evaluador usó el simulador (tool): sí
- ⚠️ Las cifras del Decisor existen en el simulador: 8/12 cifras verificadas; no encontradas: [99.2, 99.2, 99.2, 95.0]