"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import brandsData from "@/data/brands_data.json"

export function FeatureScatterChart() {
    const $selectedBrand = useStore(selectedBrand);
    // @ts-ignore
    const data = brandsData[$selectedBrand]?.scatter || [];

    // Helper to interpolate color from Red (low) to Green (high)
    const getColor = (value: number) => {
        // Simple thresholding for demonstration
        if (value > 0.6) return "#16a34a"; // Green
        if (value > 0.3) return "#eab308"; // Yellow
        return "#ef4444"; // Red
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Price vs Volume ({$selectedBrand})</CardTitle>
                <CardDescription>
                    Scatter plot of feature correlations for {$selectedBrand}. Size = consistency, Color = strength.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="priceCorr" name="Price Corr" label={{ value: 'Avg Price Correlation', position: 'bottom', offset: 0 }} />
                            <YAxis type="number" dataKey="volumeCorr" name="Volume Corr" label={{ value: 'Avg Volume Correlation', angle: -90, position: 'insideLeft' }} />
                            <ZAxis type="number" dataKey="consistency" range={[50, 400]} name="Consistency" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-background border rounded p-2 text-sm shadow-md">
                                                <p className="font-bold">{data.feature}</p>
                                                <p>Price Corr: {data.priceCorr}</p>
                                                <p>Volume Corr: {data.volumeCorr}</p>
                                                <p>Consistency: {data.consistency}</p>
                                                <p>Overall: {data.absAvgOverall}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <ReferenceLine y={0} stroke="#000" />
                            <ReferenceLine x={0} stroke="#000" />
                            <Scatter name="Features" data={data}>
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.absAvgOverall)} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
