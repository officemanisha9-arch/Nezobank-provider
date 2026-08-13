import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { FileText, LayoutDashboard, LogOut, Newspaper, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/panel/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/panel/app/blogs", label: "Blogs", icon: FileText },
  { to: "/panel/app/articles", label: "Articles", icon: Newspaper },
] as const;

export function PanelLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate({ to: "/panel/auth/login" });
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      <div className="panel-glow-bg pointer-events-none fixed inset-0 -z-10" />

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="leading-tight">
            <img src="/logo.png" alt="Nezo Panel" className="h-15" />
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-card"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className={cn("h-4 w-4", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
            <p className="truncate text-xs font-medium text-sidebar-accent-foreground">{user?.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex w-full flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <p className="font-semibold">Nezo Panel</p>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border/70 bg-background/60 px-2 py-2 md:hidden">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
