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

-- ==========================================================================================
-- EXPERIMENTO 3 y 4 de noviembre de 2026 · Consultas 22 a 31 (v7)
-- ------------------------------------------------------------------------------------------
-- ANTES DE USARLAS, EL EQUIPO DEBE REEMPLAZAR EN CADA CONSULTA:
--   1) la fecha de inicio del experimento en `params` (hoy: 2026-11-03 07:00 hora de Colombia);
--   2) los correos de las cuentas de prueba en `excluidos` ('PRUEBA1@...','PRUEBA2@...').
-- Participante real = cuenta creada en auth.users desde `inicio` y que no está en `excluidos`.
-- Filtro de fecha por tabla: auth.users.created_at (registro) y analytics_events.created_at (eventos).
-- triage_results no tiene created_at (usa completed_at) y experiment_state tampoco: se filtran a través
-- de la lista de participantes. Ningún monto escrito por el usuario se guarda; solo categorías y decisiones.
-- Claves del diagnóstico en triage_results.answers: q8_profile_age, q9_profile_occupation, q10_profile_pain.
-- Las cuentas con diagnóstico anterior a esta versión no tienen q10 (aparece como "sin dato").
-- ==========================================================================================

-- 22. Embudo completo por participante (PMV y evidencia de entrega de valor, 30 %; venta, 20 %).
-- Una fila por persona con su código FP-XXXXXX (el mismo de la pantalla de cierre), perfil y cada etapa (1 = la alcanzó).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
participantes as (
  select u.id as user_id, u.created_at as registrado_en
  from auth.users u
  where u.created_at >= (select inicio from params) and u.id not in (select id from excluidos)
),
ev as (
  select e.* from public.analytics_events e join participantes p on p.user_id = e.user_id
  where e.created_at >= (select inicio from params)
),
opciones(clave, etiqueta) as (values
  ('q8_a','18–24'),('q8_b','25–34'),('q8_c','35–54'),('q8_d','55+'),
  ('q9_a','Estudiante'),('q9_b','Empleado'),('q9_c','Independiente'),('q9_d','Estudia y trabaja'),('q9_e','Otro'),
  ('q10_a','Se quedó sin plata'),('q10_b','No supo en qué se fue'),('q10_c','Intentó ahorrar y no pudo'),
  ('q10_d','Intereses/cuotas poco claras'),('q10_e','Ninguna')),
hitos as (
  select user_id,
    max((event_name = 'triage_completed')::int) as diagnostico,
    max((event_name = 'lesson_completed')::int) as leccion,
    max((event_name = 'goal_created')::int) as meta,
    max((event_name = 'simulator_completed')::int) as simulador,
    max((event_name = 'premium_offer_viewed')::int) as oferta_vista,
    max((event_name = 'premium_demo_completed')::int) as muestra_completada,
    max((event_name = 'premium_selected')::int) as selecciono_premium,
    max((event_name = 'checkout_details_completed')::int) as datos_completados,
    max((event_name = 'checkout_confirmed')::int) as confirmo,
    max((event_name in ('premium_declined','checkout_declined'))::int) as rechazo,
    string_agg(case when event_name = 'premium_declined' then 'oferta:' || coalesce(properties->>'stage','?')
                    when event_name = 'checkout_declined' then 'checkout_paso_' || coalesce(properties->>'step','?') end, ', ') as etapa_rechazo,
    max((event_name = 'exit_survey_submitted')::int) as encuesta
  from ev group by user_id
)
select 'FP-' || upper(left(p.user_id::text, 6)) as codigo,
  p.registrado_en,
  coalesce(o8.etiqueta, 'sin dato') as edad,
  coalesce(o9.etiqueta, 'sin dato') as ocupacion,
  coalesce(o10.etiqueta, 'sin dato') as dolor,
  1 as registro,
  coalesce(h.diagnostico, (t.user_id is not null)::int) as diagnostico,
  coalesce(h.leccion,0) as leccion, coalesce(h.meta,0) as meta, coalesce(h.simulador,0) as simulador,
  coalesce(h.oferta_vista,0) as oferta_vista, coalesce(h.muestra_completada,0) as muestra_completada,
  coalesce(h.selecciono_premium,0) as selecciono_premium, coalesce(h.datos_completados,0) as datos_completados,
  coalesce(h.confirmo,0) as confirmo, coalesce(h.rechazo,0) as rechazo, h.etapa_rechazo,
  coalesce(h.encuesta,0) as encuesta
from participantes p
left join hitos h on h.user_id = p.user_id
left join public.triage_results t on t.user_id = p.user_id
left join opciones o8 on o8.clave = t.answers->>'q8_profile_age'
left join opciones o9 on o9.clave = t.answers->>'q9_profile_occupation'
left join opciones o10 on o10.clave = t.answers->>'q10_profile_pain'
order by p.registrado_en;

-- 23. Resumen del embudo: personas distintas por etapa, % sobre registrados y % sobre la etapa anterior
-- (PMV 30 %; evidencia de intento de pago 20 %).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
participantes as (
  select u.id as user_id from auth.users u
  where u.created_at >= (select inicio from params) and u.id not in (select id from excluidos)
),
ev as (
  select e.user_id, e.event_name from public.analytics_events e join participantes p on p.user_id = e.user_id
  where e.created_at >= (select inicio from params)
),
etapas(orden, etapa, eventos, secuencial) as (values
  (1,'Registro', array['__registro__'], true),
  (2,'Diagnóstico', array['triage_completed'], true),
  (3,'Lección completada', array['lesson_completed'], true),
  (4,'Meta creada', array['goal_created'], false),
  (5,'Simulador', array['simulator_completed'], false),
  (6,'Oferta Premium vista', array['premium_offer_viewed'], true),
  (7,'Muestra Premium completada', array['premium_demo_completed'], false),
  (8,'Seleccionó Premium', array['premium_selected'], true),
  (9,'Datos de pago completados', array['checkout_details_completed'], true),
  (10,'Confirmó compra (simulada)', array['checkout_confirmed'], true),
  (11,'Rechazó con motivo', array['premium_declined','checkout_declined'], false),
  (12,'Encuesta final', array['exit_survey_submitted'], false)),
conteos as (
  select s.orden, s.etapa, s.secuencial,
    case when s.orden = 1 then (select count(*) from participantes)
         else (select count(distinct ev.user_id) from ev where ev.event_name = any(s.eventos)) end as personas
  from etapas s
),
cadena as (
  select orden, round(100.0 * personas / nullif(lag(personas) over (order by orden), 0), 1) as pct_sobre_etapa_anterior
  from conteos where secuencial
)
select c.orden, c.etapa, c.personas,
  round(100.0 * c.personas / nullif((select count(*) from participantes), 0), 1) as pct_sobre_registrados,
  k.pct_sobre_etapa_anterior
from conteos c left join cadena k on k.orden = c.orden order by c.orden;
-- % sobre la etapa anterior solo en la cadena principal (registro → diagnóstico → lección → oferta → selección →
-- datos → confirmación). Meta, simulador, muestra, rechazo y encuesta son pasos laterales: solo % sobre registrados.

-- 24. Motivos de rechazo combinados (Modelo económico 25 %; venta 20 %): oferta (offer / after_demo)
-- y checkout (paso 1, 2 o 3), en personas distintas. Una persona puede aparecer en más de un origen.
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
rechazos as (
  select e.user_id,
    case when e.event_name = 'premium_declined' then 'oferta' else 'checkout' end as origen,
    case when e.event_name = 'premium_declined' then coalesce(e.properties->>'stage','?')
         else 'paso_' || coalesce(e.properties->>'step','?') end as etapa,
    coalesce(nullif(e.properties->>'reason',''), 'sin_motivo') as motivo
  from public.analytics_events e
  where e.event_name in ('premium_declined','checkout_declined')
    and e.created_at >= (select inicio from params)
    and e.user_id not in (select id from excluidos)
    and e.user_id in (select id from auth.users where created_at >= (select inicio from params))
)
select origen, etapa, motivo, count(distinct user_id) as personas_distintas,
  round(100.0 * count(distinct user_id) / nullif((select count(distinct user_id) from rechazos), 0), 1) as pct_de_personas_que_rechazaron
from rechazos group by grouping sets ((origen, etapa, motivo), (motivo))
order by origen nulls last, etapa nulls last, personas_distintas desc;
-- Las filas con origen/etapa vacíos son el total por motivo (personas distintas en cualquier punto de rechazo).
-- Motivos: price_high, not_now, trust, more_free, not_valuable, other.

-- 25. Efecto de la muestra Premium (PMV 30 %; venta 20 %): entre quienes VIERON la oferta,
-- tasa de selección y de confirmación según si completaron o no la radiografía gratuita.
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
participantes as (
  select u.id as user_id from auth.users u
  where u.created_at >= (select inicio from params) and u.id not in (select id from excluidos)
),
por_persona as (
  select e.user_id,
    max((e.event_name = 'premium_offer_viewed')::int) as vio_oferta,
    max((e.event_name = 'premium_demo_completed')::int) as muestra,
    max((e.event_name = 'premium_selected')::int) as selecciono,
    max((e.event_name = 'checkout_confirmed')::int) as confirmo,
    max((e.event_name in ('premium_declined','checkout_declined'))::int) as rechazo
  from public.analytics_events e join participantes p on p.user_id = e.user_id
  where e.created_at >= (select inicio from params)
  group by e.user_id
)
select case when muestra = 1 then 'Completó la muestra' else 'No completó la muestra' end as grupo,
  count(*) as personas_que_vieron_oferta,
  sum(selecciono) as seleccionaron_premium,
  round(100.0 * sum(selecciono) / nullif(count(*), 0), 1) as pct_seleccion,
  sum(confirmo) as confirmaron,
  round(100.0 * sum(confirmo) / nullif(count(*), 0), 1) as pct_confirmacion,
  sum(rechazo) as rechazaron_con_motivo
from por_persona where vio_oferta = 1
group by 1 order by 1;
-- Con muestras pequeñas, reportar conteos absolutos junto al porcentaje; no es un experimento aleatorizado.

-- 26a. Encuesta final · Sean Ellis (PMV 30 %): distribución y % "muy decepcionado" (umbral de referencia: 40 %).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
encuesta as (
  select distinct on (e.user_id) e.user_id, e.properties as p
  from public.analytics_events e join auth.users u on u.id = e.user_id
  where e.event_name = 'exit_survey_submitted'
    and e.created_at >= (select inicio from params) and u.created_at >= (select inicio from params)
    and e.user_id not in (select id from excluidos)
  order by e.user_id, e.created_at
)
select coalesce(p->>'sean_ellis','sin_respuesta') as sean_ellis, count(*) as personas,
  round(100.0 * count(*) / nullif(sum(count(*)) over (), 0), 1) as pct
from encuesta group by 1
order by min(case p->>'sean_ellis' when 'very' then 1 when 'somewhat' then 2 when 'not' then 3 else 4 end);

-- 26b. Encuesta final · % que descubrió algo nuevo de sus finanzas (PMV 30 %: evidencia de valor entregado).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
encuesta as (
  select distinct on (e.user_id) e.user_id, e.properties as p
  from public.analytics_events e join auth.users u on u.id = e.user_id
  where e.event_name = 'exit_survey_submitted'
    and e.created_at >= (select inicio from params) and u.created_at >= (select inicio from params)
    and e.user_id not in (select id from excluidos)
  order by e.user_id, e.created_at
)
select count(*) as encuestas,
  count(*) filter (where (p->>'discovered')::boolean) as descubrieron_algo,
  round(100.0 * count(*) filter (where (p->>'discovered')::boolean) / nullif(count(*), 0), 1) as pct_descubrieron,
  count(*) filter (where p->>'sean_ellis' = 'very') as muy_decepcionados,
  round(100.0 * count(*) filter (where p->>'sean_ellis' = 'very') / nullif(count(*), 0), 1) as pct_muy_decepcionados
from encuesta;

-- 26c. Encuesta final · textos para análisis cualitativo (PMV 30 %; mejoras a partir del uso).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...'))
select 'FP-' || upper(left(e.user_id::text, 6)) as codigo,
  e.properties->>'decision' as decision,
  e.properties->>'sean_ellis' as sean_ellis,
  nullif(e.properties->>'discovered_text','') as que_descubrio,
  nullif(e.properties->>'will_do','') as que_hara_distinto
from public.analytics_events e join auth.users u on u.id = e.user_id
where e.event_name = 'exit_survey_submitted'
  and e.created_at >= (select inicio from params) and u.created_at >= (select inicio from params)
  and e.user_id not in (select id from excluidos)
  and (nullif(e.properties->>'discovered_text','') is not null or nullif(e.properties->>'will_do','') is not null)
order by e.created_at;

-- 27a. Rango de precio por participante (Modelo económico 25 %): las 4 respuestas de sensibilidad al precio (COP/mes).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...'))
select 'FP-' || upper(left(e.user_id::text, 6)) as codigo,
  (e.properties->>'price_too_cheap')::numeric as demasiado_barato,
  (e.properties->>'price_cheap')::numeric as barato,
  (e.properties->>'price_expensive')::numeric as caro,
  (e.properties->>'price_too_expensive')::numeric as demasiado_caro,
  ((e.properties->>'price_too_cheap')::numeric <= (e.properties->>'price_cheap')::numeric
    and (e.properties->>'price_cheap')::numeric <= (e.properties->>'price_expensive')::numeric
    and (e.properties->>'price_expensive')::numeric <= (e.properties->>'price_too_expensive')::numeric) as orden_coherente,
  e.properties->>'decision' as decision
from public.analytics_events e join auth.users u on u.id = e.user_id
where e.event_name = 'exit_survey_submitted'
  and e.created_at >= (select inicio from params) and u.created_at >= (select inicio from params)
  and e.user_id not in (select id from excluidos)
order by e.created_at;

-- 27b. Rango de precio agregado (Modelo económico 25 %): mediana de cada pregunta y % de personas
-- para quienes $9.000 queda entre "barato" y "caro" (ambos inclusive).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
precios as (
  select distinct on (e.user_id)
    (e.properties->>'price_too_cheap')::numeric as a, (e.properties->>'price_cheap')::numeric as b,
    (e.properties->>'price_expensive')::numeric as c, (e.properties->>'price_too_expensive')::numeric as d
  from public.analytics_events e join auth.users u on u.id = e.user_id
  where e.event_name = 'exit_survey_submitted'
    and e.created_at >= (select inicio from params) and u.created_at >= (select inicio from params)
    and e.user_id not in (select id from excluidos)
  order by e.user_id, e.created_at
)
select count(*) as respuestas,
  percentile_cont(0.5) within group (order by a) as mediana_demasiado_barato,
  percentile_cont(0.5) within group (order by b) as mediana_barato,
  percentile_cont(0.5) within group (order by c) as mediana_caro,
  percentile_cont(0.5) within group (order by d) as mediana_demasiado_caro,
  count(*) filter (where 9000 between b and c) as personas_9000_entre_barato_y_caro,
  round(100.0 * count(*) filter (where 9000 between b and c) / nullif(count(*), 0), 1) as pct_9000_entre_barato_y_caro
from precios;

-- 28. Modalidad presencial vs. virtual (Go to Market 15 %): embudo por el `ref` del enlace de reclutamiento.
-- Fuente: properties->>'ref' de registration_submitted; si falta, el de triage_completed (también guarda el first-touch)
-- y, por último, el de unique_device_visit del mismo dispositivo.
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
participantes as (
  select u.id as user_id from auth.users u
  where u.created_at >= (select inicio from params) and u.id not in (select id from excluidos)
),
registro as (
  select distinct on (e.user_id) e.user_id, e.device_id, nullif(e.properties->>'ref','') as ref
  from public.analytics_events e join participantes p on p.user_id = e.user_id
  where e.event_name = 'registration_submitted'
  order by e.user_id, e.created_at
),
diagnostico as (
  select distinct on (e.user_id) e.user_id, e.device_id, nullif(e.properties->>'ref','') as ref
  from public.analytics_events e join participantes p on p.user_id = e.user_id
  where e.event_name = 'triage_completed'
  order by e.user_id, e.created_at
),
visita as (
  select distinct on (device_id) device_id, nullif(properties->>'ref','') as ref
  from public.analytics_events where event_name = 'unique_device_visit'
  order by device_id, created_at
),
modalidad as (
  select p.user_id, coalesce(r.ref, d.ref, v.ref, 'sin ref') as modalidad
  from participantes p
  left join registro r on r.user_id = p.user_id
  left join diagnostico d on d.user_id = p.user_id
  left join visita v on v.device_id = coalesce(r.device_id, d.device_id)
),
por_persona as (
  select m.modalidad, m.user_id,
    max((e.event_name = 'triage_completed')::int) as diagnostico,
    max((e.event_name = 'lesson_completed')::int) as leccion,
    max((e.event_name = 'premium_offer_viewed')::int) as oferta,
    max((e.event_name = 'premium_demo_completed')::int) as muestra,
    max((e.event_name = 'premium_selected')::int) as selecciono,
    max((e.event_name = 'checkout_confirmed')::int) as confirmo,
    max((e.event_name in ('premium_declined','checkout_declined'))::int) as rechazo,
    max((e.event_name = 'exit_survey_submitted')::int) as encuesta
  from modalidad m left join public.analytics_events e
    on e.user_id = m.user_id and e.created_at >= (select inicio from params)
  group by m.modalidad, m.user_id
)
select modalidad, count(*) as registrados,
  sum(diagnostico) as diagnostico, sum(leccion) as leccion, sum(oferta) as oferta_vista, sum(muestra) as muestra,
  sum(selecciono) as selecciono_premium, sum(confirmo) as confirmo,
  round(100.0 * sum(confirmo) / nullif(count(*), 0), 1) as pct_confirmo_sobre_registrados,
  sum(rechazo) as rechazo_con_motivo, sum(encuesta) as encuesta,
  round(100.0 * sum(encuesta) / nullif(count(*), 0), 1) as pct_completaron_recorrido
from por_persona group by modalidad order by registrados desc;

-- 29a. Modo guía (PMV 30 %: mejora aplicada a partir del uso): quién la siguió, quién la desactivó y
-- la tasa de finalización del recorrido (encuesta enviada) en cada grupo.
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
participantes as (
  select u.id as user_id from auth.users u
  where u.created_at >= (select inicio from params) and u.id not in (select id from excluidos)
),
por_persona as (
  select p.user_id,
    bool_or(e.event_name = 'guide_started') as empezo,
    bool_or(e.event_name = 'guide_disabled' and e.properties->>'at' = 'welcome') as desactivo_bienvenida,
    bool_or(e.event_name = 'guide_disabled' and e.properties->>'at' <> 'welcome') as desactivo_despues,
    bool_or(e.event_name = 'guide_reenabled') as reactivo,
    bool_or(e.event_name = 'guide_completed') as completo_guia,
    bool_or(e.event_name = 'exit_survey_submitted') as encuesta
  from participantes p left join public.analytics_events e
    on e.user_id = p.user_id and e.created_at >= (select inicio from params)
  group by p.user_id
)
select case
    when completo_guia then '1. Siguió la guía hasta el final'
    when desactivo_bienvenida and not coalesce(reactivo,false) then '3. Exploró por su cuenta desde la bienvenida'
    when desactivo_despues then '4. Desactivó la guía a mitad del recorrido'
    when empezo or reactivo then '2. Siguió la guía (aún sin terminar)'
    else '5. Sin interacción con la guía' end as grupo,
  count(*) as personas,
  count(*) filter (where encuesta) as completaron_recorrido,
  round(100.0 * count(*) filter (where encuesta) / nullif(count(*), 0), 1) as pct_finalizacion
from por_persona group by 1 order by 1;
-- guide_completed solo se registra si la guía estaba activa al enviar la encuesta: distingue
-- "siguió la guía" de "llegó por su cuenta" (estos últimos suman en completaron_recorrido de otros grupos).

-- 29b. Modo guía: en qué lugar y en qué paso se desactivó (personas distintas).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...'))
select e.properties->>'at' as donde, coalesce(e.properties->>'step', '—') as paso,
  count(distinct e.user_id) as personas_distintas
from public.analytics_events e join auth.users u on u.id = e.user_id
where e.event_name = 'guide_disabled'
  and e.created_at >= (select inicio from params) and u.created_at >= (select inicio from params)
  and e.user_id not in (select id from excluidos)
group by 1, 2 order by personas_distintas desc;

-- 30. Perfil objetivo frente a decisión final (Evidencia de venta 20 %: solo cuenta si el comprador es del perfil).
-- Ajusta `perfil_objetivo` si el equipo define otro segmento (hoy: 18–34 años).
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
participantes as (
  select u.id as user_id from auth.users u
  where u.created_at >= (select inicio from params) and u.id not in (select id from excluidos)
),
opciones(clave, etiqueta) as (values
  ('q8_a','18–24'),('q8_b','25–34'),('q8_c','35–54'),('q8_d','55+'),
  ('q9_a','Estudiante'),('q9_b','Empleado'),('q9_c','Independiente'),('q9_d','Estudia y trabaja'),('q9_e','Otro'),
  ('q10_a','Se quedó sin plata'),('q10_b','No supo en qué se fue'),('q10_c','Intentó ahorrar y no pudo'),
  ('q10_d','Intereses/cuotas poco claras'),('q10_e','Ninguna')),
decision as (
  select p.user_id,
    case when bool_or(e.event_name = 'checkout_confirmed') then '1. Confirmó compra (simulada)'
         when bool_or(e.event_name = 'premium_declined') then '3. Rechazó en la oferta'
         when bool_or(e.event_name = 'checkout_declined') then '4. Rechazó en el checkout'
         when bool_or(e.event_name = 'premium_selected') then '2. Seleccionó, sin cerrar'
         else '5. Sin decisión' end as decision_final
  from participantes p left join public.analytics_events e
    on e.user_id = p.user_id and e.created_at >= (select inicio from params)
  group by p.user_id
)
select coalesce(o8.etiqueta,'sin dato') as edad, coalesce(o9.etiqueta,'sin dato') as ocupacion,
  coalesce(o10.etiqueta,'sin dato') as dolor,
  (t.answers->>'q8_profile_age' in ('q8_a','q8_b')) as perfil_objetivo,
  d.decision_final, count(*) as personas
from decision d
left join public.triage_results t on t.user_id = d.user_id
left join opciones o8 on o8.clave = t.answers->>'q8_profile_age'
left join opciones o9 on o9.clave = t.answers->>'q9_profile_occupation'
left join opciones o10 on o10.clave = t.answers->>'q10_profile_pain'
group by 1, 2, 3, 4, 5 order by d.decision_final, personas desc;

-- 31. Práctica adaptativa por participante real (PMV 30 %): error → refuerzo → resolución.
-- Reemplaza la evaluación pre/post como evidencia de aprendizaje aplicado.
with params as (select timestamptz '2026-11-03 07:00:00-05' as inicio),
excluidos as (select id from auth.users where email in ('PRUEBA1@...','PRUEBA2@...')),
participantes as (
  select u.id as user_id from auth.users u
  where u.created_at >= (select inicio from params) and u.id not in (select id from excluidos)
),
por_persona as (
  select p.user_id,
    count(distinct e.object_id) filter (where e.event_name = 'lesson_completed') as lecciones_completadas,
    count(distinct e.object_id) filter (where e.event_name = 'adaptive_practice_shown') as refuerzos_recibidos,
    count(distinct e.object_id) filter (where e.event_name = 'adaptive_practice_completed') as refuerzos_resueltos,
    count(distinct e.object_id) filter (where e.event_name = 'adaptive_practice_completed'
      and (e.properties->>'correct')::boolean) as refuerzos_correctos,
    string_agg(distinct e.properties->>'skill_tag', ', ') filter (where e.event_name = 'adaptive_practice_shown') as habilidades_reforzadas
  from participantes p left join public.analytics_events e
    on e.user_id = p.user_id and e.created_at >= (select inicio from params)
  group by p.user_id
)
select 'FP-' || upper(left(user_id::text, 6)) as codigo, lecciones_completadas, refuerzos_recibidos,
  refuerzos_resueltos, refuerzos_correctos, habilidades_reforzadas
from por_persona order by refuerzos_recibidos desc, codigo;
-- Agregado sugerido: personas con refuerzo recibido, % que lo resolvió y % que lo resolvió correctamente
-- (sumar las columnas de esta consulta; cada refuerzo se cuenta una vez por lección y persona).
