import { supabase } from "../lib/supabase";
import { analytics } from "../lib/analytics";
import { GOAL_TEMPLATES, LEARNING_PATHS, TRIAGE_QUESTIONS } from "../data";

const optionFor = (questionId, optionId) =>
  TRIAGE_QUESTIONS.find((q) => q.id === questionId)?.options.find((o) => o.id === optionId);

export function calculateTriage(answers) {
  const totalScore = Object.entries(answers).reduce(
    (sum, [questionId, optionId]) => sum + Number(optionFor(questionId, optionId)?.score || 0),
    0
  );
  const level = totalScore <= 12 ? "beginner" : totalScore <= 20 ? "intermediate" : "advanced";
  const counts = {};
  Object.entries(answers).forEach(([questionId, optionId]) => {
    const tag = optionFor(questionId, optionId)?.interestTag;
    if (tag) counts[tag] = (counts[tag] || 0) + 1;
  });
  const interests = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag).slice(0, 4);
  const matches = LEARNING_PATHS.filter(
    (path) => path.level === level || path.tags.some((tag) => interests.includes(tag))
  );
  const recommendedPathIds = [...new Map((matches.length ? matches : LEARNING_PATHS).map((p) => [p.id, p])).values()]
    .slice(0, 3).map((p) => p.id);
  const goalMatches = GOAL_TEMPLATES.filter(
    (template) => template.suggestedLevel === level || template.tags.some((tag) => interests.includes(tag))
  );
  const recommendedGoalTemplateIds = [...new Map(goalMatches.map((g) => [g.id, g])).values()]
    .slice(0, 4).map((g) => g.id);
  return { totalScore, level, interests, recommendedPathIds, recommendedGoalTemplateIds };
}

export const appService = {
  async saveTriage(user, answers) {
    const result = calculateTriage(answers);
    const payload = {
      user_id: user.id,
      answers,
      total_score: result.totalScore,
      level: result.level,
      interests: result.interests,
      recommended_path_ids: result.recommendedPathIds,
      recommended_goal_template_ids: result.recommendedGoalTemplateIds,
      completed_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("triage_results")
      .upsert(payload, { onConflict: "user_id" }).select().single();
    if (error) throw error;
    await analytics.once("triage_completed", { user, properties: { level: result.level } });
    return data;
  },

  async getTriage(userId) {
    const { data, error } = await supabase.from("triage_results").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getLessonProgress(userId) {
    const { data, error } = await supabase.from("lesson_progress").select("*").eq("user_id", userId);
    if (error) throw error;
    return data || [];
  },

  async upsertLessonProgress(user, { lessonId, pathId, status, currentStep = 0, score = null, errorTags = [] }) {
    const now = new Date().toISOString();
    const existing = await supabase.from("lesson_progress").select("id,started_at,completed_at,status")
      .eq("user_id", user.id).eq("lesson_id", lessonId).maybeSingle();
    if (existing.error) throw existing.error;
    const payload = {
      user_id: user.id,
      lesson_id: lessonId,
      path_id: pathId,
      status,
      current_step: currentStep,
      score,
      error_tags: errorTags,
      started_at: existing.data?.started_at || now,
      completed_at: status === "completed" ? (existing.data?.completed_at || now) : null,
      updated_at: now,
    };
    const { data, error } = await supabase.from("lesson_progress")
      .upsert(payload, { onConflict: "user_id,lesson_id" }).select().single();
    if (error) throw error;

    if (status === "completed" && existing.data?.status !== "completed") {
      const { data: lessonGoals } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "lesson_completion")
        .eq("status", "active");
      for (const goal of lessonGoals || []) {
        const nextValue = Number(goal.current_value || 0) + 1;
        await supabase.from("goals").update({
          current_value: nextValue,
          status: Number(goal.target_value || 0) > 0 && nextValue >= Number(goal.target_value) ? "completed" : "active",
          updated_at: now,
        }).eq("id", goal.id).eq("user_id", user.id);
      }
    }

    return data;
  },

  async createGoal(user, values) {
    const payload = {
      user_id: user.id,
      template_id: values.templateId || null,
      title: values.title,
      description: values.description || "",
      type: values.type || "saving_amount",
      target_amount: Number(values.targetAmount || 0),
      current_amount: Number(values.currentAmount || 0),
      target_value: Number(values.targetValue || 0),
      current_value: Number(values.currentValue || 0),
      unit: values.unit || null,
      target_date: values.targetDate || null,
      status: "active",
    };
    const { data, error } = await supabase.from("goals").insert(payload).select().single();
    if (error) throw error;
    await analytics.once("goal_created", { user, objectType: "goal", objectId: data.id, properties: { type: data.type } });
    return data;
  },



  async createGoalFromTemplate(user, template) {
    const values = {
      templateId: template.id,
      title: template.title,
      description: template.description,
      type: template.type,
      targetAmount: ["saving_amount", "expense_limit"].includes(template.type)
        ? Number(template.defaultTargetAmount || 0)
        : 0,
      targetValue: template.type === "habit_streak"
        ? Number(template.defaultDurationDays || 0)
        : template.type === "lesson_completion"
          ? Number(template.defaultTargetLessons || 0)
          : 0,
      unit: template.type === "habit_streak"
        ? "días"
        : template.type === "lesson_completion"
          ? "lecciones"
          : template.type === "expense_limit"
            ? "COP gastados"
            : "COP ahorrados",
    };
    return this.createGoal(user, values);
  },

  async getGoals(userId) {
    const { data, error } = await supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addGoalProgress(user, goal, amount = 0) {
    const value = Number(amount || 0);
    const now = new Date().toISOString();
    const updates = { updated_at: now };
    let entryAmount = value;

    if (goal.type === "saving_amount") {
      const next = Number(goal.current_amount || 0) + value;
      updates.current_amount = next;
      updates.status = Number(goal.target_amount || 0) > 0 && next >= Number(goal.target_amount) ? "completed" : "active";
    } else if (goal.type === "expense_limit") {
      updates.current_amount = Number(goal.current_amount || 0) + value;
      updates.status = "active";
    } else if (goal.type === "habit_streak") {
      const next = Math.min(Number(goal.target_value || 0), Number(goal.current_value || 0) + 1);
      updates.current_value = next;
      updates.status = Number(goal.target_value || 0) > 0 && next >= Number(goal.target_value) ? "completed" : "active";
      entryAmount = 1;
    } else {
      return goal;
    }

    const { data, error } = await supabase.from("goals").update(updates)
      .eq("id", goal.id).eq("user_id", user.id).select().single();
    if (error) throw error;

    await supabase.from("goal_entries").insert({
      goal_id: goal.id,
      user_id: user.id,
      amount: entryAmount,
      entry_type: goal.type === "habit_streak" ? "check_in" : goal.type === "expense_limit" ? "expense" : "contribution",
    });
    await analytics.once("goal_progress_registered", { user, objectType: "goal", objectId: goal.id });
    return data;
  },

  async saveSimulatorRun(user, simulatorId, resultCode) {
    const { error } = await supabase.from("simulator_runs").insert({
      user_id: user.id,
      simulator_id: simulatorId,
      result_code: resultCode,
    });
    if (error) throw error;
    await analytics.once("simulator_completed", { user, objectType: "simulator", objectId: simulatorId, properties: { result_code: resultCode } });
  },

  async getExperimentState(userId) {
    const { data, error } = await supabase.from("experiment_state").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data;
  },

  async startCheckout(user, actorKey, paymentMethod = null) {
    const { data, error } = await supabase.from("premium_checkout_attempts").insert({
      user_id: user.id,
      actor_key: actorKey,
      offer_price: 9000,
      payment_method: paymentMethod,
      status: "started",
    }).select().single();
    if (error) throw error;
    await analytics.once("checkout_started", { user });
    return data;
  },

  async updateCheckout(user, attemptId, updates) {
    const { data, error } = await supabase.from("premium_checkout_attempts").update(updates)
      .eq("id", attemptId).eq("user_id", user.id).select().single();
    if (error) throw error;
    return data;
  },
};
