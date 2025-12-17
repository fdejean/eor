"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import volumeDataMap from "@/data/stock_analysis/volume_predictors.json"

export function FeatureVolumeSingleBrandChart() {
    const $selectedBrand = useStore(selectedBrand);
    // @ts-ignore
    const volumeData = (volumeDataMap[$selectedBrand] || []).slice(0, 10);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Top Predictors ({$selectedBrand})</CardTitle>
                <CardDescription>Top features for predicting Volume correlation for {$selectedBrand}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">


                    {/* Volume Chart */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={volumeData} margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                            <XAxis type="number" stroke="#888888" fontSize={12} />
                            <YAxis dataKey="feature" type="category" width={100} stroke="#888888" fontSize={11} interval={0} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }} itemStyle={{ color: 'var(--foreground)' }} />
                            <ReferenceLine x={0} stroke="#000" />
                            <Bar dataKey="corr" name="Volume Corr">
                                {volumeData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.corr > 0 ? "#f97316" : "#a855f7"} fillOpacity={0.7} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
