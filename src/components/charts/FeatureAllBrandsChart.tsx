"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import brandsData from "@/data/stock_analysis/brands_data.json"

export function FeatureAllBrandsChart() {
    const $selectedBrand = useStore(selectedBrand);
    // @ts-ignore
    const data = brandsData[$selectedBrand]?.allBrands?.slice(0, 20) || [];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Top Features (Aggregate)</CardTitle>
                <CardDescription>Top features by average correlation for {$selectedBrand} selection</CardDescription>
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
                            <Bar dataKey="avgCorrelation" name="Avg Correlation">
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.avgCorrelation > 0 ? "#16a34a" : "#ef4444"} fillOpacity={0.7} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
