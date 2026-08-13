import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  History, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/panel/app/trades")({
  component: TradeHistoryPage,
});

// Comprehensive mock dataset for coin trades
const fullTradeHistoryData = [
  { id: "t1", coinPair: "BTC/USDT", action: "buy", price: "$67,450.00", amount: "0.15 BTC", total: "$10,117.50", date: "2026-06-06 14:25", status: "completed" },
  { id: "t2", coinPair: "ETH/USDT", action: "sell", price: "$2,620.50", amount: "1.80 ETH", total: "$4,716.90", date: "2026-06-06 12:10", status: "completed" },
  { id: "t3", coinPair: "SOL/USDT", action: "buy", price: "$178.20", amount: "12.50 SOL", total: "$2,227.50", date: "2026-06-05 18:40", status: "pending" },
  { id: "t4", coinPair: "BNB/USDT", action: "sell", price: "$612.40", amount: "5.00 BNB", total: "$3,062.00", date: "2026-06-04 09:15", status: "completed" },
  { id: "t5", coinPair: "ADA/USDT", action: "buy", price: "$0.45", amount: "3,500 ADA", total: "$1,575.00", date: "2026-06-03 16:50", status: "completed" },
  { id: "t6", coinPair: "XRP/USDT", action: "sell", price: "$0.52", amount: "2,000 XRP", total: "$1,040.00", date: "2026-06-02 11:30", status: "cancelled" },
  { id: "t7", coinPair: "BTC/USDT", action: "buy", price: "$66,900.00", amount: "0.08 BTC", total: "$5,352.00", date: "2026-06-01 08:20", status: "completed" },
];

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
      status === 'completed' 
        ? 'bg-emerald-500/10 text-emerald-500' 
        : status === 'pending' 
        ? 'bg-amber-500/10 text-amber-500' 
        : 'bg-muted text-muted-foreground'
    }`}>
      {status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'pending' && <Clock className="h-3 w-3" />}
      {status === 'cancelled' && <AlertCircle className="h-3 w-3" />}
      <span className="capitalize">{status}</span>
    </span>
  );
}

function TradeHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<"all" | "buy" | "sell">("all");

  // Filter logic on the frontend
  const filteredTrades = fullTradeHistoryData.filter((trade) => {
    const matchesSearch = 
      trade.coinPair.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.amount.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === "all" || trade.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const totalVolumeTraded = fullTradeHistoryData
    .filter(t => t.status === "completed")
    .reduce((acc, curr) => acc + parseFloat(curr.total.replace(/[^0-9.-]+/g, "")), 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 animate-fade-in pb-12 px-3 sm:px-0">
      {/* Header Section */}
      <header className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <History className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Exchange Records</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Trade on Coin History<span className="panel-gradient-text">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Track and review all historical buy and sell transactions executed across market pairs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="w-full border-border/60 bg-card/70 px-4 py-2 shadow-sm sm:w-auto">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Volume Traded</p>
            <p className="text-lg font-bold text-foreground">${totalVolumeTraded.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </Card>
        </div>
      </header>

      {/* Controls / Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="relative w-full sm:max-w-sm sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search coin pair (e.g. BTC/USDT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background/50 pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2">
          <Button 
            variant={filterAction === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterAction("all")}
            className="w-full sm:w-auto"
          >
            All
          </Button>
          <Button 
            variant={filterAction === "buy" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterAction("buy")}
            className={`w-full sm:w-auto ${filterAction === "buy" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
          >
            Buy
          </Button>
          <Button 
            variant={filterAction === "sell" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterAction("sell")}
            className={`w-full sm:w-auto ${filterAction === "sell" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
          >
            Sell
          </Button>
        </div>
      </div>

      {/* Trades List Card */}
      <Card className="border-border/60 bg-card/70 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between gap-2">
            <span>Executed Transactions</span>
            <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">{filteredTrades.length} entries</span>
          </CardTitle>
          <CardDescription className="text-xs">Detailed historical breakdown of order executions</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {filteredTrades.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No trade history found matching your filters.
            </div>
          ) : (
            <>
              {/* Mobile: stacked cards (below md) */}
              <div className="space-y-3 md:hidden">
                {filteredTrades.map((trade) => {
                  const isBuy = trade.action === "buy";
                  return (
                    <div 
                      key={trade.id} 
                      className="rounded-lg border border-border/50 bg-background/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`shrink-0 p-1.5 rounded-full ${isBuy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {isBuy ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                          </span>
                          <span className="font-medium text-foreground truncate">{trade.coinPair}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`shrink-0 text-[10px] uppercase font-bold ${
                            isBuy 
                              ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' 
                              : 'text-red-500 border-red-500/30 bg-red-500/10'
                          }`}
                        >
                          {trade.action}
                        </Badge>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
                          <p className="font-mono">{trade.price}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</p>
                          <p className="font-mono font-semibold">{trade.amount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
                          <p className="font-mono text-primary">{trade.total}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</p>
                          <p className="text-muted-foreground">{trade.date}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end border-t border-border/40 pt-2">
                        <StatusPill status={trade.status} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop / tablet: table (md and up) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-medium">Coin Pair</th>
                      <th className="pb-3 font-medium">Action</th>
                      <th className="pb-3 font-medium">Execution Price</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Total Value</th>
                      <th className="pb-3 font-medium">Date & Time</th>
                      <th className="pb-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredTrades.map((trade) => {
                      const isBuy = trade.action === "buy";
                      return (
                        <tr key={trade.id} className="group hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 font-medium text-foreground flex items-center gap-2">
                            <span className={`p-1.5 rounded-full ${isBuy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                              {isBuy ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                            </span>
                            {trade.coinPair}
                          </td>
                          <td>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] uppercase font-bold ${
                                isBuy 
                                  ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' 
                                  : 'text-red-500 border-red-500/30 bg-red-500/10'
                              }`}
                            >
                              {trade.action}
                            </Badge>
                          </td>
                          <td className="py-3.5 font-mono text-xs">{trade.price}</td>
                          <td className="py-3.5 font-mono text-xs font-semibold">{trade.amount}</td>
                          <td className="py-3.5 font-mono text-xs text-primary">{trade.total}</td>
                          <td className="py-3.5 text-xs text-muted-foreground">{trade.date}</td>
                          <td className="py-3.5 text-right">
                            <StatusPill status={trade.status} />
                          </td>
                        </tr>
                      );
                    })}
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