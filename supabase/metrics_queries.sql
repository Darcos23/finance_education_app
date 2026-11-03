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

-- ==========================================================================
-- FINPATH V5: CONSULTAS 11 EN ADELANTE (NO altera consultas 1–10)
-- ==========================================================================

-- 11. PMV (35%): aportes registrados por usuario (NO verifican transacciones bancarias).
select g.user_id,
  sum(case when g.type='saving_amount' and e.entry_type='contribution' then e.amount else 0 end) as cop_ahorro_registrado,
  sum(case when g.type='debt_payoff' and e.entry_type='debt_payment' then e.amount else 0 end) as cop_abonos_registrados,
  count(distinct (e.created_at at time zone 'America/Bogota')::date)
    filter (where e.id is not null) as dias_distintos_con_avances
from public.goals g left join public.goal_entries e on e.goal_id=g.id
where g.type in ('saving_amount','debt_payoff')
group by g.user_id;

-- 12. PMV (35%): beneficios AUTODECLARADOS, nunca verificados.
select count(distinct user_id) as usuarios_con_checkin,
  count(*) filter (where helped) as respuestas_positivas,
  sum(approximate_amount_cop) filter (where helped) as cop_beneficio_autodeclarado,
  count(*) filter (where sean_ellis_response='very') as muy_decepcionados,
  count(*) filter (where sean_ellis_response='somewhat') as algo_decepcionados,
  count(*) filter (where sean_ellis_response='not') as nada_decepcionados
from public.benefit_checkins;

-- 13. PMV (35%): aprendizaje pre/post comparable; pre tardíos marcados.
select pre.user_id, pre.score as puntos_pre, post.score as puntos_post,
  post.score-pre.score as diferencia,
  pre.lessons_completed_at_submission as lecciones_antes_del_pre,
  (pre.lessons_completed_at_submission=0) as pre_realmente_inicial
from public.skill_checks pre
join public.skill_checks post on post.user_id=pre.user_id and post.kind='post'
where pre.kind='pre';

-- 14. PMV (35%): uso real en distintos días por usuario (eventos deduplicados).
select user_id,
  count(distinct object_id) as dias_activos,
  min(object_id) as primer_dia, max(object_id) as ultimo_dia
from public.analytics_events
where event_name='active_day' and user_id is not null
group by user_id;

-- 15. PMV (35%): límites de gasto respetados por periodo actual (autoregistros).
-- Para límites semanales, semana ISO lunes-domingo; meses calendario Bogotá.
with bounds as (
  select g.id,g.user_id,g.title,g.target_amount,
    case when g.unit='COP gastados/mes'
      then date_trunc('month',now() at time zone 'America/Bogota')::date
      else date_trunc('week',now() at time zone 'America/Bogota')::date end as desde
  from public.goals g where g.type='expense_limit'
), amounts as (
  select b.*,coalesce(sum(e.amount) filter (where
    (e.created_at at time zone 'America/Bogota')::date>=b.desde),0) as gastos_periodo
  from bounds b left join public.goal_entries e on e.goal_id=b.id and e.entry_type='expense'
  group by b.id,b.user_id,b.title,b.target_amount,b.desde
)
select *,gastos_periodo<=target_amount as limite_respetado from amounts;

-- 16. Go to Market (15%): atribución first-touch por device_id, conteos de personas distintas.
with first_touch as (
  select distinct on(device_id) device_id,
    coalesce(nullif(properties->>'utm_source',''),'direct') as source,
    coalesce(nullif(properties->>'utm_medium',''),'none') as medium,
    coalesce(nullif(properties->>'utm_campaign',''),'none') as campaign
  from public.analytics_events
  where event_name='unique_device_visit'
  order by device_id,created_at
), by_device as (
  select d.device_id,d.source,d.medium,d.campaign,
    max((e.event_name='registration_submitted')::int) as registered,
    max((e.event_name='triage_completed')::int) as triage,
    max((e.event_name='checkout_confirmed')::int) as intent_confirmed
  from first_touch d left join public.analytics_events e on e.device_id=d.device_id
  group by d.device_id,d.source,d.medium,d.campaign
)
select source,medium,campaign,count(*) as dispositivos_visitantes,
  sum(registered) as dispositivos_con_registro,
  sum(triage) as dispositivos_con_diagnostico,
  sum(intent_confirmed) as dispositivos_con_intencion
from by_device group by 1,2,3 order by dispositivos_visitantes desc;
-- Nota: esta consulta es POR DISPOSITIVO; no llamarla usuarios únicos.

-- 17. Go to Market (15%): embudo por origen del registro, una cuenta por usuario.
with registered as (
  select distinct on (user_id) user_id,
    coalesce(nullif(properties->>'utm_source',''),'direct') as source
  from public.analytics_events where event_name='registration_submitted' and user_id is not null
  order by user_id,created_at
), milestones as (
  select user_id,max((triage_completed_at is not null)::int) as triage,
    max((minimum_journey_completed_at is not null)::int) as recorrido,
    max((checkout_confirmed_at is not null)::int) as checkout
  from public.experiment_state where user_id is not null group by user_id
)
select r.source,count(*) as registros,coalesce(sum(m.triage),0) as diagnosticos,
  coalesce(sum(m.recorrido),0) as recorridos_minimos,
  coalesce(sum(m.checkout),0) as intenciones_checkout
from registered r left join milestones m on m.user_id=r.user_id
group by r.source order by registros desc;

-- 18. Intención de compra (20%): intervalos entre hitos, jamás ventas reales.
with timeline as (
  select user_id,
    min(created_at) filter (where event_name='premium_offer_viewed') as oferta,
    min(created_at) filter (where event_name='premium_selected') as seleccion,
    min(created_at) filter (where event_name='checkout_started') as comienzo,
    min(created_at) filter (where event_name='checkout_details_completed') as detalles,
    min(created_at) filter (where event_name='checkout_confirmed') as confirmacion
  from public.analytics_events where user_id is not null group by user_id
)
select *,extract(epoch from(seleccion-oferta)) as segundos_oferta_a_seleccion,
  extract(epoch from(detalles-comienzo)) as segundos_inicio_a_detalles,
  extract(epoch from(confirmacion-detalles)) as segundos_detalles_a_confirmacion
from timeline;

-- 19. Modelo económico (20%): motivos de abandono de checkout por etapa.
select properties->>'reason' as razon, properties->>'step' as etapa,
  count(distinct user_id) as personas_distintas
from public.analytics_events where event_name='checkout_declined'
group by 1,2 order by personas_distintas desc;

-- 20. Perfil objetivo vs intención simulada (20%).
select tr.user_id,tr.answers->>'q8_profile_age' as rango_edad,
  tr.answers->>'q9_profile_occupation' as ocupacion,
  (es.checkout_confirmed_at is not null) as confirmo_intencion_simulada
from public.triage_results tr
left join public.experiment_state es on es.user_id=tr.user_id;

-- 21. Fuente de la primera visualización Premium (15%/20%).
select coalesce(properties->>'source','sin_fuente') as fuente,
  count(distinct user_id) as personas
from public.analytics_events where event_name='premium_offer_viewed'
group by 1 order by personas desc;
