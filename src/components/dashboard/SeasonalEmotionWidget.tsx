import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

// Mock data: Seasonal emotional cycles
const mockData = [
  { 
    period: "Winter (Dec-Feb)", 
    Anxiety: 0.42, 
    Anger: 0.28, 
    Sadness: 0.35, 
    Affection: 0.52 
  },
  { 
    period: "Spring (Mar-May)", 
    Anxiety: 0.32, 
    Anger: 0.35, 
    Sadness: 0.25, 
    Affection: 0.58 
  },
  { 
    period: "Summer (Jun-Aug)", 
    Anxiety: 0.25, 
    Anger: 0.48, 
    Sadness: 0.18, 
    Affection: 0.62 
  },
  { 
    period: "Fall (Sep-Nov)", 
    Anxiety: 0.48, 
    Anger: 0.42, 
    Sadness: 0.38, 
    Affection: 0.45 
  },
];

export default function SeasonalEmotionWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasonal Emotional Cycles</CardTitle>
        <CardDescription>
          How emotions vary across seasons — LIWC sentiment analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={mockData}>
            <PolarGrid stroke="oklch(0.3 0.05 250 / 30%)" />
            <PolarAngleAxis 
              dataKey="period" 
              stroke="oklch(0.65 0.02 250)"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 1]}
              stroke="oklch(0.65 0.02 250)"
              style={{ fontSize: '11px', fontFamily: 'Geist Mono, monospace' }}
            />
            <Radar 
              name="Anxiety" 
              dataKey="Anxiety" 
              stroke="oklch(0.75 0.22 60)" 
              fill="oklch(0.75 0.22 60)" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar 
              name="Anger" 
              dataKey="Anger" 
              stroke="oklch(0.7 0.25 330)" 
              fill="oklch(0.7 0.25 330)" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar 
              name="Sadness" 
              dataKey="Sadness" 
              stroke="oklch(0.7 0.22 280)" 
              fill="oklch(0.7 0.22 280)" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar 
              name="Affection" 
              dataKey="Affection" 
              stroke="oklch(0.7 0.2 200)" 
              fill="oklch(0.7 0.2 200)" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend 
              wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground space-y-1">
          <p>💡 <strong>Insight:</strong> Anxiety peaks in Fall (election season), while Affection peaks in Summer.</p>
        </div>
      </CardContent>
    </Card>
  );
}
