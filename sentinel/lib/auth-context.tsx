import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  streakAtRisk: boolean;
  avatar: string;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (params?: { email?: string; password?: string; name?: string }) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type LoginResult =
  | { ok: true }
  | { ok: false; requiresVerification: true; message: string }
  | { ok: false; error: string };

const SESSION_USER_KEY = "sentinel_session_user";
const SESSION_TOKEN_KEY = "sentinel_session_token";

const DEFAULT_EMAIL = "almira@gmail.com";
const DEFAULT_PASSWORD = "Almira";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const mockUser: User = {
    id: "user_123",
    email: "almira@gmail.com",
    name: "Alex Trainee",
    role: "admin",
    level: 9,
    xp: 1250,
    nextLevelXp: 2000,
    streak: 14,
    streakAtRisk: true,
    avatar: "AT",
    badges: ["Fast Learner", "Streak Master", "Quiz Whiz"],
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
    const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);

    if (storedToken) setToken(storedToken);

    if (storedUser) {
      const parsed = JSON.parse(storedUser) as Partial<User>;
      setUser({
        id: parsed.id ?? mockUser.id,
        email: parsed.email ?? mockUser.email,
        name: parsed.name ?? mockUser.name,
        role: parsed.role === "admin" ? "admin" : "user",
        level: parsed.level ?? mockUser.level,
        xp: parsed.xp ?? mockUser.xp,
        nextLevelXp: parsed.nextLevelXp ?? mockUser.nextLevelXp,
        streak: parsed.streak ?? mockUser.streak,
        streakAtRisk: parsed.streakAtRisk ?? mockUser.streakAtRisk,
        avatar: parsed.avatar ?? mockUser.avatar,
        badges: parsed.badges ?? mockUser.badges,
      });
    }
    setLoading(false);
  }, []);

  const clearLocalSession = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem(SESSION_USER_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  };

  const login = async (params?: { email?: string; password?: string; name?: string }): Promise<LoginResult> => {
    const email = params?.email ?? DEFAULT_EMAIL;
    const password = params?.password ?? DEFAULT_PASSWORD;
    const name = params?.name ?? mockUser.name;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = (await res.json()) as
      | { ok: true; token: string; user: { id: string; email: string; name: string; role: "admin" | "user" } }
      | { ok: false; requiresVerification: true; message: string }
      | { ok: false; error: string };

    if (!data.ok && "requiresVerification" in data && data.requiresVerification) {
      return data;
    }

    if (!data.ok) {
      return data;
    }

    const nextUser: User = {
      ...mockUser,
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    };

    setToken(data.token);
    setUser(nextUser);
    sessionStorage.setItem(SESSION_TOKEN_KEY, data.token);
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(nextUser));
    router.push("/home");

    return { ok: true };
  };

  const logout = async () => {
    const currentToken = token ?? sessionStorage.getItem(SESSION_TOKEN_KEY);

    try {
      if (currentToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ token: currentToken }),
          keepalive: true,
        });
      }
    } catch (error) {
      console.warn("Safe logout fallback: failed to revoke server session", error);
    } finally {
      clearLocalSession();
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
