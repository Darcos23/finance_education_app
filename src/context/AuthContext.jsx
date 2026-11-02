import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { analytics, ensureExperimentSession, trackEvent } from "../lib/analytics";
import { clearBrowserSession } from "../lib/device";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (authUser) => {
    if (!authUser?.id) {
      setProfile(null);
      return null;
    }
    const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle();
    setProfile(data || null);
    return data || null;
  };

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const current = data.session || null;
      setSession(current);
      setUser(current?.user || null);
      await ensureExperimentSession(current?.user || null);
      await analytics.uniqueVisit(current?.user || null);
      await analytics.sessionStarted(current?.user || null);
      if (current?.user) await loadProfile(current.user);
      setLoading(false);
    }

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user || null);
      await ensureExperimentSession(nextSession?.user || null);
      if (nextSession?.user) {
        await loadProfile(nextSession.user);
        await analytics.uniqueVisit(nextSession.user);
        await analytics.sessionStarted(nextSession.user);
        await analytics.once("user_authenticated", { user: nextSession.user });
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ fullName, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (!error && data.user) {
      if (data.session) {
        await trackEvent("registration_submitted", { user: data.user, once: true });
      } else {
        await trackEvent("registration_submitted_anonymous", {
          once: true,
          scope: "device",
          properties: { email_confirmation_required: true },
        });
      }
    }
    return { data, error };
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const updatePassword = async (newPassword) => {
    return await supabase.auth.updateUser({
      password: newPassword,
    });
  };

  const signOut = async () => {
    clearBrowserSession();
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => loadProfile(user);

  const value = useMemo(() => ({
    user, session, profile, loading, signUp, signIn, signOut, resetPassword, updatePassword, refreshProfile,
  }), [user, session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
