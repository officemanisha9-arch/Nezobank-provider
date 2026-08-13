import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Coins, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Layers 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/panel/app/tokens")({
  component: TokenHistoryPage,
});

// Comprehensive mock dataset for user token history
const fullTokenHistoryData = [
  { id: "th1", tokenName: "Ethereum", symbol: "ETH", network: "ERC-20", amount: "2.45 ETH", type: "deposit", date: "2026-06-06 14:25", status: "active" },
  { id: "th2", tokenName: "Binance Coin", symbol: "BNB", network: "BEP-20", amount: "14.20 BNB", type: "stake", date: "2026-06-05 11:10", status: "active" },
  { id: "th3", tokenName: "Solana", symbol: "SOL", network: "Solana", amount: "45.00 SOL", type: "withdrawal", date: "2026-06-04 18:40", status: "completed" },
  { id: "th4", tokenName: "Polygon", symbol: "POL", network: "Polygon", amount: "1,200 POL", type: "deposit", date: "2026-06-03 09:15", status: "active" },
  { id: "th5", tokenName: "Tether USD", symbol: "USDT", network: "TRC-20", amount: "3,500.00 USDT", type: "withdrawal", date: "2026-06-02 16:50", status: "completed" },
  { id: "th6", tokenName: "Chainlink", symbol: "LINK", network: "ERC-20", amount: "120.50 LINK", type: "stake", date: "2026-06-01 11:30", status: "active" },
];

function TypeBadge({ type }: { type: string }) {
  const isDeposit = type === "deposit";
  const isWithdrawal = type === "withdrawal";
  return (
    <Badge 
      variant="outline" 
      className={`text-[10px] uppercase font-bold ${
        isDeposit 
          ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' 
          : isWithdrawal 
          ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' 
          : 'text-violet-500 border-violet-500/30 bg-violet-500/10'
      }`}
    >
      {type}
    </Badge>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
      status === 'active' 
        ? 'bg-emerald-500/10 text-emerald-500' 
        : 'bg-primary/10 text-primary'
    }`}>
      {status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
      <span className="capitalize">{status}</span>
    </span>
  );
}

function TokenHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "deposit" | "withdrawal" | "stake">("all");

  // Filter logic on the frontend
  const filteredTokens = fullTokenHistoryData.filter((item) => {
    const matchesSearch = 
      item.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.network.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesType;
  });

  const activeTokensCount = fullTokenHistoryData.filter(t => t.status === "active").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 animate-fade-in pb-12 px-3 sm:px-0">
      {/* Header Section */}
      <header className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Coins className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Asset Management</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            User Token History<span className="panel-gradient-text">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Monitor all your token deposits, withdrawals, staking allocations, and network movements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="w-full border-border/60 bg-card/70 px-4 py-2 shadow-sm sm:w-auto">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Token Assets</p>
            <p className="text-lg font-bold text-foreground">{activeTokensCount} Tokens</p>
          </Card>
        </div>
      </header>

      {/* Controls / Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="relative w-full sm:max-w-sm sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search token name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background/50 pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Button 
            variant={filterType === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType("all")}
            className="w-full sm:w-auto"
          >
            All
          </Button>
          <Button 
            variant={filterType === "deposit" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType("deposit")}
            className="w-full sm:w-auto"
          >
            Deposits
          </Button>
          <Button 
            variant={filterType === "withdrawal" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType("withdrawal")}
            className="w-full sm:w-auto"
          >
            Withdrawals
          </Button>
          <Button 
            variant={filterType === "stake" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType("stake")}
            className="w-full sm:w-auto"
          >
            Stakes
          </Button>
        </div>
      </div>

      {/* Token History Card */}
      <Card className="border-border/60 bg-card/70 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between gap-2">
            <span>Token Ledger Records</span>
            <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">{filteredTokens.length} entries</span>
          </CardTitle>
          <CardDescription className="text-xs">Comprehensive ledger of token activities and network transfers</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {filteredTokens.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No token history records found matching your query.
            </div>
          ) : (
            <>
              {/* Mobile: stacked cards (below md) */}
              <div className="space-y-3 md:hidden">
                {filteredTokens.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border/50 bg-background/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                          <Layers className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{item.tokenName}</p>
                          <p className="truncate text-xs font-mono text-muted-foreground">{item.symbol}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <TypeBadge type={item.type} />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Network</p>
                        <p className="font-medium text-muted-foreground">{item.network}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</p>
                        <p className="font-mono font-semibold text-foreground">{item.amount}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</p>
                        <p className="text-muted-foreground">{item.date}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end border-t border-border/40 pt-2">
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop / tablet: table (md and up) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-medium">Token Name</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Network</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Date & Time</th>
                      <th className="pb-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredTokens.map((item) => (
                      <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 font-medium text-foreground flex items-center gap-2.5">
                          <span className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Layers className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-semibold">{item.tokenName}</p>
                            <p className="text-xs font-mono text-muted-foreground">{item.symbol}</p>
                          </div>
                        </td>
                        <td>
                          <TypeBadge type={item.type} />
                        </td>
                        <td className="py-3.5 text-xs text-muted-foreground font-medium">{item.network}</td>
                        <td className="py-3.5 font-mono text-xs font-semibold text-foreground">{item.amount}</td>
                        <td className="py-3.5 text-xs text-muted-foreground">{item.date}</td>
                        <td className="py-3.5 text-right">
                          <StatusPill status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}