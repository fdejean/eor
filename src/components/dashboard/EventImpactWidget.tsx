import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Mock data: Brexit vote impact (±7 days)
const mockData = [
  { day: -7, stock_volatility: 11.2, reddit_conflict: 0.65 },
  { day: -6, stock_volatility: 10.8, reddit_conflict: 0.68 },
  { day: -5, stock_volatility: 12.1, reddit_conflict: 0.72 },
  { day: -4, stock_volatility: 13.5, reddit_conflict: 0.78 },
  { day: -3, stock_volatility: 15.2, reddit_conflict: 0.85 },
  { day: -2, stock_volatility: 18.4, reddit_conflict: 1.12 },
  { day: -1, stock_volatility: 22.8, reddit_conflict: 1.45 },
  { day: 0, stock_volatility: 45.2, reddit_conflict: 2.38 }, // Brexit Vote Day
  { day: 1, stock_volatility: 52.6, reddit_conflict: 2.85 },
  { day: 2, stock_volatility: 48.3, reddit_conflict: 2.52 },
  { day: 3, stock_volatility: 38.7, reddit_conflict: 2.15 },
  { day: 4, stock_volatility: 32.5, reddit_conflict: 1.82 },
  { day: 5, stock_volatility: 26.8, reddit_conflict: 1.48 },
  { day: 6, stock_volatility: 22.1, reddit_conflict: 1.25 },
  { day: 7, stock_volatility: 18.5, reddit_conflict: 1.05 },
];

export default function EventImpactWidget() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Real-World Event Impact: Brexit Vote</CardTitle>
        <CardDescription>
          Stock market volatility vs. Reddit conflict score around June 23, 2016
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.05 250 / 20%)" />
            <XAxis 
              dataKey="day" 
              stroke="oklch(0.65 0.02 250)"
              style={{ fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}
              label={{ value: 'Days from Event', position: 'insideBottom', offset: -5, fill: 'oklch(0.65 0.02 250)' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="oklch(0.75 0.22 60)"
              style={{ fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}
              label={{ value: 'Stock Volatility (%)', angle: -90, position: 'insideLeft', fill: 'oklch(0.75 0.22 60)' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="oklch(0.7 0.25 330)"
              style={{ fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}
              label={{ value: 'Reddit Conflict Score', angle: 90, position: 'insideRight', fill: 'oklch(0.7 0.25 330)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(0.18 0.05 250 / 90%)', 
                border: '1px solid oklch(0.3 0.05 250 / 30%)',
                borderRadius: '8px',
                backdropFilter: 'blur(12px)'
              }}
              labelStyle={{ color: 'oklch(0.985 0 0)', fontFamily: 'Geist Mono, monospace' }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend 
              wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            />
            <ReferenceLine 
              x={0} 
              yAxisId="left"
              stroke="oklch(0.7 0.2 200)" 
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{ value: 'Brexit Vote', position: 'top', fill: 'oklch(0.7 0.2 200)', fontWeight: 600 }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="stock_volatility" 
              stroke="oklch(0.75 0.22 60)" 
              strokeWidth={3}
              name="Stock Volatility (%)"
              dot={{ fill: 'oklch(0.75 0.22 60)', r: 4 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="reddit_conflict" 
              stroke="oklch(0.7 0.25 330)" 
              strokeWidth={3}
              name="Reddit Conflict"
              dot={{ fill: 'oklch(0.7 0.25 330)', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>💡 <strong>Correlation:</strong> Both metrics spike dramatically on event day, suggesting Reddit discourse mirrors real-world volatility.</p>
        </div>
      </CardContent>
    </Card>
  );
}
