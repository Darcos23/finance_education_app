export const STORAGE_KEYS = {
    USER: "finance_app_user",
    SESSION: "finance_app_session",
    TRIAGE_RESULT: "finance_app_triage_result",
    GOALS: "finance_app_goals",
    LESSON_PROGRESS: "finance_app_lesson_progress",
};

const safeParse = (raw, fallback) => {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export const store = {
    get(key, fallback = null) {
        if (typeof window === "undefined") return fallback;
        return safeParse(window.localStorage.getItem(key), fallback);
    },
    set(key, value) {
        if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        if (typeof window !== "undefined") window.localStorage.removeItem(key);
    },
    clearAll() {
        Object.values(STORAGE_KEYS).forEach((key) => this.remove(key));
    },
    getUser() {
        return this.get(STORAGE_KEYS.USER, null);
    },
    saveUser(user) {
        this.set(STORAGE_KEYS.USER, user);
    },
    getSession() {
        return this.get(STORAGE_KEYS.SESSION, null);
    },
    saveSession(session) {
        this.set(STORAGE_KEYS.SESSION, session);
    },
    getGoals() {
        return this.get(STORAGE_KEYS.GOALS, []);
    },
    saveGoals(goals) {
        this.set(STORAGE_KEYS.GOALS, goals);
    },
    getTriageResult() {
        return this.get(STORAGE_KEYS.TRIAGE_RESULT, null);
    },
    saveTriageResult(result) {
        this.set(STORAGE_KEYS.TRIAGE_RESULT, result);
    },
    getLessonProgress() {
        return this.get(STORAGE_KEYS.LESSON_PROGRESS, null);
    },
    saveLessonProgress(progress) {
        this.set(STORAGE_KEYS.LESSON_PROGRESS, progress);
    },
};
