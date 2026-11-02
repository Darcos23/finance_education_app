# FinPath v2 - prototipo experimental instrumentado

Esta versión reemplaza el prototipo local anterior por una aplicación web móvil con:

- React + Vite.
- Supabase Auth (cuentas reales de prueba con correo/contraseña).
- PostgreSQL en Supabase para diagnóstico, lecciones, metas, simuladores, sesiones y funnel Premium.
- Analítica propia por **usuario único** y por **sesión**, sin Meta Pixel.
- Deduplicación de hitos importantes para que un mismo usuario no se cuente varias veces por repetir un toque.
- Checkout simulado: **no procesa pagos ni guarda datos bancarios**.
- UI/UX alineada con la nueva identidad de FinPath: `#fdbf04`, `#72b6fd`, `#449bfd`, `#0068fb`, `#003ea2`.
- Simuladores determinísticos de gastos hormiga, ahorro, deuda y presupuesto.
- Práctica adaptativa mínima en lecciones: si el usuario falla una pregunta, recibe un refuerzo adicional contextualizado.

## Qué corrige respecto al prototipo anterior

El prototipo anterior persistía todo en `localStorage` y simulaba autenticación. Esta versión usa cuentas y base de datos reales para poder demostrar de forma trazable:

1. usuarios registrados;
2. diagnóstico completado;
3. ruta explorada;
4. uso de una funcionalidad central;
5. recorrido mínimo completado;
6. exposición a Premium;
7. selección de Premium;
8. checkout iniciado;
9. datos de prueba completados;
10. confirmación final de intención de compra.

Los hitos anteriores se registran una sola vez por usuario. Los eventos de navegación pueden ocurrir varias veces, pero las métricas del funnel se calculan con usuarios únicos.

## Usuario único vs sesión

- Antes del login se crea un `device_id` aleatorio en `localStorage`. Sirve únicamente para deduplicar visitas del mismo navegador/dispositivo y no utiliza fingerprinting.
- Al registrarse/iniciar sesión, la unidad principal del experimento pasa a ser el `user_id` de Supabase Auth.
- Cada apertura de una nueva sesión de navegador usa un `session_id` distinto en `sessionStorage`.
- Una persona puede tener varias sesiones, pero los hitos del funnel se deduplican por cuenta.
- Si alguien borra el almacenamiento del navegador o usa modo privado, puede aparecer como un nuevo dispositivo antes del login. Por eso las métricas centrales deben basarse en cuentas autenticadas, no en dispositivos.

## Recorrido mínimo

Se considera completado automáticamente cuando la misma cuenta:

1. completa el diagnóstico;
2. explora una ruta;
3. utiliza al menos una funcionalidad central: completar una lección, crear/actualizar una meta o completar un simulador.

Solo entonces FinPath muestra de forma natural la oferta Premium dentro de la experiencia.

## Checkout simulado

El checkout tiene tres etapas:

1. elegir un método de pago;
2. completar campos de **prueba**;
3. confirmar que finalizaría la compra por $9.000 COP.

Los valores digitados en los campos de pago permanecen exclusivamente en el estado de React y **nunca se envían a Supabase**. Solo se guardan los hitos de avance.

## 1. Instalar dependencias

```bash
npm install
```

## 2. Crear el proyecto de Supabase

Crea un proyecto nuevo en Supabase.

Después puedes desplegar la migración desde consola:

```bash
npx supabase init
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase db push --dry-run
npx supabase db push
```

Si `supabase init` indica que el proyecto ya está inicializado, continúa con `login` y `link`.

La migración que se aplica está en:

```text
supabase/migrations/202610220001_finpath_experiment.sql
```

Alternativa: copia `supabase/schema.sql` en **Supabase > SQL Editor** y ejecútalo.

### Recomendación para la prueba controlada

En **Authentication > Sign In / Providers > Email**, mantén email/password habilitado. Para reducir abandono durante el experimento puedes desactivar temporalmente la confirmación obligatoria de correo. Si la mantienes activa, configura correctamente las URLs de redirección del sitio desplegado.

## 3. Crear variables de entorno

Copia el archivo:

```bash
cp .env.example .env.local
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Completa:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
VITE_EXPERIMENT_ID=afei-2026-2-b2c-v1
```

La URL y la publishable key se obtienen en el panel **Connect** del proyecto Supabase.

> Nunca pongas la `service_role` key en Vite. La publishable key puede estar en el cliente porque la autorización real está protegida con Row Level Security (RLS).

## 4. Ejecutar localmente

```bash
npm run dev
```

Prueba al menos:

1. crear una cuenta;
2. completar diagnóstico;
3. abrir una ruta;
4. completar una lección o simulador;
5. verificar que se habilite Premium;
6. entrar al checkout;
7. completar la simulación;
8. cerrar sesión y volver a entrar;
9. confirmar que el progreso permanezca.

## 5. Verificar build

```bash
npm run build
npm run preview
```

## 6. Consultar métricas

En Supabase > SQL Editor abre:

```text
supabase/metrics_queries.sql
```

Las consultas generan:

- visitantes/dispositivos únicos;
- participantes autenticados únicos;
- sesiones;
- funnel de uso;
- usuarios por funcionalidad;
- uso de práctica adaptativa;
- funnel Premium;
- dataset anonimizado por participante;
- usuarios que recibieron práctica adaptativa;
- usuarios que resolvieron correctamente el refuerzo adaptativo.

## 7. Desplegar en Vercel

### Opción rápida desde consola

```bash
npm install -g vercel
vercel login
vercel
```

Cuando pregunte:

- Framework: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.

Añade las variables al proyecto:

```bash
vercel env add VITE_SUPABASE_URL production --visibility config
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production --visibility config
vercel env add VITE_EXPERIMENT_ID production --visibility config
```

Luego:

```bash
vercel deploy --prod
```

El archivo `vercel.json` ya incluye el rewrite necesario para React Router.

### Después del despliegue

Si la confirmación de correo está activa, agrega el dominio final de Vercel a las URLs permitidas de Supabase Auth.

## 8. Qué NO contar como evidencia

No usar:

- número bruto de clics como equivalente a usuarios;
- page views como uso real;
- eventos repetidos como personas distintas;
- confirmación del checkout simulado como una venta real.

Usar:

- usuarios autenticados únicos;
- porcentaje que completa diagnóstico;
- porcentaje que completa el recorrido mínimo;
- porcentaje que usa práctica adaptativa;
- porcentaje de elegibles que selecciona Premium;
- porcentaje que llega al checkout y a la confirmación final.

## 9. Límites de esta versión

- No tiene integración bancaria.
- No procesa pagos reales.
- Los simuladores son determinísticos; no usan IA.
- La práctica adaptativa actual usa reglas simples basadas en errores de lección.
- No debe presentarse como asesoría financiera.
- Está diseñada para un experimento académico controlado, no como producto financiero en producción.
