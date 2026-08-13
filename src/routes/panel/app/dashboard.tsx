import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Newspaper, TrendingUp, Eye, ArrowUpRight } from "lucide-react";
import { listBlogs } from "@/lib/api/blogs";
import { listArticles } from "@/lib/api/articles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/panel/app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const blogsQ = useQuery({ queryKey: ["blogs"], queryFn: listBlogs });
  const articlesQ = useQuery({ queryKey: ["articles"], queryFn: listArticles });

  const blogs = blogsQ.data ?? [];
  const articles = articlesQ.data ?? [];
  const publishedBlogs = blogs.filter((b) => b.status === "published").length;
  const publishedArticles = articles.filter((a) => a.status === "published").length;

  const stats = [
    {
      label: "Blogs assigned",
      value: blogs.length,
      sub: `${publishedBlogs} published`,
      icon: FileText,
      to: "/panel/app/blogs",
      gradient: "from-primary/20 to-primary-glow/10",
    },
    {
      label: "Articles assigned",
      value: articles.length,
      sub: `${publishedArticles} published`,
      icon: Newspaper,
      to: "/panel/app/articles",
      gradient: "from-accent/20 to-accent/5",
    },
    {
      label: "Total posts",
      value: blogs.length + articles.length,
      sub: "Across all categories",
      icon: TrendingUp,
      to: "/panel/app/blogs",
      gradient: "from-fuchsia-500/15 to-violet-500/5",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
            {user?.name || "Panel Holder"}
            <span className="panel-gradient-text">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Here's a snapshot of the content assigned to you.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group">
            <Card className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${s.gradient} shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-semibold tracking-tight">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentList
          title="Recent blogs"
          to="/panel/app/blogs"
          items={blogs.slice(0, 4).map((b) => ({
            id: b.id,
            title: b.title,
            meta: `${b.category} • ${b.date}`,
            extra: b.views,
            status: b.status,
          }))}
        />
        <RecentList
          title="Recent articles"
          to="/panel/app/articles"
          items={articles.slice(0, 4).map((a) => ({
            id: a.id,
            title: a.title,
            meta: `${a.category} • ${a.date}`,
            extra: undefined,
            status: a.status,
          }))}
        />
      </div>
    </div>
  );
}

function RecentList({
  title,
  to,
  items,
}: {
  title: string;
  to: string;
  items: { id: string; title: string; meta: string; extra?: string; status: "draft" | "published" }[];
}) {
  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <Link to={to} className="text-xs font-medium text-primary hover:underline">
          View all →
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Nothing yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {item.extra ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {item.extra}
                  </span>
                ) : null}
                <Badge variant={item.status === "published" ? "default" : "secondary"} className="text-[10px]">
                  {item.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
