# Evidencia de ejecución: caso_base
- Fecha: 2026-10-11T16:24:22 · proveedor: groq
- Duración: 226.3s · tokens: 45,716 · iteraciones: 2

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
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (94.9)', 'A (40.6)', 'B (36.6)', 'C (11.7)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje …
- [evaluador] `prueba_estres`(estrategia='H', factor_trafico=1.5) → ✅ pct_a_tiempo=100.0 → 100.0, caida_puntualidad_pts=0.0
- [evaluador] `simular_estrategias`(ids=['A', 'B', 'C', 'H']) → ✅ ranking_numerico=['H (96.9)', 'B (39.3)', 'C (31.0)', 'A (28.9)'], nota=puntaje 0-100 ponderado por el objetivo; si una estrategia no es factible su puntaje …
- [evaluador] `prueba_estres`(estrategia='H', factor_trafico=1.5) → ✅ pct_a_tiempo=100.0 → 100.0, caida_puntualidad_pts=0.0

## KPIs simulados
                                 estrategia factible  costo S/     km hora fin  min fuera turno a tiempo urgentes a tiempo  min tarde  puntaje                                                             violaciones
0  H · Línea base: heurística voraz sin LLM       sí     356.1  158.5    12:14                0    19/19               6/6          0     96.9                                                                       —
1       B · Protección de ventanas críticas       NO     289.2  139.7    12:07                0    14/19               5/6         40     39.3                                      pedidos sin asignar: P08, P12, P15
2     C · Consolidación mínima de vehículos       NO     369.7  186.7    13:22                0    13/19               4/6        224     31.0        pedidos sin asignar: P12; V1 vuelta 1: 410 kg > capacidad 400 kg
3                 A · Agrupación geográfica       NO     339.2  152.8    13:29                0    13/19               3/6        213     28.9  pedidos sin asignar: P18; P07 es refrigerado y va en V1 (van) sin frío

## Decisión: H (S/ 356.1, 19/19 a tiempo, urgentes 6/6)
Se elige la estrategia H (línea base heurística voraz) porque es la única factible y alcanza el puntaje más alto (96.9). Cumple con puntualidad 100 % y entrega todos los urgentes sin caídas en la prueba de estrés (+30 % tráfico).

## Auditoría
- ✅ La estrategia elegida existe: el Decisor eligió 'H'
- ✅ El Analista aplicó todas las instrucciones (sin tool calls fallidas pendientes): sí
- ✅ Sin violaciones duras (capacidad, frío, prohibiciones): ninguna
- ✅ Todos los pedidos asignados: 19/19 a tiempo
- ✅ Urgentes dentro de su ventana: 6/6
- ✅ Puntualidad mínima aceptable (≥ 70% a tiempo): 100.0% a tiempo
- ✅ Regreso dentro del turno: último regreso 12:14, 0 min fuera de turno
- ✅ Coincide con el #1 numérico o justifica la desviación: #1 numérico: H (96.9); elegida: H (96.9)
- ✅ Robustez evaluada con prueba de estrés: caída 0.0 pts
- ✅ El Evaluador usó el simulador (tool): sí
- ✅ Las cifras del Decisor existen en el simulador: 13/13 cifras verificadas