// Radiografía financiera (muestra Premium). Todo se calcula en el navegador: ningún monto sale del dispositivo.
import { periodType } from "./goalPeriods";

export const money = (n) => `$${Math.round(Number(n || 0)).toLocaleString("es-CO")}`;

export const RADIOGRAPHY_FIELDS = [
  { key: "income", label: "Ingreso neto mensual", group: "income", required: true },
  { key: "housing", label: "Vivienda y servicios", group: "needs" },
  { key: "transport", label: "Transporte", group: "needs" },
  { key: "groceries", label: "Mercado", group: "needs" },
  { key: "debts", label: "Deudas y cuotas", group: "needs" },
  { key: "food_out", label: "Comida fuera y domicilios", group: "flex" },
  { key: "entertainment", label: "Entretenimiento y suscripciones", group: "flex" },
  { key: "shopping", label: "Compras personales", group: "flex" },
  { key: "savings", label: "Lo que ahorras al mes", group: "savings" },
];
export const FLEX_KEYS = ["food_out", "entertainment", "shopping"];
export const GROUP_COLORS = { needs: "#003ea2", flex: "#449bfd", savings: "#fdbf04", available: "#72b6fd" };
export const PREFILL_LABELS = { simulator: "Tomado de tu simulador", goal: "Según tu meta de límite" };
// Datos de ejemplo (mensuales, COP) para agilizar la muestra. Solo llenan campos vacíos; nunca salen del navegador.
export const EXAMPLE_VALUES = {
  income: "1200000", housing: "350000", transport: "150000", groceries: "200000", debts: "80000",
  food_out: "150000", entertainment: "60000", shopping: "100000", savings: "50000",
};
export function fillWithExample(values = {}) {
  const next = { ...values }, filled = [];
  Object.entries(EXAMPLE_VALUES).forEach(([key, example]) => {
    if (String(values[key] ?? "").trim() === "") { next[key] = example; filled.push(key); }
  });
  return { values: next, filled };
}

const WEEKS_PER_MONTH = 4.33;
// Categorías de las metas de límite (GoalFormPage escribe "Categoría: <etiqueta>. …") y plantillas equivalentes.
const CATEGORY_BY_LABEL = { "Comida fuera": "food_out", "Transporte": "transport", "Entretenimiento": "entertainment", "Compras": "shopping" };
const CATEGORY_BY_TEMPLATE = { template_reduce_entertainment: "entertainment", template_expense_food_week: "food_out" };

export function categoryForLimitGoal(goal) {
  const match = /^Categoría:\s*([^.]+)\./.exec(goal?.description || "");
  if (match && CATEGORY_BY_LABEL[match[1].trim()]) return CATEGORY_BY_LABEL[match[1].trim()];
  return CATEGORY_BY_TEMPLATE[goal?.template_id] || null;
}

// Pre-llenado: comida fuera ← simulador de gastos hormiga; categorías ← metas activas de límite (mensualizadas).
// Deudas y cuotas no se pre-llenan: las metas de deuda guardan saldo, no cuota.
export function buildPrefill({ micro = null, goals = [] } = {}) {
  const values = {}, sources = {};
  const microMonthly = Math.round(Number(micro?.monthly || 0));
  if (Number.isFinite(microMonthly) && microMonthly > 0) { values.food_out = String(microMonthly); sources.food_out = "simulator"; }
  goals.filter((g) => g.status === "active" && g.type === "expense_limit").forEach((g) => {
    const key = categoryForLimitGoal(g);
    const limit = Number(g.target_amount || 0);
    if (!key || values[key] || !(limit > 0)) return;
    const monthly = periodType(g) === "month" ? limit : limit * WEEKS_PER_MONTH;
    values[key] = String(Math.round(monthly)); sources[key] = "goal";
  });
  return { values, sources };
}

// Enteros ≥ 0; vacío = 0. Acepta separador de miles con punto o espacio ("1.200.000", "$ 80 000").
// Devuelve null si el valor no es válido (negativos, decimales con coma, letras).
export function parseAmount(raw) {
  const text = String(raw ?? "").trim().replace(/^\$/, "").replace(/[\s.]/g, "");
  if (text === "") return 0;
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return Number.isSafeInteger(n) ? n : null;
}

export function validateRadiography(rawValues) {
  const numbers = {}, errors = {};
  RADIOGRAPHY_FIELDS.forEach(({ key }) => {
    const n = parseAmount(rawValues[key]);
    if (n === null) errors[key] = "Usa solo números enteros (por ejemplo 250000).";
    else numbers[key] = n;
  });
  if (!errors.income && !(numbers.income > 0)) errors.income = "Escribe tu ingreso neto mensual (mayor que 0).";
  return { numbers, errors, valid: Object.keys(errors).length === 0 };
}

const savingsBucket = (rate) => rate < 0.01 ? "0" : rate < 0.1 ? "<10" : rate <= 0.2 ? "10-20" : ">20";

export function computeRadiography(numbers, { goals = [], triageAnswers = {} } = {}) {
  const v = (key) => Number(numbers[key] || 0);
  const income = v("income");
  const needs = v("housing") + v("transport") + v("groceries") + v("debts");
  const flex = v("food_out") + v("entertainment") + v("shopping");
  const savings = v("savings");
  const available = income - needs - flex - savings;
  const spending = needs + flex;
  const pct = (x) => (income > 0 ? (x / income) * 100 : 0);

  const categories = RADIOGRAPHY_FIELDS.filter((f) => f.group !== "income")
    .map((f) => ({ key: f.key, label: f.label, group: f.group, value: v(f.key) }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const topFlexible = FLEX_KEYS.map((key) => ({ key, label: RADIOGRAPHY_FIELDS.find((f) => f.key === key).label, value: v(key) }))
    .reduce((best, c) => (c.value > (best?.value || 0) ? c : best), null);

  const savingsRate = income > 0 ? savings / income : 0;
  const contribution = savings + Math.max(available, 0);
  const linkedGoals = goals
    .filter((g) => g.status === "active" && ["saving_amount", "debt_payoff"].includes(g.type))
    .map((g) => ({ goal: g, missing: Number(g.target_amount || 0) - Number(g.current_amount || 0) }))
    .filter((x) => x.missing > 0)
    .slice(0, 2);

  const knowsNotSpending = ["q3_a", "q3_b"].includes(triageAnswers?.q3);
  const triedToSave = triageAnswers?.q10_profile_pain === "q10_c";
  const reduceFinding = topFlexible
    ? `Si reduces un 20 % en ${topFlexible.label.toLowerCase()}, liberarías ${money(topFlexible.value * 0.2)} al mes.` : null;

  const findings = [];
  if (knowsNotSpending) findings.push(`Ahora sí sabes: tus gastos suman ${money(spending)} al mes.`);
  if (available < 0) findings.push(`Tus gastos y tu ahorro superan tu ingreso en ${money(-available)} al mes.`);
  if (triedToSave && reduceFinding) findings.push(reduceFinding);
  if (topFlexible) findings.push(`${topFlexible.label} es tu mayor gasto flexible: ${money(topFlexible.value)} al mes, unos ${money(topFlexible.value * 12)} al año.`);
  if (!triedToSave && reduceFinding && savingsRate < 0.1) findings.push(reduceFinding);
  linkedGoals.forEach(({ goal, missing }) => {
    if (contribution > 0) {
      const months = Math.ceil(missing / contribution);
      findings.push(months === 1
        ? `Tu meta '${goal.title}' tomaría 1 mes o menos con ${money(contribution)} al mes.`
        : `Tu meta '${goal.title}' tomaría unos ${months} meses con ${money(contribution)} al mes.`);
    } else findings.push(`Con tus números actuales no queda margen para tu meta '${goal.title}'.`);
  });

  return {
    income, needs, flex, savings, available, spending,
    pct: { needs: pct(needs), flex: pct(flex), savings: pct(savings), available: pct(available) },
    categories, topFlexible,
    findings: findings.slice(0, 3),
    // Solo categorías: esto es lo único que se envía en premium_demo_completed.
    eventProperties: {
      balance: available < 0 ? "negative" : available < income * 0.1 ? "tight" : "healthy",
      savings_rate: savingsBucket(savingsRate),
      top_flexible: topFlexible?.key || "none",
      goals_linked: linkedGoals.length,
    },
  };
}
