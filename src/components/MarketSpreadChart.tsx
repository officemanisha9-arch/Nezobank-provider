import { CandlestickChart as CandlestickIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dataset mapped with open, close, high, low, and volume for a professional candlestick feel
const marketCandleData = [
  { time: "09:00", open: 610.5, close: 612.8, high: 613.5, low: 609.8, volume: 145 },
  { time: "10:00", open: 612.8, close: 611.2, high: 614.0, low: 610.5, volume: 230 },
  { time: "11:00", open: 611.2, close: 614.5, high: 615.2, low: 611.0, volume: 310 },
  { time: "12:00", open: 614.5, close: 613.0, high: 615.8, low: 612.5, volume: 190 },
  { time: "13:00", open: 613.0, close: 615.5, high: 616.0, low: 612.0, volume: 420 },
  { time: "14:00", open: 615.5, close: 610.3, high: 616.5, low: 609.2, volume: 530 },
];

// Custom Candlestick Shape Renderer to draw bodies and wicks accurately
const CandlestickShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { open, close, high, low } = payload;
  const isRising = close >= open;
  const color = isRising ? "#10b981" : "#ef4444"; // Emerald green for bullish, Red for bearish
  const wickX = x + width / 2;

  return (
    <g>
      {/* High-Low Wick Line */}
      <line
        x1={wickX}
        y1={y - (Math.abs(high - Math.max(open, close)) * (height / Math.abs(open - close || 1)))}
        x2={wickX}
        y2={y + height + (Math.abs(Math.min(open, close) - low) * (height / Math.abs(open - close || 1)))}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Open-Close Body Bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={Math.max(height, 2)}
        fill={color}
        rx={1}
      />
    </g>
  );
};

export function MarketSpreadChart() {
  return (
    <Card className="border-border/60 bg-card/70 shadow-card">
      <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <CandlestickIcon className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="text-sm font-bold tracking-wide text-foreground">BNB/USDT</span>
            <span className="text-xs font-semibold text-emerald-500">610.3100</span>
          </div>
          <CardDescription className="text-xs mt-0.5">Intraday Candlestick & Volume Spread</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] text-muted-foreground">5m</Badge>
          <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30 bg-emerald-500/10">+2.45%</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="h-[220px] w-full pt-4 sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketCandleData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                domain={['dataMin - 1', 'dataMax + 1']} 
                orientation="right"
                width={44}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                formatter={(value: any, name: string) => [value, name.toUpperCase()]}
              />
              {/* Main Candlestick Bar mapping Open/Close delta */}
              <Bar 
                dataKey="close" 
                baseValue="open" 
                shape={<CandlestickShape />} 
                name="Price"
              >
                {marketCandleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.close >= entry.open ? "#10b981" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}