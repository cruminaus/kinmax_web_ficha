# Design QA · Fase 6 · E6 Alta o cierre

## Artefactos y normalización

- Fuente visual: `C:\Users\Carlos\.codex\generated_images\01a10235-a015-79b3-8863-446a3ecbf9b9\exec-e09943ed-edde-4c16-a9e7-88a71681e068.png`.
- Fuente: 1048 × 1501 px, dirección “Contexto Primero”.
- Implementación principal: `E6_Inicio_Cierre_Tablet.png`, 1265 × 1523 px.
- Estados complementarios: `E6_Sin_Evaluacion_Final_Tablet.png`, `E6_Resultado_Instrumento_Distinto_Tablet.png`, `E6_Resumen_Episodio_Tablet.png`, `E6_Informe_Entrega_Tablet.png`, `E6_Episodio_Cerrado_Tablet.png`.
- Revisión transversal: `E6_Consistencia_Sistema_Desktop.png`, 1265 × 1831 px.
- Tamaño CSS del contenido tablet: 776 px; densidad del navegador: 1. No se hizo comparación píxel a píxel porque E6 conserva el sistema visual de la fuente pero representa contenido y estados nuevos.
- Fuente e implementación se abrieron juntas en la misma revisión visual; además se inspeccionaron regiones enfocadas de comparación, cabecera cerrada y tabla transversal.

## Superficies de fidelidad

- **Tipografía:** conserva familia sans-serif, jerarquía, pesos y etiquetas superiores del sistema aprobado. No hay truncamiento en selectores ni navegación.
- **Espaciado y ritmo:** mantiene cabecera dominante, navegación compacta, flujo clínico de una columna y pie persistente. Tablet y escritorio tienen cero desborde horizontal en las vistas verificadas.
- **Color y tokens:** tinta clínica, azul de acción, verde validado, ocre pendiente y coral de error coinciden con F0. El episodio cerrado usa verde acompañado de texto e icono.
- **Imágenes e iconos:** no hay imágenes clínicas requeridas. Todos los iconos pertenecen a la librería Phosphor ya usada por el sistema; no se introdujo arte CSS o SVG manual.
- **Contenido:** lenguaje chileno, datos ficticios, ausencia de “exitoso” y bloqueo explícito de “recuperado” sin evaluación.

## Interacciones y estados probados

- Selección entre cierre con y sin evaluación final.
- Motivo de derivación con destino y documento.
- Ruta sin evaluación con tres contactos, información faltante y ausencia de Tabla comparativa.
- Comparación con instrumento distinto sin diferencia calculada.
- Bloqueo por registros en borrador.
- Informe emitido, destinatario y constancia de entrega.
- Episodio cerrado: cabecera, línea de tiempo, actividad posterior y episodio nuevo.
- Revisión F0–F6 con 12 filas de componentes y cuatro grupos de preguntas.
- No se observaron errores de renderizado ni superposición de controles durante las pruebas del navegador.

## Historial de iteraciones

### Iteración 1

- **P2:** la Tabla comparativa reutilizada conservaba “Valor actual · E5” dentro de E6.
  - Corrección: se agregaron etiquetas configurables al mismo componente y E6 usa “Valor final · E6”.
  - Evidencia posterior: `E6_Resultado_Instrumento_Distinto_Tablet.png`.
- **P2:** la cabecera del episodio cerrado conservaba “Preparando cierre” y una marca de autoguardado.
  - Corrección: ahora muestra “Cierre validado” y fecha/hora de validación.
  - Evidencia posterior: `E6_Episodio_Cerrado_Tablet.png`.

### Iteración 2

- No se encontraron diferencias P0, P1 o P2 accionables.
- Las vistas tablet y escritorio verificadas presentan desborde horizontal de 0 px.

## Hallazgos residuales

- **P3:** la clínica podría preferir ocultar los controles de simulación en una demostración para pacientes; se mantienen visibles porque este artefacto también documenta estados y casos borde.
- La decisión de reabrir episodios y el plazo del cierre administrativo siguen deliberadamente abiertas.

## Resultado

final result: passed
