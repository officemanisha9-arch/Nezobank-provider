import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  fetchSession,
  getSession,
  login as apiLogin,
  logout as apiLogout,
  type LoginInput,
  type SessionUser,
} from "@/lib/api/auth";


type AuthCtx = {
  user: SessionUser | null;
  isAuthed: boolean;
  login: (input: LoginInput) => Promise<SessionUser>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => getSession());

  useEffect(() => {
    const onStorage = () => setUser(getSession());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    void fetchSession()
      .then((sessionUser) => setUser(sessionUser))
 .catch(() => {

        // Keep the locally cached session if the backend is temporarily unavailable.
      });
  }, []);

  const value: AuthCtx = {
    user,
    isAuthed: !!user,
    login: async (input) => {
      const u = await apiLogin(input);
      setUser(u);
      return u;
    },
    logout: async () => {
      await apiLogout();
      setUser(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
