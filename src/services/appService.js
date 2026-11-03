import { supabase } from "../lib/supabase";
import { analytics } from "../lib/analytics";
import { bogotaDay } from "../lib/streak";
import { getFirstTouch } from "../lib/attribution";
import { GOAL_TEMPLATES, LEARNING_PATHS, TRIAGE_QUESTIONS } from "../data";

const optionFor = (questionId, optionId) =>
  TRIAGE_QUESTIONS.find((q) => q.id === questionId && !q.profileOnly)?.options.find((o) => o.id === optionId);

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
    await analytics.once("triage_completed", { user, properties: { level: result.level, ...getFirstTouch() } });
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
    const existing = await supabase.from("lesson_progress").select("id,started_at,completed_at,status,error_tags,score")
      .eq("user_id", user.id).eq("lesson_id", lessonId).maybeSingle();
    if (existing.error) throw existing.error;
    const payload = {
      user_id: user.id,
      lesson_id: lessonId,
      path_id: pathId,
      status: existing.data?.status === "completed" ? "completed" : status,
      current_step: currentStep,
      score: existing.data?.status === 'completed' ? (existing.data?.score ?? score) : (status === 'completed' ? score : (existing.data?.score ?? score)),
      error_tags: [...new Set([...(existing.data?.error_tags || []), ...errorTags])],
      started_at: existing.data?.started_at || now,
      completed_at: existing.data?.completed_at || (status === "completed" ? now : null),
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

    if (status === "completed") await this.recordActiveDay(user);
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
    await analytics.once("goal_created", { user, objectType: "goal", objectId: data.id, properties: { type: data.type, ...(values.source ? {source: values.source} : {}) } });
    return data;
  },



  async createGoalFromTemplate(user, template, source = null) {
    const duration=Number(template.defaultDurationDays || 0);
    const targetDate=duration ? new Date(Date.now()+duration*86400000).toISOString().slice(0,10) : null;
    const values={
      templateId:template.id,title:template.title,description:template.description,type:template.type,
      targetAmount:["saving_amount","expense_limit","debt_payoff"].includes(template.type) ? Number(template.defaultTargetAmount||0) : 0,
      targetValue:template.type==="habit_streak"?duration:template.type==="lesson_completion"?Number(template.defaultTargetLessons||0):0,
      unit:template.type==="habit_streak"?"días":template.type==="lesson_completion"?"lecciones":
        template.type==="expense_limit" ? (duration>=28?'COP gastados/mes':'COP gastados/semana'):
        template.type==="debt_payoff" ? "COP abonados" : "COP ahorrados",
      targetDate: template.type==='expense_limit'?null:targetDate,source
    };
    return this.createGoal(user,values);
  },

  async getGoals(userId) {
    const { data, error } = await supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addGoalProgress(user, goal, amount = 0) {
    if (goal.status !== "active") throw new Error("Esta meta no está activa.");
    const value=goal.type==='habit_streak'?1:Number(amount);
    if (!Number.isFinite(value) || value <= 0) throw new Error("Introduce un avance positivo.");
    if(goal.type==='habit_streak'){
      const {data:previous,error:previousError}=await supabase.from('goal_entries').select('created_at')
        .eq('user_id',user.id).eq('goal_id',goal.id).eq('entry_type','check_in')
        .order('created_at',{ascending:false}).limit(1);
      if(previousError)throw previousError;
      if(previous?.length && bogotaDay(previous[0].created_at)===bogotaDay())
        throw new Error('Ya registraste este hábito hoy. Puedes volver mañana.');
    }
    const now=new Date().toISOString(),updates={updated_at:now};
    if(["saving_amount","debt_payoff","expense_limit"].includes(goal.type)) {
      const next=Number(goal.current_amount||0)+value;
      updates.current_amount=next;
      updates.status=goal.type==='expense_limit'?'active':
        (Number(goal.target_amount||0)>0 && next>=Number(goal.target_amount)?'completed':'active');
    } else if(goal.type==='habit_streak'){
      const next=Math.min(Number(goal.target_value||0),Number(goal.current_value||0)+1);
      updates.current_value=next;
      updates.status=next>=Number(goal.target_value||0)?'completed':'active';
    } else return goal;
    const type=goal.type==='expense_limit'?'expense':goal.type==='habit_streak'?'check_in':
      goal.type==='debt_payoff'?'debt_payment':'contribution';
    // Inserta el movimiento primero. Si falla, no incrementa el total de la meta.
    const {data:entry,error:entryError}=await supabase.from('goal_entries').insert({
      goal_id:goal.id,user_id:user.id,amount:value,entry_type:type
    }).select().single();
    if(entryError)throw entryError;
    const {data,error}=await supabase.from('goals').update(updates)
      .eq('id',goal.id).eq('user_id',user.id).select().single();
    if(error){await supabase.from('goal_entries').delete().eq('id',entry.id).eq('user_id',user.id);throw error;}
    await analytics.once('goal_progress_registered',{user,objectType:'goal',objectId:goal.id});
    await this.recordActiveDay(user);
    return data;
  },

  async archiveGoal(user,goalId){
    const {data,error}=await supabase.from('goals').update({status:'archived',updated_at:new Date().toISOString()})
      .eq('id',goalId).eq('user_id',user.id).select().single();
    if(error)throw error;return data;
  },

  async undoLastGoalEntry(user,goal){
    const {data:entry,error:firstError}=await supabase.from('goal_entries').select('*')
      .eq('goal_id',goal.id).eq('user_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
    if(firstError)throw firstError;
    if(!entry)return null;
    const {error:deleteError}=await supabase.from('goal_entries').delete().eq('id',entry.id).eq('user_id',user.id);
    if(deleteError)throw deleteError;
    const isAmount=['saving_amount','debt_payoff','expense_limit'].includes(goal.type);
    const updates={updated_at:new Date().toISOString(),status:'active'};
    if(isAmount)updates.current_amount=Math.max(0,Number(goal.current_amount||0)-Number(entry.amount||0));
    else updates.current_value=Math.max(0,Number(goal.current_value||0)-Number(entry.amount||1));
    const {data,error}=await supabase.from('goals').update(updates).eq('id',goal.id).eq('user_id',user.id).select().single();
    if(error)throw error;
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
    await this.recordActiveDay(user);
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
  async recordActiveDay(user){
    return analytics.once('active_day',{user,objectType:'day',objectId:bogotaDay()});
  },
  async getGoalEntries(userId){
    const {data,error}=await supabase.from('goal_entries').select('*').eq('user_id',userId);
    if(error)throw error;return data||[];
  },
  async getSimulatorRuns(userId){
    const {data,error}=await supabase.from('simulator_runs').select('*').eq('user_id',userId);
    if(error)throw error;return data||[];
  },
  async getActiveDays(userId){
    const {data,error}=await supabase.from('analytics_events').select('object_id').eq('user_id',userId).eq('event_name','active_day');
    if(error)throw error;return (data||[]).map(x=>x.object_id).filter(Boolean);
  },
  async getSkillChecks(userId){
    const {data,error}=await supabase.from('skill_checks').select('*').eq('user_id',userId);
    if(error)throw error;return data||[];
  },
  async saveSkillCheck(user,{kind,score,answers,lessonsCompleted}){
    const {data,error}=await supabase.from('skill_checks').insert({
      user_id:user.id,kind,score,answers,lessons_completed_at_submission:lessonsCompleted
    }).select().single();
    if(error)throw error;return data;
  },
  async getBenefitCheckins(userId){
    const {data,error}=await supabase.from('benefit_checkins').select('*').eq('user_id',userId);
    if(error)throw error;return data||[];
  },
  async saveBenefitCheckin(user,{periodIndex,helped,amount,description,ellis}){
    const {data,error}=await supabase.from('benefit_checkins').insert({
      user_id:user.id,period_index:periodIndex,helped,
      approximate_amount_cop:helped && amount!=='' ? Number(amount) : null,
      action_description:helped ? (description.trim()||null):null,sean_ellis_response:ellis
    }).select().single();
    if(error)throw error;return data;
  },
  async getSessionCount(userId){
    const {count,error}=await supabase.from('experiment_sessions').select('id',{count:'exact',head:true}).eq('user_id',userId);
    if(error)throw error;return count||0;
  },
};
