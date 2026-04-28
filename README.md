# Prototipo funcional

Se presenta un prototipo funcional de tipo **aplicación web móvil**, desarrollado mediante **React, Vite y Tailwind CSS**. El objetivo principal de este desarrollo es demostrar la factibilidad técnica de construir, en un periodo inferior a una semana, un flujo mínimo orientado a la educación financiera, la definición de metas y el seguimiento del progreso, sin recurrir a integraciones bancarias, backend, APIs externas ni bases de datos externas.

## Funcionalidades implementadas

El sistema incorpora las siguientes funcionalidades:

* Simulación de inicio de sesión local.
* Disponibilidad de un usuario de demostración para pruebas rápidas.
* Persistencia de sesión mediante `localStorage`.
* Diagnóstico financiero inicial (triage) inspirado en dinámicas tipo Duolingo.
* Clasificación del usuario en niveles financieros: principiante, intermedio o avanzado.
* Recomendación de rutas de aprendizaje en función del nivel y los intereses identificados.
* Implementación de rutas de aprendizaje con microlecciones interactivas.
* Estructuración de lecciones en múltiples etapas: contenido, interacción, evaluación, resultado, acción y cierre.
* Creación de metas a partir de plantillas predefinidas.
* Creación de metas personalizadas.
* Registro y seguimiento de avances.
* Definición de hitos diarios para metas de hábito.
* Visualización del progreso mediante barras de avance.
* Implementación de un sistema de “semáforo financiero”.
* Perfil de usuario con resumen de XP, lecciones completadas y metas alcanzadas.
* Funcionalidades de reinicio del diagnóstico, cierre de sesión y eliminación completa de datos.

## Tipos de metas soportadas

El sistema contempla los siguientes tipos de metas:

1. `saving_amount`: metas de ahorro basadas en un monto objetivo.
2. `habit_streak`: metas de hábito con seguimiento diario.
3. `expense_limit`: metas de control o límite de gasto.
4. `lesson_completion`: metas asociadas a la finalización de lecciones.

## Tecnologías utilizadas

```bash
React
Vite
Tailwind CSS
React Router DOM
Lucide React
localStorage
gh-pages
```

## Estructura del proyecto

```text
finhabits-prototipo/
├── .gitignore
├── README.md
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── data.js
│   ├── services.js
│   ├── storage.js
│   ├── utils.js
│   ├── router/
│   │   └── AppRouter.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── TriagePage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LearnPage.jsx
│   │   ├── LessonPage.jsx
│   │   ├── GoalsPage.jsx
│   │   ├── GoalFormPage.jsx
│   │   ├── GoalDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.jsx
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FinancialTrafficLight.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── goals/
│   │   │   ├── GoalCard.jsx
│   │   │   ├── GoalForm.jsx
│   │   │   └── GoalTemplateCard.jsx
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx
│   │   │   ├── MobileShell.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TopBar.jsx
│   │   ├── lessons/
│   │   │   ├── LearningPathCard.jsx
│   │   │   ├── LessonCard.jsx
│   │   │   └── LessonStepCard.jsx
│   │   └── triage/
│   │       ├── TriageQuestionCard.jsx
│   │       └── TriageResultCard.jsx
│   └── utils/
│       └── iconMap.jsx
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Ejecución en entorno local

1. Instalar las dependencias:

```bash
npm install
```

2. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

3. Acceder a la URL proporcionada por Vite, usualmente:

```text
http://localhost:5173
```

## Protocolo de prueba del prototipo

Se recomienda el siguiente flujo para la validación del sistema:

1. Abrir la aplicación.
2. Seleccionar la opción **Usar usuario demo**.
3. Completar el diagnóstico financiero inicial.
4. Analizar el nivel asignado, intereses y recomendaciones.
5. Acceder a la sección **Aprender**.
6. Seleccionar una ruta de aprendizaje.
7. Iniciar una lección.
8. Completar las etapas interactivas.
9. Registrar un hábito desde la lección.
10. Acceder a la sección **Metas**.
11. Crear una meta a partir de una plantilla.
12. Crear una meta personalizada.
13. Consultar el detalle de una meta.
14. Registrar avances financieros.
15. Marcar hitos diarios (en caso de metas de hábito).
16. Regresar a la pantalla principal y observar el semáforo financiero.
17. Recargar la página para verificar la persistencia de datos mediante `localStorage`.

## Construcción para producción

```bash
npm run build
```

Verificación del build:

```bash
npm run preview
```

## Despliegue en GitHub Pages

El proyecto incluye el siguiente script:

```json
"deploy": "gh-pages -d dist"
```

Procedimiento:

```bash
npm install
npm run build
npm run deploy
```

## Personalización del sistema

### Rutas de la aplicación

Archivo:

```text
src/router/AppRouter.jsx
```

Permite la gestión de rutas (creación, modificación o eliminación).

### Páginas principales

Directorio:

```text
src/pages/
```

Cada vista principal se encuentra desacoplada en su propio archivo.

### Componentes reutilizables

Directorio:

```text
src/components/
```

Organizados por dominio funcional: `common`, `layout`, `goals`, `lessons`, `triage` y `auth`.

### Configuración de interfaz móvil

Archivo:

```text
src/components/layout/MobileShell.jsx
```

Define restricciones de dimensiones para mantener consistencia visual en dispositivos móviles.

### Gestión de iconografía

Archivo:

```text
src/utils/iconMap.jsx
```

Centraliza la asignación de iconos mediante `lucide-react`.

### Configuración general de la aplicación

Archivo:

```text
src/data.js
```

Incluye parámetros como nombre y eslogan de la aplicación.

### Configuración de estilos

Archivo:

```text
tailwind.config.js
```

Define la paleta cromática del sistema.

### Configuración del triage, rutas y metas

Archivo:

```text
src/data.js
```

Contiene:

* `TRIAGE_QUESTIONS`
* `LEARNING_PATHS`
* `GOAL_TEMPLATES`

## Lógica de negocio

### Persistencia

Archivo:

```text
src/storage.js
```

Claves utilizadas en `localStorage`:

```text
finance_app_user
finance_app_session
finance_app_triage_result
finance_app_goals
finance_app_lesson_progress
```

### Servicios

Archivo:

```text
src/services.js
```

Incluye módulos especializados en autenticación, usuario, diagnóstico, metas y lecciones.

### Utilidades

Archivo:

```text
src/utils.js
```

Contiene funciones auxiliares para generación de identificadores, manejo de fechas, cálculos y formateo.

## Nota final

Este prototipo no constituye una aplicación financiera en entorno productivo. Se trata de una evidencia técnica con fines académicos, orientada a validar la viabilidad de implementar un flujo básico de educación financiera, establecimiento de metas y seguimiento del progreso sin depender de integraciones externas.
