import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock Data
const seasonalData = [
  { period: "Winter", Anxiety: 0.42, Anger: 0.28, Sadness: 0.35, Affection: 0.52 },
  { period: "Spring", Anxiety: 0.32, Anger: 0.35, Sadness: 0.25, Affection: 0.58 },
  { period: "Summer", Anxiety: 0.25, Anger: 0.48, Sadness: 0.18, Affection: 0.62 },
  { period: "Fall", Anxiety: 0.48, Anger: 0.42, Sadness: 0.38, Affection: 0.45 },
];

const monthlyData = [
  { month: "Jan", Anxiety: 0.45, Anger: 0.25, Sadness: 0.40, Affection: 0.50 },
  { month: "Feb", Anxiety: 0.40, Anger: 0.28, Sadness: 0.35, Affection: 0.55 },
  { month: "Mar", Anxiety: 0.35, Anger: 0.30, Sadness: 0.30, Affection: 0.58 },
  { month: "Apr", Anxiety: 0.30, Anger: 0.35, Sadness: 0.25, Affection: 0.60 },
  { month: "May", Anxiety: 0.28, Anger: 0.40, Sadness: 0.20, Affection: 0.62 },
  { month: "Jun", Anxiety: 0.25, Anger: 0.45, Sadness: 0.18, Affection: 0.65 },
  { month: "Jul", Anxiety: 0.22, Anger: 0.50, Sadness: 0.15, Affection: 0.60 },
  { month: "Aug", Anxiety: 0.28, Anger: 0.48, Sadness: 0.18, Affection: 0.58 },
  { month: "Sep", Anxiety: 0.35, Anger: 0.45, Sadness: 0.25, Affection: 0.50 },
  { month: "Oct", Anxiety: 0.45, Anger: 0.40, Sadness: 0.30, Affection: 0.45 },
  { month: "Nov", Anxiety: 0.55, Anger: 0.35, Sadness: 0.40, Affection: 0.40 },
  { month: "Dec", Anxiety: 0.50, Anger: 0.25, Sadness: 0.45, Affection: 0.55 },
];

export function SeasonalRadarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggregate Seasonal Profile</CardTitle>
        <CardDescription>Average emotional intensity by season</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={seasonalData}>
              <PolarGrid stroke="oklch(0.3 0.05 250 / 30%)" />
              <PolarAngleAxis dataKey="period" stroke="oklch(0.65 0.02 250)" />
              <PolarRadiusAxis angle={90} domain={[0, 0.7]} stroke="oklch(0.65 0.02 250)" />
              <Radar name="Anxiety" dataKey="Anxiety" stroke="oklch(0.75 0.22 60)" fill="oklch(0.75 0.22 60)" fillOpacity={0.3} />
              <Radar name="Anger" dataKey="Anger" stroke="oklch(0.7 0.25 330)" fill="oklch(0.7 0.25 330)" fillOpacity={0.3} />
              <Radar name="Sadness" dataKey="Sadness" stroke="oklch(0.7 0.22 280)" fill="oklch(0.7 0.22 280)" fillOpacity={0.3} />
              <Radar name="Affection" dataKey="Affection" stroke="oklch(0.7 0.2 200)" fill="oklch(0.7 0.2 200)" fillOpacity={0.3} />
              <Legend />
              <Tooltip 
                contentStyle={{ backgroundColor: 'oklch(0.18 0.05 250 / 90%)', border: '1px solid oklch(0.3 0.05 250 / 30%)' }}
                itemStyle={{ color: 'oklch(0.985 0 0)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function MonthlyTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Emotional Trends</CardTitle>
        <CardDescription>Fine-grained analysis showing month-to-month shifts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.05 250 / 20%)" />
              <XAxis dataKey="month" stroke="oklch(0.65 0.02 250)" />
              <YAxis stroke="oklch(0.65 0.02 250)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'oklch(0.18 0.05 250 / 90%)', border: '1px solid oklch(0.3 0.05 250 / 30%)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Anxiety" stroke="oklch(0.75 0.22 60)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Anger" stroke="oklch(0.7 0.25 330)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Sadness" stroke="oklch(0.7 0.22 280)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Affection" stroke="oklch(0.7 0.2 200)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
