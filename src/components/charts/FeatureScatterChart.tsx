"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import featureCorrelations from "@/data/stock_analysis/feature_correlations_scatter.json"

export function FeatureScatterChart() {
    const $selectedBrand = useStore(selectedBrand);
    // @ts-ignore
    const data = featureCorrelations[$selectedBrand] || [];

    // Helper to interpolate color from Red (low) to Green (high)
    const getColor = (value: number) => {
        // Simple thresholding for demonstration
        // Using average correlation abs value or raw value? 
        // Original code seemed to use consistency/strength. 
        // Let's use absolute average correlation to show "strength" of relationship.
        const strength = Math.abs(value);
        if (strength > 0.3) return "#16a34a"; // Green - High correlation
        if (strength > 0.15) return "#eab308"; // Yellow - Moderate
        return "#ef4444"; // Red - Low correlation
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Price vs Volume ({$selectedBrand})</CardTitle>
                <CardDescription>
                    Scatter plot of feature correlations for {$selectedBrand}. Color = strength (avg correlation).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis
                                type="number"
                                dataKey="price_correlation"
                                name="Price Corr"
                                label={{ value: 'Price Correlation', position: 'bottom', offset: 0 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="volume_correlation"
                                name="Volume Corr"
                                label={{ value: 'Volume Correlation', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-background border rounded p-2 text-sm shadow-md">
                                                <p className="font-bold">{data.feature}</p>
                                                <p>Price Corr: {data.price_correlation?.toFixed(3)}</p>
                                                <p>Volume Corr: {data.volume_correlation?.toFixed(3)}</p>
                                                <p>Avg Corr: {data.avg_correlation?.toFixed(3)}</p>
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
                                    <Cell key={`cell-${index}`} fill={getColor(entry.avg_correlation)} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
