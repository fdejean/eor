import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Mock Data
const eventData = [
  { date: "2016-06-15", volatility: 15, conflict: 0.8, label: "" },
  { date: "2016-06-16", volatility: 18, conflict: 0.9, label: "" },
  { date: "2016-06-17", volatility: 22, conflict: 1.1, label: "" },
  { date: "2016-06-18", volatility: 20, conflict: 1.0, label: "" },
  { date: "2016-06-19", volatility: 19, conflict: 0.9, label: "" },
  { date: "2016-06-20", volatility: 25, conflict: 1.2, label: "" },
  { date: "2016-06-21", volatility: 28, conflict: 1.4, label: "" },
  { date: "2016-06-22", volatility: 35, conflict: 1.8, label: "" },
  { date: "2016-06-23", volatility: 65, conflict: 3.2, label: "Brexit Vote" },
  { date: "2016-06-24", volatility: 85, conflict: 4.5, label: "Results" },
  { date: "2016-06-25", volatility: 70, conflict: 3.8, label: "" },
  { date: "2016-06-26", volatility: 60, conflict: 3.0, label: "" },
  { date: "2016-06-27", volatility: 55, conflict: 2.5, label: "" },
  { date: "2016-06-28", volatility: 45, conflict: 2.0, label: "" },
  { date: "2016-06-29", volatility: 40, conflict: 1.8, label: "" },
];

export default function EventTimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Study: Brexit Vote (June 2016)</CardTitle>
        <CardDescription>
          Correlation between Stock Market Volatility (VIX) and Reddit Conflict Index
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={eventData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.05 250 / 20%)" />
              <XAxis dataKey="date" stroke="oklch(0.65 0.02 250)" />
              <YAxis yAxisId="left" label={{ value: 'Stock Volatility', angle: -90, position: 'insideLeft' }} stroke="oklch(0.75 0.22 60)" />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Conflict Score', angle: 90, position: 'insideRight' }} stroke="oklch(0.7 0.25 330)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'oklch(0.18 0.05 250 / 90%)', border: '1px solid oklch(0.3 0.05 250 / 30%)' }}
              />
              <Legend />
              <ReferenceLine x="2016-06-23" stroke="oklch(0.985 0 0)" label="Vote Day" />
              <Line yAxisId="left" type="monotone" dataKey="volatility" stroke="oklch(0.75 0.22 60)" strokeWidth={3} dot={false} name="Market Volatility" />
              <Bar yAxisId="right" dataKey="conflict" fill="oklch(0.7 0.25 330)" opacity={0.6} name="Reddit Conflict" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
