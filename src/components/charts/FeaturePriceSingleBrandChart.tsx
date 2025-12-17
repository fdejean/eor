"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import priceData from "@/data/stock_analysis/price_predictors.json"

export function FeaturePriceSingleBrandChart() {
    const $selectedBrand = useStore(selectedBrand);
    // @ts-ignore
    const data = priceData[$selectedBrand]?.slice(0, 20) || [];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Top Features for price correlation ({$selectedBrand.charAt(0).toUpperCase() + $selectedBrand.slice(1)})</CardTitle>
                <CardDescription>Top 20 Features by correlation for {$selectedBrand}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data} margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                            <XAxis type="number" stroke="#888888" fontSize={12} />
                            <YAxis dataKey="feature" type="category" width={100} stroke="#888888" fontSize={11} interval={0} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <ReferenceLine x={0} stroke="#000" />
                            <Bar dataKey="correlation" name="Correlation">
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.correlation > 0 ? "#16a34a" : "#ef4444"} fillOpacity={0.7} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
