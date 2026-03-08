import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type SupabaseSession = {
  access_token: string;
  refresh_token: string | null;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
} & Record<string, any>;

type SupabaseUser = Record<string, any>;

type AuthState = {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  initializing: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (payload: {
    user: SupabaseUser;
    session: SupabaseSession;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
  xp: number;
  pendingXp: number;
  addLessonXp: (
    amount: number,
    options?: { sync?: boolean; lessonId?: string }
  ) => Promise<void>;
  syncXp: (amountOverride?: number) => Promise<{ success: boolean; error?: string }>;
  refreshXpFromServer: () => Promise<{ success: boolean; error?: string }>;
   streak: number;
   bestStreak: number;
   updateStreak: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "skillsnack_auth_session";
const XP_STORAGE_KEY_PREFIX = "skillsnack_xp_";
const COMPLETED_LESSONS_KEY_PREFIX = "skillsnack_completed_lessons_";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [xp, setXp] = useState(0);
  const [pendingXp, setPendingXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const loadXpForUser = useCallback(async (userId: string) => {
    const key = `${XP_STORAGE_KEY_PREFIX}${userId}`;
    try {
      const stored = await AsyncStorage.getItem(key);
      console.log("Loaded XP from AsyncStorage:", stored);
      if (!stored) {
        setXp(0);
        setPendingXp(0);
        return;
      }

      const parsed = JSON.parse(stored) as {
        totalXp?: number;
        pendingXp?: number;
      };

      setXp(parsed.totalXp ?? 0);
      setPendingXp(parsed.pendingXp ?? 0);
    } catch (e) {
      console.warn("Failed to load XP from storage", e);
      setXp(0);
      setPendingXp(0);
    }
  }, []);

  const saveXpForUser = useCallback(
    async (userId: string, total: number, pending: number) => {
      const key = `${XP_STORAGE_KEY_PREFIX}${userId}`;
      try {
        console.log("Saving XP to AsyncStorage:", { totalXp: total, pendingXp: pending });
        await AsyncStorage.setItem(
          key,
          JSON.stringify({ totalXp: total, pendingXp: pending })
        );
      } catch (e) {
        console.warn("Failed to persist XP to storage", e);
      }
    },
    []
  );

  const getCompletedLessonsForUser = useCallback(
    async (userId: string): Promise<Set<string>> => {
      const key = `${COMPLETED_LESSONS_KEY_PREFIX}${userId}`;
      try {
        const stored = await AsyncStorage.getItem(key);
        if (!stored) return new Set();
        const parsed = JSON.parse(stored) as string[];
        return new Set(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.warn("Failed to load completed lessons", e);
        return new Set();
      }
    },
    []
  );

  const markLessonCompletedForUser = useCallback(
    async (userId: string, lessonId: string) => {
      const key = `${COMPLETED_LESSONS_KEY_PREFIX}${userId}`;
      try {
        const existing = await getCompletedLessonsForUser(userId);
        existing.add(lessonId);
        await AsyncStorage.setItem(
          key,
          JSON.stringify(Array.from(existing))
        );
      } catch (e) {
        console.warn("Failed to persist completed lesson", e);
      }
    },
    [getCompletedLessonsForUser]
  );

  const hydrateXpFromServer = useCallback(
    async (userId: string, accessToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const json = await response.json().catch(() => ({}));

        if (!response.ok || !json?.user) {
          return;
        }

        const serverXp =
          typeof json.user.xp === "number" ? (json.user.xp as number) : null;
        const serverStreak =
          typeof json.user.streak === "number"
            ? (json.user.streak as number)
            : null;
        const serverBestStreak =
          typeof json.user.best_streak === "number"
            ? (json.user.best_streak as number)
            : null;

        if (serverXp != null) {
          setXp(serverXp);
          setPendingXp(0);
          await saveXpForUser(userId, serverXp, 0);
        }

        if (serverStreak != null) {
          setStreak(serverStreak);
        }
        if (serverBestStreak != null) {
          setBestStreak(serverBestStreak);
        }
      } catch (error) {
        console.warn("Failed to hydrate XP from server", error);
      }
    },
    [API_BASE_URL]
  );

  const restoreAuthSession = useCallback(async () => {
    let isMounted = true;

    try {
      const storedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession) as SupabaseSession;
        setSession(parsedSession);
        setUser(parsedSession.user);
      }
    } catch (e) {
      console.warn("Failed to restore auth session", e);
    } finally {
      if (isMounted) {
        setInitializing(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    restoreAuthSession();
  }, [restoreAuthSession]);

  const persistState = useCallback(
    async (nextUser: SupabaseUser | null, nextSession: SupabaseSession | null) => {
      if (!nextUser || !nextSession) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: nextUser,
          session: nextSession,
        })
      );
    },
    []
  );

  const signIn = useCallback(
    async (payload: { user: SupabaseUser; session: SupabaseSession }) => {
      // Ensure we have a concrete expires_at if possible
      const nowSec = Math.floor(Date.now() / 1000);
      const withExpiry: SupabaseSession = {
        ...payload.session,
        expires_at:
          payload.session.expires_at ??
          (payload.session.expires_in
            ? nowSec + payload.session.expires_in
            : undefined),
      };

      setUser(payload.user);
      setSession(withExpiry);

      try {
        await persistState(payload.user, withExpiry);
        const userId = (payload.user as any).id as string | undefined;
        const shouldHydrateFromServer = xp === 0 && pendingXp === 0;

        if (userId && withExpiry.access_token && shouldHydrateFromServer) {
          await hydrateXpFromServer(userId, withExpiry.access_token);
        } else if (userId) {
          await loadXpForUser(userId);
        }
      } catch (e) {
        console.warn("Failed to persist auth session", e);
      }
    },
    [persistState, loadXpForUser, hydrateXpFromServer, xp, pendingXp]
  );

  const signOut = useCallback(async () => {
    const currentUserId = (user as any)?.id as string | undefined;
    setUser(null);
    setSession(null);
    setXp(0);
    setPendingXp(0);
    setStreak(0);
    setBestStreak(0);

    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      if (currentUserId) {
        await AsyncStorage.removeItem(
          `${XP_STORAGE_KEY_PREFIX}${currentUserId}`
        );
        await AsyncStorage.removeItem(
          `${COMPLETED_LESSONS_KEY_PREFIX}${currentUserId}`
        );
      }
    } catch (e) {
      console.warn("Failed to clear auth session", e);
    }
  }, [user]);

  // Refresh the Supabase session using the backend /auth/refresh endpoint.
  // Returns the new session so callers can use it immediately (before React state updates).
  const refreshSession = useCallback(async (): Promise<SupabaseSession> => {
    if (!session?.refresh_token) {
      await signOut();
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok || !json?.session || !json?.user) {
      await signOut();
      throw new Error(
        typeof json?.error === "string"
          ? json.error
          : "Failed to refresh session"
      );
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const newSession: SupabaseSession = {
      ...json.session,
      expires_at:
        json.session.expires_at ??
        (json.session.expires_in
          ? nowSec + json.session.expires_in
          : undefined),
    };

    await signIn({ user: json.user, session: newSession });
    return newSession;
  }, [session, signOut, signIn, API_BASE_URL]);

  // Ensure we have a valid (non-expired) session before protected calls.
  const ensureValidSession = useCallback(async (): Promise<SupabaseSession> => {
    if (!session) {
      throw new Error("Not authenticated");
    }
    if (!session.access_token || typeof session.access_token !== "string") {
      throw new Error("Invalid session: missing access token");
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const exp = session.expires_at;

    // If token is expired or about to expire in the next 30 seconds, refresh it.
    if (exp && exp - nowSec < 30) {
      return await refreshSession();
    }

    return session;
  }, [session, refreshSession]);

  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const currentSession = await ensureValidSession();
      const headers = {
        ...(init.headers || {}),
        Authorization: `Bearer ${currentSession.access_token}`,
      } as Record<string, string>;

      const doRequest = () =>
        fetch(`${API_BASE_URL}${path}`, {
          ...init,
          headers,
        });

      let response = await doRequest();

      // If the token somehow became invalid, try one refresh and retry once.
      if (response.status === 401 || response.status === 403) {
        try {
          const refreshedSession = await refreshSession();
          const retryHeaders = {
            ...(init.headers || {}),
            Authorization: `Bearer ${refreshedSession.access_token}`,
          } as Record<string, string>;

          response = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            headers: retryHeaders,
          });
        } catch (error) {
          // Refresh failed, propagate original error response
          return response;
        }
      }

      return response;
    },
    [API_BASE_URL, ensureValidSession, refreshSession]
  );

  const syncXp = useCallback(async (amountOverride?: number) => {
    if (!session) {
      return { success: false, error: "Not logged in" };
    }

    const currentPending =
      typeof amountOverride === "number" ? amountOverride : pendingXp;
    if (!Number.isFinite(currentPending) || currentPending <= 0) {
      return { success: false, error: "No pending XP to sync" };
    }

    const userId =
      ((user as any)?.id as string | undefined) ??
      (((session as any)?.user?.id as string | undefined) ?? undefined);
    const amount = currentPending;

    try {
      const response = await authFetch("/users/xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg =
          typeof json?.error === "string"
            ? json.error
            : response.status === 401
              ? "Session expired. Please log in again."
              : "Failed to sync XP";
        console.warn("Failed to sync XP with backend", errMsg);
        return { success: false, error: errMsg };
      }

      const amountAdded =
        typeof json?.amountAdded === "number" ? json.amountAdded : amount;
      const serverXp =
        typeof json?.user?.xp === "number" ? (json.user.xp as number) : xp;
      const serverStreak =
        typeof json?.user?.streak === "number"
          ? (json.user.streak as number)
          : streak;
      const serverBestStreak =
        typeof json?.user?.best_streak === "number"
          ? (json.user.best_streak as number)
          : bestStreak;

      const newPending = Math.max(0, currentPending - amountAdded);
      // Use functional update so we don't clobber newer pending XP
      setPendingXp((prev) => Math.max(0, prev - amountAdded));
      // Only update xp from server when we've fully synced
      if (newPending === 0) {
        setXp(serverXp);
      }
      setStreak(serverStreak);
      setBestStreak(serverBestStreak);
      if (userId) {
        const totalToSave = newPending === 0 ? serverXp : xp;
        await saveXpForUser(userId, totalToSave, newPending);
      }
      return { success: true };
    } catch (e) {
      const errMsg =
        e instanceof Error ? e.message : "Network error. Try again.";
      console.warn("Error while syncing XP with backend", e);
      return { success: false, error: errMsg };
    }
  }, [authFetch, pendingXp, saveXpForUser, session, user, xp, streak, bestStreak]);

  const refreshXpFromServer = useCallback(async () => {
    if (!user || !(user as any).id) {
      return { success: false, error: "Not logged in" };
    }

    const userId = (user as any).id as string;

    try {
      const response = await authFetch("/users/me", { method: "GET" });
      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json?.user) {
        const errMsg =
          typeof json?.error === "string"
            ? json.error
            : response.status === 401
              ? "Session expired. Please log in again."
              : "Failed to refresh XP";
        return { success: false, error: errMsg };
      }

      const serverXp =
        typeof json.user.xp === "number" ? json.user.xp : xp;
      const serverStreak =
        typeof json.user.streak === "number" ? json.user.streak : streak;
      const serverBestStreak =
        typeof json.user.best_streak === "number"
          ? json.user.best_streak
          : bestStreak;

      setXp(serverXp);
      setPendingXp(0);
      setStreak(serverStreak);
      setBestStreak(serverBestStreak);
      await saveXpForUser(userId, serverXp, 0);
      return { success: true };
    } catch (e) {
      const errMsg =
        e instanceof Error ? e.message : "Network error. Try again.";
      console.warn("Error refreshing XP from server", e);
      return { success: false, error: errMsg };
    }
  }, [authFetch, bestStreak, saveXpForUser, streak, user, xp]);

  const addLessonXp = useCallback(
    async (
      amount: number,
      options?: { sync?: boolean; lessonId?: string }
    ) => {
      if (!user || !(user as any).id) return;
      if (!Number.isFinite(amount) || amount <= 0) return;

      const userId = (user as any).id as string;

      // When lessonId is provided, only award XP once per lesson (prevents infinite XP glitch)
      if (options?.lessonId) {
        const completed = await getCompletedLessonsForUser(userId);
        if (completed.has(options.lessonId)) {
          return; // Already earned XP for this lesson
        }
        await markLessonCompletedForUser(userId, options.lessonId);
      }

      const nextTotal = xp + amount;
      const nextPending = pendingXp + amount;

      setXp(nextTotal);
      setPendingXp(nextPending);
      await saveXpForUser(userId, nextTotal, nextPending);

      if (options?.sync) {
        // syncXp reads pendingXp from state, which may not have updated yet.
        // Pass the computed pending amount so the backend gets the right value.
        await syncXp(nextPending);
      }
    },
    [
      getCompletedLessonsForUser,
      markLessonCompletedForUser,
      pendingXp,
      saveXpForUser,
      syncXp,
      user,
      xp,
    ]
  );

  const updateStreak = useCallback(async () => {
    if (!user || !(user as any).id) return;

    const userId = (user as any).id as string;

    try {
      const response = await authFetch("/users/streak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json?.user) {
        console.warn(
          "Failed to update streak",
          typeof json?.error === "string" ? json.error : json
        );
        return;
      }

      const nextStreak =
        typeof json.user.streak === "number"
          ? (json.user.streak as number)
          : streak;
      const nextBestStreak =
        typeof json.user.best_streak === "number"
          ? (json.user.best_streak as number)
          : bestStreak;

      setStreak(nextStreak);
      setBestStreak(nextBestStreak);
    } catch (e) {
      console.warn("Error while updating streak", e);
    }
  }, [authFetch, bestStreak, streak, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        initializing,
        signIn,
        signOut,
        xp,
        pendingXp,
        addLessonXp,
        syncXp,
        refreshXpFromServer,
        streak,
        bestStreak,
        updateStreak,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

