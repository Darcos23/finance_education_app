
-- ==========================================================
-- FinPath - consultas de evidencia del experimento B2C
-- Cambia el experiment_id si usas otro.
-- ==========================================================

-- 1) Funnel principal por usuarios autenticados únicos.
select
  count(*) filter (where user_id is not null) as usuarios_registrados_en_estado,
  count(*) filter (where triage_completed_at is not null) as diagnostico_completado,
  count(*) filter (where route_viewed_at is not null) as ruta_explorada,
  count(*) filter (where central_feature_used_at is not null) as funcionalidad_central_usada,
  count(*) filter (where minimum_journey_completed_at is not null) as recorrido_minimo_completado,
  count(*) filter (where premium_offer_viewed_at is not null) as oferta_premium_vista,
  count(*) filter (where premium_selected_at is not null) as premium_seleccionado,
  count(*) filter (where checkout_started_at is not null) as checkout_iniciado,
  count(*) filter (where checkout_details_completed_at is not null) as datos_checkout_completados,
  count(*) filter (where checkout_confirmed_at is not null) as confirmacion_intencion_compra
from public.experiment_state
where experiment_id = 'afei-2026-2-b2c-v1'
  and user_id is not null;

-- 2) Visitas únicas de dispositivo y sesiones reales.
select
  count(distinct device_id) filter (where event_name='unique_device_visit') as dispositivos_unicos_antes_de_login,
  count(distinct user_id) filter (where event_name='unique_participant') as cuentas_unicas_participantes
from public.analytics_events
where experiment_id='afei-2026-2-b2c-v1';

select
  count(*) as sesiones_totales,
  count(distinct device_id) as dispositivos_con_sesion,
  count(distinct user_id) filter (where user_id is not null) as usuarios_autenticados_con_sesion
from public.experiment_sessions
where experiment_id='afei-2026-2-b2c-v1';

-- 3) Uso por funcionalidad: cuenta usuarios, no clics.
select
  event_name,
  count(distinct user_id) as usuarios_unicos
from public.analytics_events
where experiment_id='afei-2026-2-b2c-v1'
  and user_id is not null
  and event_name in (
    'triage_completed','route_viewed','lesson_completed','goal_created',
    'goal_progress_registered','simulator_completed','adaptive_practice_shown',
    'adaptive_practice_completed','premium_selected','checkout_started',
    'checkout_details_completed','checkout_confirmed'
  )
group by event_name
order by event_name;

-- 4) Evidencia de personalización adaptativa.
select
  count(*) filter (where adaptive_practice_shown_at is not null) as usuarios_que_recibieron_refuerzo,
  count(*) filter (where adaptive_practice_completed_at is not null) as usuarios_que_completaron_refuerzo
from public.experiment_state
where experiment_id='afei-2026-2-b2c-v1'
  and user_id is not null;

-- 5) Embudo Premium con tasas.
with f as (
  select
    count(*) filter (where minimum_journey_completed_at is not null) as eligible,
    count(*) filter (where premium_selected_at is not null) as selected,
    count(*) filter (where checkout_started_at is not null) as checkout_started,
    count(*) filter (where checkout_details_completed_at is not null) as details_completed,
    count(*) filter (where checkout_confirmed_at is not null) as confirmed
  from public.experiment_state
  where experiment_id='afei-2026-2-b2c-v1' and user_id is not null
)
select *,
  round(100.0*selected/nullif(eligible,0),1) as pct_premium_sobre_elegibles,
  round(100.0*checkout_started/nullif(selected,0),1) as pct_checkout_sobre_premium,
  round(100.0*confirmed/nullif(eligible,0),1) as pct_confirmacion_sobre_elegibles
from f;

-- 6) Dataset individual anonimizado para revisar coherencia.
select
  left(md5(user_id::text),10) as participante,
  first_seen_at,
  triage_completed_at,
  route_viewed_at,
  central_feature_used_at,
  minimum_journey_completed_at,
  adaptive_practice_shown_at,
  adaptive_practice_completed_at,
  premium_selected_at,
  checkout_started_at,
  checkout_details_completed_at,
  checkout_confirmed_at
from public.experiment_state
where experiment_id='afei-2026-2-b2c-v1'
  and user_id is not null
order by first_seen_at;

-- 7) Resultado de la práctica adaptativa (primer intento registrado por usuario/lección).
select
  count(distinct user_id) filter (where event_name='adaptive_practice_shown') as usuarios_con_refuerzo,
  count(distinct user_id) filter (where event_name='adaptive_practice_completed') as usuarios_que_completaron_refuerzo,
  count(distinct user_id) filter (
    where event_name='adaptive_practice_completed'
      and coalesce((properties->>'correct')::boolean,false) = true
  ) as usuarios_que_resolvieron_refuerzo_correctamente
from public.analytics_events
where experiment_id='afei-2026-2-b2c-v1'
  and user_id is not null;

-- 8) Errores iniciales y resolución del refuerzo por lección.
select
  object_id as lesson_id,
  count(distinct user_id) filter (where event_name='adaptive_practice_shown') as recibieron_refuerzo,
  count(distinct user_id) filter (where event_name='adaptive_practice_completed') as completaron_refuerzo,
  count(distinct user_id) filter (
    where event_name='adaptive_practice_completed'
      and coalesce((properties->>'correct')::boolean,false)=true
  ) as completaron_correctamente
from public.analytics_events
where experiment_id='afei-2026-2-b2c-v1'
  and event_name in ('adaptive_practice_shown','adaptive_practice_completed')
  and user_id is not null
group by object_id
order by object_id;

-- 9) Evidencia de personalización del diagnóstico: rutas distintas por perfil.
select
  left(md5(user_id::text),10) as participante,
  level,
  interests,
  recommended_path_ids
from public.triage_results
order by completed_at;

-- 10) Distribución de rutas recomendadas (usuarios únicos).
select
  recommended_path,
  count(*) as usuarios
from public.triage_results,
  unnest(recommended_path_ids) as recommended_path
group by recommended_path
order by usuarios desc, recommended_path;
