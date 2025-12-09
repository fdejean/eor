import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data: 24 months of sentiment data
const mockData = [
  { date: "2014-01", positive_in: 120, negative_in: 45, positive_out: 110, negative_out: 50 },
  { date: "2014-02", positive_in: 135, negative_in: 52, positive_out: 125, negative_out: 48 },
  { date: "2014-03", positive_in: 142, negative_in: 48, positive_out: 138, negative_out: 45 },
  { date: "2014-04", positive_in: 128, negative_in: 55, positive_out: 122, negative_out: 58 },
  { date: "2014-05", positive_in: 155, negative_in: 62, positive_out: 148, negative_out: 65 },
  { date: "2014-06", positive_in: 168, negative_in: 58, positive_out: 162, negative_out: 55 },
  { date: "2014-07", positive_in: 145, negative_in: 68, positive_out: 140, negative_out: 72 },
  { date: "2014-08", positive_in: 132, negative_in: 95, positive_out: 128, negative_out: 98 },
  { date: "2014-09", positive_in: 158, negative_in: 88, positive_out: 152, negative_out: 92 },
  { date: "2014-10", positive_in: 175, negative_in: 105, positive_out: 168, negative_out: 110 },
  { date: "2014-11", positive_in: 192, negative_in: 125, positive_out: 185, negative_out: 128 },
  { date: "2014-12", positive_in: 165, negative_in: 82, positive_out: 158, negative_out: 85 },
  { date: "2015-01", positive_in: 148, negative_in: 72, positive_out: 142, negative_out: 75 },
  { date: "2015-02", positive_in: 162, negative_in: 78, positive_out: 155, negative_out: 82 },
  { date: "2015-03", positive_in: 178, negative_in: 85, positive_out: 172, negative_out: 88 },
  { date: "2015-04", positive_in: 185, negative_in: 92, positive_out: 178, negative_out: 95 },
  { date: "2015-05", positive_in: 195, negative_in: 102, positive_out: 188, negative_out: 105 },
  { date: "2015-06", positive_in: 205, negative_in: 115, positive_out: 198, negative_out: 118 },
  { date: "2015-07", positive_in: 188, negative_in: 125, positive_out: 182, negative_out: 128 },
  { date: "2015-08", positive_in: 172, negative_in: 135, positive_out: 165, negative_out: 138 },
  { date: "2015-09", positive_in: 198, negative_in: 145, positive_out: 192, negative_out: 148 },
  { date: "2015-10", positive_in: 215, negative_in: 158, positive_out: 208, negative_out: 162 },
  { date: "2015-11", positive_in: 225, negative_in: 175, positive_out: 218, negative_out: 178 },
  { date: "2015-12", positive_in: 195, negative_in: 125, positive_out: 188, negative_out: 128 },
];

export default function SentimentSpikesWidget() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Network Sentiment Spikes</CardTitle>
        <CardDescription>
          Positive vs. negative hyperlink creation over time — the "heartbeat" of Reddit discourse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.05 250 / 20%)" />
            <XAxis 
              dataKey="date" 
              stroke="oklch(0.65 0.02 250)"
              style={{ fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}
            />
            <YAxis 
              stroke="oklch(0.65 0.02 250)"
              style={{ fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(0.18 0.05 250 / 90%)', 
                border: '1px solid oklch(0.3 0.05 250 / 30%)',
                borderRadius: '8px',
                backdropFilter: 'blur(12px)'
              }}
              labelStyle={{ color: 'oklch(0.985 0 0)', fontFamily: 'Geist Mono, monospace' }}
            />
            <Legend 
              wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            />
            <Line 
              type="monotone" 
              dataKey="positive_in" 
              stroke="oklch(0.7 0.2 200)" 
              strokeWidth={2}
              name="Positive In"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="negative_in" 
              stroke="oklch(0.7 0.25 330)" 
              strokeWidth={2}
              name="Negative In"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="positive_out" 
              stroke="oklch(0.75 0.2 150)" 
              strokeWidth={2}
              name="Positive Out"
              dot={false}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="negative_out" 
              stroke="oklch(0.75 0.22 60)" 
              strokeWidth={2}
              name="Negative Out"
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
