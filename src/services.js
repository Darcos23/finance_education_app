import { GOAL_TEMPLATES, LEARNING_PATHS, TRIAGE_QUESTIONS } from "./data";
import { store, STORAGE_KEYS } from "./storage";
import { addDays, calculatePercentage, generateDailyMilestones, generateId, todayISO } from "./utils";

const buildUser = ({ name, email, password }) => ({
    id: generateId("user"),
    name: name || "Usuario Demo",
    email: email || "demo@app.com",
    password: password || "123456",
    createdAt: new Date().toISOString(),
    hasCompletedTriage: false,
    financialLevel: "beginner",
    interests: [],
    weeklyLearningGoal: 3,
    currentStreak: 0,
    totalLessonsCompleted: 0,
    totalGoalsCompleted: 0,
    avatarIcon: "UserCircle",
});

export const authService = {
    login({ name, email, password, rememberSession = true }) {
        const user = store.getUser();
        if (!user) {
            const newUser = buildUser({ name, email, password });
            store.saveUser(newUser);
            store.saveSession({ isAuthenticated: true, userId: newUser.id, loginAt: new Date().toISOString(), rememberSession });
            return { ok: true, user: newUser };
        }
        if (user.email !== email || user.password !== password) {
            return { ok: false, error: "Correo o contrasena incorrectos para el usuario local guardado." };
        }
        store.saveSession({ isAuthenticated: true, userId: user.id, loginAt: new Date().toISOString(), rememberSession });
        return { ok: true, user };
    },
    createDemoUser() {
        store.clearAll();
        const user = buildUser({ name: "Usuario Demo", email: "demo@app.com", password: "123456" });
        store.saveUser(user);
        store.saveSession({ isAuthenticated: true, userId: user.id, loginAt: new Date().toISOString(), rememberSession: true });
        return { ok: true, user };
    },
    logout() {
        store.remove(STORAGE_KEYS.SESSION);
    },
    isAuthenticated() {
        return Boolean(store.getSession()?.isAuthenticated);
    },
};

export const userService = {
    getCurrentUser() {
        return store.getUser();
    },
    updateUser(updates) {
        const user = store.getUser();
        if (!user) return null;
        const updated = { ...user, ...updates };
        store.saveUser(updated);
        return updated;
    },
    markTriageCompleted(level, interests) {
        return this.updateUser({ hasCompletedTriage: true, financialLevel: level, interests });
    },
    resetTriage() {
        store.remove(STORAGE_KEYS.TRIAGE_RESULT);
        return this.updateUser({ hasCompletedTriage: false, financialLevel: "beginner", interests: [] });
    },
    incrementLessonsCompleted() {
        const user = store.getUser();
        if (user) this.updateUser({ totalLessonsCompleted: (user.totalLessonsCompleted || 0) + 1, currentStreak: (user.currentStreak || 0) + 1 });
    },
    incrementGoalsCompleted() {
        const user = store.getUser();
        if (user) this.updateUser({ totalGoalsCompleted: (user.totalGoalsCompleted || 0) + 1 });
    },
};

const findTriageOption = (questionId, optionId) => {
    const question = TRIAGE_QUESTIONS.find((item) => item.id === questionId);
    return question?.options.find((option) => option.id === optionId) || null;
};

export const triageService = {
    calculateTriageScore(answers) {
        return Object.entries(answers).reduce((total, [questionId, optionId]) => total + Number(findTriageOption(questionId, optionId)?.score || 0), 0);
    },
    assignFinancialLevel(score) {
        if (score <= 12) return "beginner";
        if (score <= 20) return "intermediate";
        return "advanced";
    },
    extractInterests(answers) {
        const counts = {};
        Object.entries(answers).forEach(([questionId, optionId]) => {
            const tag = findTriageOption(questionId, optionId)?.interestTag;
            if (tag) counts[tag] = (counts[tag] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag).slice(0, 4);
    },
    recommendLearningPaths(level, interests) {
        const matches = LEARNING_PATHS.filter((path) => path.level === level || path.tags.some((tag) => interests.includes(tag)));
        return [...new Map((matches.length ? matches : LEARNING_PATHS).map((path) => [path.id, path])).values()].slice(0, 3).map((path) => path.id);
    },
    recommendGoalTemplates(level, interests) {
        const matches = GOAL_TEMPLATES.filter((template) => template.suggestedLevel === level || template.tags.some((tag) => interests.includes(tag)));
        return [...new Map((matches.length ? matches : GOAL_TEMPLATES).map((template) => [template.id, template])).values()].slice(0, 4).map((template) => template.id);
    },
    buildTriageResult(userId, answers) {
        const totalScore = this.calculateTriageScore(answers);
        const level = this.assignFinancialLevel(totalScore);
        const interests = this.extractInterests(answers);
        return {
            userId,
            answers,
            totalScore,
            level,
            interests,
            recommendedPathIds: this.recommendLearningPaths(level, interests),
            recommendedGoalTemplateIds: this.recommendGoalTemplates(level, interests),
            completedAt: new Date().toISOString(),
        };
    },
    save(result) {
        store.saveTriageResult(result);
        return result;
    },
};

const normalizeNumber = (value) => Number(value || 0);

export const goalService = {
    getGoalsByUser(userId) {
        return store.getGoals().filter((goal) => goal.userId === userId);
    },
    getGoalById(goalId) {
        return store.getGoals().find((goal) => goal.id === goalId) || null;
    },
    saveGoals(goals) {
        store.saveGoals(goals);
    },
    createGoal(goalData) {
        const goals = store.getGoals();
        const id = generateId("goal");
        const startDate = goalData.startDate || todayISO();
        const endDate = goalData.endDate || addDays(startDate, Number(goalData.durationDays || goalData.defaultDurationDays || 6));
        let goal = {
            id,
            userId: goalData.userId,
            templateId: goalData.templateId || null,
            title: goalData.title,
            description: goalData.description || "Meta financiera creada en el prototipo.",
            type: goalData.type,
            status: "active",
            priority: goalData.priority || "medium",
            category: goalData.category || "General",
            startDate,
            endDate,
            targetAmount: normalizeNumber(goalData.targetAmount),
            currentAmount: normalizeNumber(goalData.currentAmount),
            expenseLimit: normalizeNumber(goalData.expenseLimit),
            currentExpense: normalizeNumber(goalData.currentExpense),
            targetLessons: normalizeNumber(goalData.targetLessons),
            completedLessons: normalizeNumber(goalData.completedLessons),
            targetStreakDays: normalizeNumber(goalData.targetStreakDays),
            currentStreakDays: normalizeNumber(goalData.currentStreakDays),
            milestones: [],
            contributions: [],
            progressPercentage: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null,
        };
        if (goal.type === "habit_streak") goal.milestones = generateDailyMilestones(goal.startDate, goal.endDate, goal.id);
        goal = this.recalculateGoalProgress(goal);
        goals.push(goal);
        this.saveGoals(goals);
        return goal;
    },
    createGoalFromTemplate(templateId, userId, customData = {}) {
        const template = GOAL_TEMPLATES.find((item) => item.id === templateId);
        if (!template) throw new Error("Plantilla no encontrada");
        const startDate = customData.startDate || todayISO();
        const endDate = customData.endDate || addDays(startDate, Number(template.defaultDurationDays || 7) - 1);
        return this.createGoal({
            userId,
            templateId: template.id,
            title: customData.title || template.title,
            description: customData.description || template.description,
            type: template.type,
            priority: customData.priority || "medium",
            startDate,
            endDate,
            targetAmount: customData.targetAmount ?? template.defaultTargetAmount ?? 0,
            currentAmount: customData.currentAmount || 0,
            expenseLimit: customData.expenseLimit ?? template.defaultTargetAmount ?? 0,
            currentExpense: 0,
            targetLessons: customData.targetLessons ?? template.defaultTargetLessons ?? 3,
            completedLessons: 0,
            targetStreakDays: customData.targetStreakDays ?? template.defaultDurationDays ?? 0,
            currentStreakDays: 0,
            category: customData.category || template.title,
        });
    },
    updateGoal(goalId, updates) {
        const goals = store.getGoals();
        const updatedGoals = goals.map((goal) => (goal.id === goalId ? this.recalculateGoalProgress({ ...goal, ...updates, updatedAt: new Date().toISOString() }) : goal));
        this.saveGoals(updatedGoals);
        return updatedGoals.find((goal) => goal.id === goalId) || null;
    },
    deleteGoal(goalId) {
        this.saveGoals(store.getGoals().filter((goal) => goal.id !== goalId));
    },
    addContribution(goalId, data) {
        const goal = this.getGoalById(goalId);
        if (!goal) return null;
        const contribution = { id: generateId("contribution"), goalId, type: data.type, amount: normalizeNumber(data.amount), note: data.note || "", createdAt: new Date().toISOString() };
        const updates = { contributions: [contribution, ...(goal.contributions || [])] };
        if (goal.type === "saving_amount") updates.currentAmount = normalizeNumber(goal.currentAmount) + contribution.amount;
        if (goal.type === "expense_limit") updates.currentExpense = normalizeNumber(goal.currentExpense) + contribution.amount;
        if (goal.type === "lesson_completion") updates.completedLessons = normalizeNumber(goal.completedLessons) + 1;
        return this.updateGoal(goalId, updates);
    },
    completeMilestone(goalId, milestoneId) {
        const goal = this.getGoalById(goalId);
        if (!goal) return null;
        const milestones = goal.milestones.map((milestone) => (milestone.id === milestoneId ? { ...milestone, isCompleted: !milestone.isCompleted, completedAt: milestone.isCompleted ? null : new Date().toISOString() } : milestone));
        return this.updateGoal(goalId, { milestones, currentStreakDays: milestones.filter((milestone) => milestone.isCompleted).length });
    },
    recalculateGoalProgress(goal) {
        let progress = 0;
        if (goal.type === "saving_amount") progress = calculatePercentage(goal.currentAmount, goal.targetAmount);
        if (goal.type === "habit_streak") progress = calculatePercentage((goal.milestones || []).filter((item) => item.isCompleted).length, (goal.milestones || []).length || goal.targetStreakDays);
        if (goal.type === "expense_limit") progress = calculatePercentage(goal.currentExpense, goal.expenseLimit);
        if (goal.type === "lesson_completion") progress = calculatePercentage(goal.completedLessons, goal.targetLessons);
        let status = goal.status;
        if (goal.type !== "expense_limit" && progress >= 100 && goal.status !== "completed") {
            status = "completed";
            userService.incrementGoalsCompleted();
        }
        return { ...goal, progressPercentage: progress, status, completedAt: status === "completed" ? goal.completedAt || new Date().toISOString() : goal.completedAt, updatedAt: new Date().toISOString() };
    },
    incrementLessonGoals(userId) {
        const goals = store.getGoals().map((goal) => {
            if (goal.userId !== userId || goal.type !== "lesson_completion" || goal.status !== "active") return goal;
            return this.recalculateGoalProgress({ ...goal, completedLessons: normalizeNumber(goal.completedLessons) + 1 });
        });
        this.saveGoals(goals);
    },
};

const flattenLessons = () => LEARNING_PATHS.flatMap((path) => path.lessons);

export const lessonService = {
    getLearningPaths() {
        return LEARNING_PATHS;
    },
    getRecommendedPaths(user) {
        if (!user) return LEARNING_PATHS;
        const matches = LEARNING_PATHS.filter((path) => path.level === user.financialLevel || path.tags.some((tag) => user.interests?.includes(tag)));
        return matches.length ? matches : LEARNING_PATHS;
    },
    getPathById(pathId) {
        return LEARNING_PATHS.find((path) => path.id === pathId) || null;
    },
    getLessonById(lessonId) {
        return flattenLessons().find((lesson) => lesson.id === lessonId) || null;
    },
    getUserLessonProgress(userId) {
        const existing = store.getLessonProgress();
        if (existing?.userId === userId) return existing;
        const initial = { userId, completedLessonIds: [], currentLessonId: null, completedPathIds: [], xp: 0, streak: 0, lastActivityDate: null };
        store.saveLessonProgress(initial);
        return initial;
    },
    completeLesson(userId, lessonId) {
        const progress = this.getUserLessonProgress(userId);
        const lesson = this.getLessonById(lessonId);
        const alreadyCompleted = progress.completedLessonIds.includes(lessonId);
        const completedLessonIds = alreadyCompleted ? progress.completedLessonIds : [...progress.completedLessonIds, lessonId];
        const completedPathIds = [...progress.completedPathIds];
        LEARNING_PATHS.forEach((path) => {
            if (path.lessons.every((item) => completedLessonIds.includes(item.id)) && !completedPathIds.includes(path.id)) completedPathIds.push(path.id);
        });
        const updated = { ...progress, completedLessonIds, completedPathIds, currentLessonId: null, xp: alreadyCompleted ? progress.xp : progress.xp + Number(lesson?.xpReward || 0), streak: progress.streak + 1, lastActivityDate: new Date().toISOString() };
        store.saveLessonProgress(updated);
        if (!alreadyCompleted) {
            userService.incrementLessonsCompleted();
            goalService.incrementLessonGoals(userId);
        }
        return updated;
    },
    isLessonAvailable(path, lesson, progress) {
        if (lesson.order === 1) return true;
        const previous = path.lessons.find((item) => item.order === lesson.order - 1);
        return progress.completedLessonIds.includes(previous?.id);
    },
};
