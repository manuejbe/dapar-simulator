# Simulador DAPAR Olim

Simulador del examen **DAPAR para olim** (versión en español del test de reclutamiento de las IDF). Reproduce el formato real: puntuación 10–90, sin sección verbal, cuatro secciones (figural adaptativa, dos cuantitativas y comprensión de instrucciones) y test de reacción al final.

## Cómo ejecutar

Abrí `index.html` directamente en cualquier navegador moderno. Sin servidor, sin dependencias, sin build.

## Modos

- **Práctica corta** — 12 preguntas por sección, tiempos de la versión oficial de práctica (~56 min).
- **Examen completo** — 25 preguntas por sección, tiempos del examen real (~2 h).
- **Práctica libre** — Elegís una sola sección, sin presión de tiempo, con feedback inmediato tras cada respuesta.

Checkbox "Incluir instrucciones" permite activar o no la cuarta sección (en el examen real a veces aparece, a veces no).

## Formato del examen

| Sección | Preguntas (corto / completo) | Tiempo (corto / completo) | Opciones | Navegación |
|---|---|---|---|---|
| Analogías figurales | 12 / 25 | 40 s / 60 s por pregunta | 4 | Adaptativa, sin volver atrás |
| Cuantitativo 1 | 12 / 25 | 18 min / ~37 min para la sección | 4 | Libre dentro de la sección |
| Cuantitativo 2 | 12 / 25 | 18 min / ~37 min para la sección | 4 | Libre dentro de la sección |
| Comprensión de instrucciones | 12 / 25 | 15 min / ~31 min para la sección | 5 | Libre dentro de la sección |
| Test de reacción | 20 rondas | ~1 min | — | Barra espaciadora |

- **Puntaje 10–90**: 90 ≈ top 5%. Es una estimación orientativa — el puntaje real se calcula contra todos los que rinden.
- **Sin penalización** por incorrectas: siempre conviene responder.
- No se puede volver a una sección anterior.

## Estructura

```
dapar-simulator/
├── index.html                        # 7 pantallas: inicio, modo libre, intro sección, examen, intro reacción, reacción, resultados
├── css/styles.css                    # Estilos (tema militar oscuro)
├── js/
│   ├── app.js                        # Orquestación, modos, timers, teclado, historia
│   ├── exam.js                       # Render free-nav + figural adaptativo
│   ├── figural.js                    # Generador procedural de analogías figurales (SVG)
│   ├── instructions_gen.js           # Generador procedural de comprensión de instrucciones
│   ├── reaction.js                   # Test de reacción (atención sostenida)
│   └── results.js                    # Puntaje 10–90, tabla de interpretación, historia
├── data/
│   ├── questions_quant1.js           # 60 preguntas: %, proporciones, velocidad, fracciones
│   ├── questions_quant2.js           # 60 preguntas: promedios, probabilidad, ecuaciones, geometría
│   ├── questions_verbal.js           # 89 preguntas (solo práctica libre, no está en Dapar olim)
│   └── questions_abstract.js         # 60 preguntas (solo práctica libre, no corresponde al formato figural)
└── README.md
```

## Decisiones de diseño

- **Puntaje 10–90**: mapeo lineal por tramos de porcentaje de aciertos. 0 % → 10, 50 % → 50, 100 % → 90. Es una aproximación, no una conversión real al baremo oficial (que es relativo a quienes rinden). Se avisa al usuario en pantalla.
- **Figural adaptativo**: cada pregunta se genera proceduralmente en SVG con una semilla reproducible. Dificultad 1–5, se sube/baja un nivel según acierto. El puntaje figural pondera por dificultad (0.6 → 1.6 según nivel), así acertar en nivel 5 vale más que en nivel 1.
- **Instrucciones generadas**: 50+ preguntas únicas se generan al vuelo con una semilla por sesión. Esto garantiza que la respuesta siempre sea verificable (se ejecutan los pasos para obtener la correcta) y que los distractores vengan de errores típicos (saltear paso, invertir condicional, off-by-one). En raras combinaciones el generador cae a una pregunta trivial de suma como fallback antes que mostrar algo roto.
- **Verbal y abstracto**: quedan **solo en práctica libre** porque no corresponden al formato Dapar para olim. No se borraron para preservar el contenido.
- **Orden de secciones**: Figural → Cuant 1 → Cuant 2 → Instrucciones. Constante en `CFG.sectionOrder` en `js/app.js:17`.
- **Historia**: hasta 20 intentos guardados en `localStorage` (clave `dapar_history`). Los últimos 5 se muestran en el inicio.
- **Test de reacción**: 20 rondas, 5–7 objetivos (círculo verde), al menos 4 distractores difíciles (elipse verde, círculo no verde). Separado del puntaje 10–90 porque el oficial también lo reporta por separado.
- **Atajos**: `1-4` (o `1-5` en instrucciones) para responder, `←→` para navegar en secciones libres, `M` o `F` para marcar para revisar, barra espaciadora en el test de reacción.
- **Dependencias**: ninguna. Vanilla HTML/CSS/JS, se abre con doble clic.

## Despliegue

Sube los archivos a cualquier hosting estático (GitHub Pages, Netlify, S3). Hecho para GitHub Pages — un `git push` basta.
