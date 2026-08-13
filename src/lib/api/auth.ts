// Frontend-only mock auth. Any non-empty email/password combination signs
// you in; the session is kept in localStorage. There is no backend, no
// network request, and no real credential check - replace this with a
// real auth flow when a backend is wired up.
import { delay, readStore, removeStore, writeStore } from "./storage";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin";
};

const SESSION_KEY = "session";

export type LoginInput = { email: string; password: string; rememberMe: boolean };

export async function login(input: LoginInput): Promise<SessionUser> {
  await delay();

  const user: SessionUser = {
    id: "demo-user",
    email: input.email,
    name: input.email.split("@")[0] || "Panel Holder",
    role: "admin",
  };

  writeStore(SESSION_KEY, user);
  return user;
}

export async function fetchSession(): Promise<SessionUser | null> {
  return getSession();
}

export async function logout(): Promise<void> {
  await delay(150);
  removeStore(SESSION_KEY);
}

export function getSession(): SessionUser | null {
  return readStore<SessionUser | null>(SESSION_KEY, null);
}
