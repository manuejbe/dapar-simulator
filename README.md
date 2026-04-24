# Simulador DAPAR — FDI

Simulador de examen DAPAR (Diagnóstico de Aptitudes Para el Reclutamiento) para las Fuerzas de Defensa de Israel. Banco de más de 480 preguntas incluyendo niveles de dificultad alta validados para el examen real.

## Cómo ejecutar

Abre `index.html` directamente en cualquier navegador moderno. No requiere servidor ni dependencias.

## Estructura del proyecto

```
dapar-simulator/
├── index.html                  # Estructura HTML de las tres pantallas
├── css/
│   └── styles.css              # Estilos completos (tema militar oscuro)
├── js/
│   ├── app.js                  # Lógica principal: timer, navegación, sesión
│   ├── exam.js                 # Render de preguntas, selección, auto-avance
│   └── results.js              # Pantalla de resultados y revisión
├── data/
│   ├── questions_verbal.js     # Banco verbal: analogías, antónimos, lógica formal
│   ├── questions_math.js       # Banco matemático: álgebra, combinatoria, probabilidad
│   └── questions_abstract.js  # Banco abstracto: matrices, patrones, espacial
└── README.md
```

## Características

- **54 preguntas** por examen (18 por sección), seleccionadas aleatoriamente
- **40 minutos** de tiempo total con timer visual
- **Auto-avance** a la siguiente pregunta sin responder tras 1.2s
- Feedback inmediato con explicación inline
- Panel de navegación lateral con estado de cada pregunta
- Atajos de teclado: `1-4` para responder, `←→` para navegar, `F` para marcar
- Revisión completa al finalizar con puntuación por sección
