import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  TrendingUp, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/panel/app/liquidity")({
  component: MarketLiquidityPage,
});

// Mock Dataset for Orders
const mockOrdersData = [
  { id: "ord-1", pair: "BTC/USDT", type: "Limit", price: "$67,500.00", amount: "0.25 BTC", status: "open", date: "2026-06-06 15:30" },
  { id: "ord-2", pair: "ETH/USDT", type: "Market", price: "$2,610.00", amount: "2.00 ETH", status: "complete", date: "2026-06-06 14:10" },
  { id: "ord-3", pair: "SOL/USDT", type: "Stop-Loss", price: "$175.50", amount: "15.00 SOL", status: "close", date: "2026-06-05 11:20" },
  { id: "ord-4", pair: "BNB/USDT", type: "Limit", price: "$605.00", amount: "4.50 BNB", status: "cancel", date: "2026-06-04 09:15" },
  { id: "ord-5", pair: "ADA/USDT", type: "Limit", price: "$0.44", amount: "5,000 ADA", status: "failed", date: "2026-06-03 18:45" },
];

// Mock Dataset for Trades
const mockTradesData = [
  { id: "trd-1", pair: "BTC/USDT", action: "buy", price: "$67,450.00", amount: "0.15 BTC", total: "$10,117.50", date: "2026-06-06 14:25" },
  { id: "trd-2", pair: "ETH/USDT", action: "sell", price: "$2,620.50", amount: "1.80 ETH", total: "$4,716.90", date: "2026-06-06 12:10" },
  { id: "trd-3", pair: "SOL/USDT", action: "buy", price: "$178.20", amount: "12.50 SOL", total: "$2,227.50", date: "2026-06-05 18:40" },
  { id: "trd-4", pair: "BNB/USDT", action: "sell", price: "$612.40", amount: "5.00 BNB", total: "$3,062.00", date: "2026-06-04 09:15" },
];

function MarketLiquidityPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "trades">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [tradeActionFilter, setTradeActionFilter] = useState<"all" | "buy" | "sell">("all");

  // Filtering Orders
  const filteredOrders = mockOrdersData.filter((order) => {
    const matchesSearch = order.pair.toLowerCase().includes(searchQuery.toLowerCase()) || order.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtering Trades
  const filteredTrades = mockTradesData.filter((trade) => {
    const matchesSearch = trade.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = tradeActionFilter === "all" || trade.action === tradeActionFilter;
    return matchesSearch && matchesAction;
  });

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] uppercase"><CheckCircle2 className="h-3 w-3 mr-1 inline" /> Complete</Badge>;
      case "open":
        return <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] uppercase"><Clock className="h-3 w-3 mr-1 inline" /> Open</Badge>;
      case "close":
        return <Badge className="bg-secondary text-muted-foreground text-[10px] uppercase"><CheckCircle2 className="h-3 w-3 mr-1 inline" /> Close</Badge>;
      case "cancel":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] uppercase"><XCircle className="h-3 w-3 mr-1 inline" /> Cancel</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/30 text-[10px] uppercase"><AlertTriangle className="h-3 w-3 mr-1 inline" /> Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] uppercase">{status}</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 md:space-y-8 animate-fade-in pb-12 px-1 sm:px-2">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Liquidity Pool</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Market Liquidity & Orders<span className="panel-gradient-text">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground">
            Manage your active market depth, track execution parameters, and inspect order-book statuses.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card/70 border border-border/60 p-1 rounded-xl w-full sm:w-auto self-start md:self-auto">
          <Button 
            variant={activeTab === "orders" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("orders")}
            className="text-xs flex-1 sm:flex-none"
          >
            Orders ({mockOrdersData.length})
          </Button>
          <Button 
            variant={activeTab === "trades" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("trades")}
            className="text-xs flex-1 sm:flex-none"
          >
            Trades ({mockTradesData.length})
          </Button>
        </div>
      </header>

      {/* Controls / Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search coin pair (e.g. BTC/USDT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background/50 pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Dynamic Filters depending on Tab with horizontal scroll support on mobile */}
        {activeTab === "orders" ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {["all", "open", "close", "cancel", "failed", "complete"].map((status) => (
              <Button
                key={status}
                variant={orderStatusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderStatusFilter(status)}
                className="text-xs capitalize shrink-0"
              >
                {status}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button
              variant={tradeActionFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTradeActionFilter("all")}
              className="text-xs shrink-0"
            >
              All Trades
            </Button>
            <Button
              variant={tradeActionFilter === "buy" ? "default" : "outline"}
              size="sm"
              onClick={() => setTradeActionFilter("buy")}
              className={`text-xs shrink-0 ${tradeActionFilter === "buy" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
            >
              Buy
            </Button>
            <Button
              variant={tradeActionFilter === "sell" ? "default" : "outline"}
              size="sm"
              onClick={() => setTradeActionFilter("sell")}
              className={`text-xs shrink-0 ${tradeActionFilter === "sell" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
            >
              Sell
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Card / Responsive Tables or Mobile Cards */}
      <Card className="border-border/60 bg-card/70 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="capitalize">{activeTab} Ledger</span>
            <span className="text-xs font-normal text-muted-foreground">
              Showing {activeTab === "orders" ? filteredOrders.length : filteredTrades.length} entries
            </span>
          </CardTitle>
          <CardDescription className="text-xs">
            {activeTab === "orders" ? "Real-time liquidity and open/closed order metrics" : "Executed trade logs showing buy/sell actions"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {activeTab === "orders" ? (
            filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No orders found matching the chosen status filter.</div>
            ) : (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 font-medium">Order ID & Pair</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Execution Price</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 font-medium text-foreground flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                              <Layers className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="font-semibold">{order.pair}</p>
                              <p className="text-[10px] font-mono text-muted-foreground">{order.id}</p>
                            </div>
                          </td>
                          <td>
                            <Badge variant="outline" className="text-[10px] font-mono">{order.type}</Badge>
                          </td>
                          <td className="py-3.5 font-mono text-xs">{order.price}</td>
                          <td className="py-3.5 font-mono text-xs font-semibold">{order.amount}</td>
                          <td className="py-3.5 text-xs text-muted-foreground">{order.date}</td>
                          <td className="py-3.5 text-right">{getOrderStatusBadge(order.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Stack View */}
                <div className="grid gap-3 md:hidden">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-border/40 bg-background/40 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <Layers className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{order.pair}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{order.id}</p>
                          </div>
                        </div>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30 text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase">Type & Price</span>
                          <span className="font-mono font-medium">{order.type} • {order.price}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase">Amount</span>
                          <span className="font-mono font-semibold">{order.amount}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground text-right pt-1">{order.date}</div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : (
            filteredTrades.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No trades found matching the action filter.</div>
            ) : (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 font-medium">Coin Pair</th>
                        <th className="pb-3 font-medium">Action</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Total Volume</th>
                        <th className="pb-3 font-medium text-right">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredTrades.map((trade) => {
                        const isBuy = trade.action === "buy";
                        return (
                          <tr key={trade.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3.5 font-medium text-foreground flex items-center gap-2">
                              <span className={`p-1.5 rounded-full ${isBuy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} shrink-0`}>
                                {isBuy ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                              </span>
                              {trade.pair}
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
                            <td className="py-3.5 text-xs text-muted-foreground text-right">{trade.date}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Stack View */}
                <div className="grid gap-3 md:hidden">
                  {filteredTrades.map((trade) => {
                    const isBuy = trade.action === "buy";
                    return (
                      <div key={trade.id} className="rounded-lg border border-border/40 bg-background/40 p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`p-1.5 rounded-full ${isBuy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                              {isBuy ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                            </span>
                            <span className="text-sm font-semibold">{trade.pair}</span>
                          </div>
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
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">Price / Amount</span>
                            <span className="font-mono">{trade.price} ({trade.amount})</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">Total Value</span>
                            <span className="font-mono font-semibold text-primary">{trade.total}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground text-right pt-1">{trade.date}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}