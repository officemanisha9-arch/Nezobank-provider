import { createFileRoute, Link } from "@tanstack/react-router";
import { Coins, History, ArrowUpRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

// Import the separated chart components
import { OrderAnalyticsChart } from "@/components/OrderAnalyticsChart";
import { MarketSpreadChart } from "@/components/MarketSpreadChart";

export const Route = createFileRoute("/panel/app/dashboard")({
  component: DashboardPage,
});

// Mock Frontend Data for Token History
const mockTokenHistory = [
  { id: "1", tokenName: "Ethereum", symbol: "ETH", network: "ERC-20", amount: "2.45 ETH", date: "2023-10-24", status: "active", type: "deposit" },
  { id: "2", tokenName: "Binance Coin", symbol: "BNB", network: "BEP-20", amount: "14.20 BNB", date: "2023-10-23", status: "active", type: "stake" },
  { id: "3", tokenName: "Solana", symbol: "SOL", network: "Solana", symbolType: "SOL", amount: "45.00 SOL", date: "2023-10-22", status: "completed", type: "withdrawal" },
  { id: "4", tokenName: "Polygon", symbol: "POL", network: "Polygon", amount: "1,200 POL", date: "2023-10-20", status: "active", type: "deposit" },
];

// Mock Frontend Data for Trade on Coin History
const mockTradeHistory = [
  { id: "t1", coinPair: "BTC/USDT", action: "buy", price: "$67,450.00", amount: "0.15 BTC", date: "Today, 14:25", status: "completed" },
  { id: "t2", coinPair: "ETH/USDT", action: "sell", price: "$2,620.50", amount: "1.80 ETH", date: "Today, 12:10", status: "completed" },
  { id: "t3", coinPair: "SOL/USDT", action: "buy", price: "$178.20", amount: "12.5 SOL", date: "Yesterday", status: "pending" },
  { id: "t4", coinPair: "BNB/USDT", action: "sell", price: "$612.40", amount: "5.00 BNB", date: "2 days ago", status: "completed" },
];

function DashboardPage() {
  const { user } = useAuth();

  const tokenHistory = mockTokenHistory;
  const tradeHistory = mockTradeHistory;
  
  const activeTokensCount = tokenHistory.length;
  const completedTradesCount = tradeHistory.filter((t) => t.status === "completed").length;

  const stats = [
    {
      label: "Liquidity left",
      value: activeTokensCount,
      sub: `${tokenHistory.filter(t => t.status === "active").length} active tokens`,
      icon: Coins,
      to: "/panel/app/liquidity",
      gradient: "from-primary/20 to-primary-glow/10",
    },
    {
      label: "On market",
      value: tradeHistory.length,
      sub: `${completedTradesCount} completed trades`,
      icon: History,
      to: "/panel/app/trades",
      gradient: "from-accent/20 to-accent/5",
    },
    {
      label: "Reserve",
      value: activeTokensCount + tradeHistory.length,
      sub: "Across all categories",
      icon: Activity,
      to: "/panel/app/tokens",
      gradient: "from-fuchsia-500/15 to-violet-500/5",
    },
    {
      label: "Active users",
      value: activeTokensCount + tradeHistory.length,
      sub: "Across all categories",
      icon: Activity,
      to: "/panel/app/tokens",
      gradient: "from-red-500/15 to-red-500/5",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 animate-fade-in pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            {user?.name || "Panel Holder"}
            <span className="panel-gradient-text">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Here's a snapshot of your token history, coin trade analytics, and market performance.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group">
            <Card className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${s.gradient} shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
                <CardTitle className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {s.label}
                </CardTitle>
                <s.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-2xl font-semibold tracking-tight sm:text-4xl">{s.value}</p>
                    <p className="mt-1 truncate text-[11px] text-muted-foreground sm:text-xs">{s.sub}</p>
                  </div>
                  <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 sm:block" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Render the Separated Chart Cards */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <OrderAnalyticsChart />
        <MarketSpreadChart />
      </div>

      {/* Token History & Coin Trade History Lists Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentList
          title="User Token History"
          to="/panel/app/tokens"
          items={tokenHistory.slice(0, 4).map((t) => ({
            id: t.id,
            title: `${t.tokenName} (${t.symbol})`,
            meta: `${t.network} • ${t.date}`,
            extra: t.amount,
            status: t.status === "active" ? "published" : "draft",
            badgeText: t.type,
          }))}
        />
        <RecentList
          title="Trade on Coin History"
          to="/panel/app/trades"
          items={tradeHistory.slice(0, 4).map((h) => ({
            id: h.id,
            title: `${h.coinPair} - ${h.action.toUpperCase()}`,
            meta: `Price: ${h.price} • ${h.date}`,
            extra: h.amount,
            status: h.status === "completed" ? "published" : "draft",
            badgeText: h.action,
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
  items: { id: string; title: string; meta: string; extra?: string; status: "draft" | "published"; badgeText?: string }[];
}) {
  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <Link to={to} className="shrink-0 text-xs font-medium text-primary hover:underline">
          View all →
        </Link>
      </CardHeader>
      <CardContent className="space-y-2 px-3 sm:px-6">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Nothing yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/40 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end">
                {item.extra ? (
                  <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                    {item.extra}
                  </span>
                ) : null}
                <Badge 
                  variant={item.badgeText === "buy" ? "default" : item.badgeText === "sell" ? "destructive" : "secondary"} 
                  className="text-[10px] uppercase"
                >
                  {item.badgeText || item.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}