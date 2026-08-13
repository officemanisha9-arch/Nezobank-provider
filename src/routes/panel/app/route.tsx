import { createFileRoute, redirect } from "@tanstack/react-router";
import { PanelLayout } from "@/components/panel-layout";
import { fetchSession, getSession } from "@/lib/api/auth";


export const Route = createFileRoute("/panel/app")({
  beforeLoad: async () => {
    const cachedSession = getSession();

     const session = getSession() ?? (await fetchSession().catch(() => null));

    if (!session) {
      throw redirect({ to: "/panel/auth/login" });
    }
  },
  component: PanelLayout,
});
