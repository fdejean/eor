"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { ComposedChart, Line, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import weeklySentimentData from "@/data/stock_analysis/weekly_sentiment_price.json"

export function WeeklySentimentChart() {
    const $selectedBrand = useStore(selectedBrand);
    const data = (weeklySentimentData as Record<string, any[]>)[$selectedBrand.toLowerCase()] || [];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Weekly Sentiment vs Stock Price</CardTitle>
                <CardDescription>
                    Weekly analysis of r/{$selectedBrand} sentiment (Total & Negative) against {$selectedBrand.toUpperCase()} Closing Price.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#1e40af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', fill: '#1e40af' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#15803d"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Price ($)', angle: 90, position: 'insideRight', fill: '#15803d' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="negativity_sentiment" barSize={20} fill="#ef4444" name="Negative Sentiment" fillOpacity={0.6} />
                            <Line yAxisId="left" type="monotone" dataKey="total_sentiment" stroke="#1e40af" strokeWidth={2} dot={false} name="Total Sentiment" />
                            <Line yAxisId="right" type="monotone" dataKey="price" stroke="#15803d" strokeWidth={2} dot={false} name="Close Price" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
