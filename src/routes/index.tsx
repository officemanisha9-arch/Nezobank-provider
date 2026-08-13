import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/api/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: getSession() ? "/panel/app/dashboard" : "/panel/auth/login" });
  },
});
