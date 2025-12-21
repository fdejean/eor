"use client"

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SpikeData {
    YEAR_MONTH: string
    X_POS: number
    spike_value: number
    baseline: number
    subreddit: string
}

interface SpikeScatterChartProps {
    title: string
    data: SpikeData[]
    color: string
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[var(--background)] border border-[var(--border)] p-3 rounded shadow-lg text-sm">
                <p className="font-bold mb-1">{data.subreddit}</p>
                <p className="text-muted-foreground text-xs">{data.YEAR_MONTH}</p>
                <div className="mt-2 space-y-1">
                    <p>Spike: <span className="font-mono font-bold">{Math.round(data.spike_value)}</span></p>
                    <p className="text-muted-foreground">Avg: {Math.round(data.baseline)}</p>
                </div>
            </div>
        );
    }
    return null;
};

export function SpikeScatterChart({ title, data, color }: SpikeScatterChartProps) {
    return (
        <Card className="w-full h-full min-h-[400px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full p-0 pr-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-20" />
                        <XAxis
                            type="number"
                            dataKey="X_POS"
                            name="Month"
                            tick={false} // Hiding ticks because labels might overlap; rely on tooltip
                            axisLine={false}
                            label={{ value: 'Time (Months)', position: 'insideBottom', offset: 0, fontSize: 12, fill: '#888' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="spike_value"
                            name="Links"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Legend verticalAlign="top" height={36} />

                        {/* 1. The Spike Values (Anomalies) */}
                        <Scatter
                            name="Spike"
                            data={data}
                            fill={color}
                            opacity={0.8}
                            shape="circle"
                        />

                        {/* 2. The Baseline (Rolling Average) - plotted as smaller, lighter dots */}
                        <Scatter
                            name="Baseline"
                            data={data}
                            dataKey="baseline"
                            fill="#888888"
                            opacity={0.5}
                            shape="square"
                            legendType="none" // Hide second legend item to keep it clean
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}