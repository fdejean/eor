"use client"

import { ComposedChart, Line, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import weeklySentimentData from "@/data/weekly_sentiment.json"

export function WeeklyVolatilityChart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Weekly Sentiment vs Price Volatility</CardTitle>
                <CardDescription>
                    Weekly analysis of r/apple sentiment (Total & Negative) against AAPL Price Volatility.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={weeklySentimentData}>
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
                                stroke="#16a34a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Volatility', angle: 90, position: 'insideRight', fill: '#16a34a' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="negativeSentiment" barSize={20} fill="#ef4444" name="Negative Sentiment" fillOpacity={0.6} />
                            <Line yAxisId="left" type="monotone" dataKey="totalSentiment" stroke="#1e40af" strokeWidth={2} dot={{ r: 3 }} name="Total Sentiment" />
                            <Line yAxisId="right" type="monotone" dataKey="priceVolatility" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} name="Price Volatility" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
