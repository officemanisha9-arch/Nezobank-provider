import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/panel/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="panel-glow-bg absolute inset-0 -z-10" />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[60vh] opacity-40 blur-3xl"
        style={{ background: "var(--gradient-primary)", maskImage: "radial-gradient(circle at top, black, transparent 70%)" }}
      />
      <Outlet />
    </div>
  );
}
