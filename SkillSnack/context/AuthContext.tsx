import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  addLessonXp: (amount: number, options?: { sync?: boolean }) => Promise<void>;
  syncXp: () => Promise<void>;
   streak: number;
   bestStreak: number;
   updateStreak: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "skillsnack_auth_session";
const XP_STORAGE_KEY_PREFIX = "skillsnack_xp_";
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

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
      } catch (e) {
        console.warn("Failed to hydrate XP from server", e);
      }
    },
    [saveXpForUser]
  );

  // Load any stored session on startup
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) return;

        const parsed = JSON.parse(stored) as {
          user: SupabaseUser;
          session: SupabaseSession;
        };

        if (!isMounted) return;
        setUser(parsed.user);
        setSession(parsed.session);
        if (parsed.user && (parsed.user as any).id) {
          await loadXpForUser((parsed.user as any).id as string);
        }
      } catch (e) {
        console.warn("Failed to restore auth session", e);
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [loadXpForUser]);

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
      }
    } catch (e) {
      console.warn("Failed to clear auth session", e);
    }
  }, [user]);

  // Refresh the Supabase session using the backend /auth/refresh endpoint.
  const refreshSession = useCallback(async () => {
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

    await signIn({ user: json.user, session: json.session });
  }, [session, signOut, signIn]);

  // Ensure we have a valid (non-expired) session before protected calls.
  const ensureValidSession = useCallback(async () => {
    if (!session) {
      throw new Error("Not authenticated");
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const exp = session.expires_at;

    // If token is expired or about to expire in the next 30 seconds, refresh it.
    if (exp && exp - nowSec < 30) {
      await refreshSession();
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
          await refreshSession();
          const refreshedSession = await ensureValidSession();
          const retryHeaders = {
            ...(init.headers || {}),
            Authorization: `Bearer ${refreshedSession.access_token}`,
          } as Record<string, string>;

          response = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            headers: retryHeaders,
          });
        } catch {
          // Refresh failed, propagate original error response
          return response;
        }
      }

      return response;
    },
    [ensureValidSession, refreshSession]
  );

  const syncXp = useCallback(async () => {
    if (!user || !(user as any).id) return;
    if (pendingXp <= 0) return;

    const userId = (user as any).id as string;
    const amount = pendingXp;

    try {
      const response = await authFetch("/users/xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, amount }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn(
          "Failed to sync XP with backend",
          typeof json?.error === "string" ? json.error : json
        );
        return;
      }

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

      setXp(serverXp);
      setPendingXp(0);
      setStreak(serverStreak);
      setBestStreak(serverBestStreak);
      await saveXpForUser(userId, serverXp, 0);
    } catch (e) {
      console.warn("Error while syncing XP with backend", e);
    }
  }, [authFetch, pendingXp, saveXpForUser, user, xp, streak, bestStreak]);

  const addLessonXp = useCallback(
    async (amount: number, options?: { sync?: boolean }) => {
      if (!user || !(user as any).id) return;
      if (!Number.isFinite(amount) || amount <= 0) return;

      const userId = (user as any).id as string;

      const nextTotal = xp + amount;
      const nextPending = pendingXp + amount;

      setXp(nextTotal);
      setPendingXp(nextPending);
      await saveXpForUser(userId, nextTotal, nextPending);

      if (options?.sync) {
        await syncXp();
      }
    },
    [pendingXp, saveXpForUser, syncXp, user, xp]
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
        body: JSON.stringify({ userId }),
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

