"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import sourceTargetDataMap from "@/data/stock_analysis/source_target_correlation.json"

export function SourceTargetCorrelationChart() {
    const $selectedBrand = useStore(selectedBrand);
    // @ts-ignore
    const sourceTargetData = sourceTargetDataMap[$selectedBrand] || [];

    return (
        <Card className="w-full flex flex-col">
            <CardHeader>
                <CardTitle>Source vs Target Correlation ({$selectedBrand})</CardTitle>
                <CardDescription>
                    Comparing correlation when the subreddit is the source (posting) vs target (being linked to).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={sourceTargetData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                            <XAxis type="number" domain={[-1, 1]} stroke="#888888" fontSize={12} />
                            <YAxis
                                dataKey="feature"
                                type="category"
                                width={120}
                                stroke="#888888"
                                fontSize={12}
                                interval={0}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                                formatter={(value: number) => value.toFixed(2)}
                            />
                            <Legend />
                            <ReferenceLine x={0} stroke="#000" />
                            <Bar dataKey="sourceCorr" name="Source Correlation" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="targetCorr" name="Target Correlation" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
