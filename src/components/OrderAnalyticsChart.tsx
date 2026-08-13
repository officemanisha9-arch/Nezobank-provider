import { LineChart as LineChartIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const orderAnalyticsData = [
  { name: "Mon", orders: 45, trades: 24 },
  { name: "Tue", orders: 52, trades: 38 },
  { name: "Wed", orders: 38, trades: 30 },
  { name: "Thu", orders: 65, trades: 48 },
  { name: "Fri", orders: 78, trades: 55 },
  { name: "Sat", orders: 90, trades: 70 },
  { name: "Sun", orders: 85, trades: 65 },
];

export function OrderAnalyticsChart() {
  return (
    <Card className="border-border/60 bg-card/70 shadow-card">
      <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <div className="min-w-0">
          <CardTitle className="text-base flex items-center gap-2">
            <LineChartIcon className="h-4 w-4 shrink-0 text-primary" />
            Orders & Trade Analytics
          </CardTitle>
          <CardDescription className="text-xs">Weekly performance comparison overview</CardDescription>
        </div>
        <Badge variant="outline" className="w-fit text-[10px]">Real-time</Badge>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="h-[220px] w-full pt-4 sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={orderAnalyticsData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTrades" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={16}
              />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={32} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" name="Orders" />
              <Area type="monotone" dataKey="trades" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorTrades)" name="Trades" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}