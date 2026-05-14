# Fusión Nuclear y Nucleosíntesis Estelar

Simulación interactiva para el estándar **Utah SEEd CHEM.1.4**.

> Construir una explicación sobre cómo la fusión puede formar nuevos elementos con mayor o menor estabilidad nuclear. Enfatizar la energía de enlace nuclear, con la comprensión conceptual de que cuando la fusión de elementos resulta en un núcleo más estable se liberan grandes cantidades de energía, y cuando la fusión resulta en un núcleo menos estable se requieren grandes cantidades de energía. Ejemplos pueden incluir la construcción de elementos en el universo comenzando con hidrógeno para formar elementos más pesados, la composición de las estrellas, o las supernovas que producen elementos pesados.

## Estado

✅ **v1 completa (versión en español).** Tres paneles interactivos, la sección de investigación "Construye una Explicación", el respaldo de movimiento reducido, el botón de pantalla completa y la tarjeta del panel principal en español están en su lugar.

## Archivos

| Archivo | Función |
| --- | --- |
| `index.html` | Estructura de la página: encabezado, las tres secciones de paneles, sección de Investigación, pie de página y etiquetas de script. |
| `styles.css` | Todo el estilo. Tema oscuro coordinado con el resto del sitio de simulaciones. |
| `js/nuclides.js` | Datos: arreglo de 32 registros de núclidos con energía de enlace por nucleón (MeV/A). Expuesto como `window.NUCLIDES`. |
| `js/stellar-stages.js` | Datos: lista ordenada de etapas de combustión estelar (H → He → C → Ne → O → Si → Supernova). Expuesto como `window.STELLAR_STAGES`. |
| `js/reactions.js` | Datos: tabla curada de reacciones con nombres y descripciones amigables para reacciones de fusión estelar bien conocidas. Expuesto como `window.REACTIONS`. |
| `js/q-value.js` | Ayudante de física. Calcula el delta de energía por nucleón para un intento de fusión usando una media de BE/A ponderada por nucleones. Expone `window.QValue.{findProduct, computeDelta, evaluate}`. Módulo puro, sin DOM. |
| `js/binding-curve.js` | Gráfica SVG interactiva de energía de enlace por nucleón vs. número másico. Tooltips al pasar el cursor o tocar, tarjeta de información, y una API pública (`window.BindingCurve`) que el banco de fusión usa para resaltar reactivos y productos. |
| `js/fusion-bench.js` | Paleta de núclidos para hacer clic, dos espacios de reactivos, botón de ¡Fusionar! y tarjeta de resultados. Expone `window.FusionBench.{init, fuse, reset}`. |
| `js/stellar-tracker.js` | Progresión de siete etapas de combustión con sección transversal SVG de la estrella, panel de detalles por etapa y animación de supernova. Expone `window.StellarTracker.{init, setStage, next, previous, reset, triggerSupernova}`. |
| `js/fullscreen.js` | Botón de pantalla completa en el encabezado (Fullscreen API con respaldo de prefijo de Safari). |

## Uso

Abre `index.html` directamente en un navegador — etiquetas `<script>` simples, sin cargador de módulos ni paso de construcción.

### Flujo recomendado para estudiantes

1. **Banco de Fusión** (arriba a la izquierda) — elige dos núclidos y presiona ¡Fusionar! Prueba varias combinaciones y observa qué reacciones liberan energía y cuáles la requieren.
2. **Curva de Energía de Enlace** (arriba a la derecha) — pasa el cursor sobre los puntos y observa cómo se iluminan al fusionar en el banco. Nota que la fusión *hacia* el Fe-56 libera energía y la fusión *más allá* del Fe-56 la requiere.
3. **Nucleosíntesis Estelar** (ancho completo abajo) — recorre las etapas de combustión desde el hidrógeno hasta el silicio, después desencadena una supernova para forjar oro, plomo y uranio.
4. **Investigación** (al final) — andamiaje de cinco actividades que guía a los estudiantes para construir la explicación que pide CHEM.1.4.

### Comportamiento con movimiento reducido

Cuando el sistema operativo o el navegador tiene activada la opción *Reducir movimiento* (`prefers-reduced-motion: reduce`), la dramática animación de supernova se reemplaza por un breve destello blanco (~300 ms en total) y un corte directo al estado posterior a la supernova. Las tarjetas de elementos pesados aparecen sin la explosión cinética.

### Versión en inglés

`../nuclear-fusion/` — la versión paralela en inglés. El enlace **English** en el encabezado lleva ahí.

## Fuentes de datos

Los valores de energía de enlace nuclear vienen de **AME2020** (Wang et al., *Chinese Physics C* 45, 030003, 2021), redondeados a 3 decimales. Los datos de etapas de combustión estelar son cualitativamente estándar (cualquier referencia introductoria de nucleosíntesis estelar).
