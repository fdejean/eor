"use client"

import { ComposedChart, Line, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { stockData } from "@/data/mockData"

export function StockChart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Sentiment vs Stock Price</CardTitle>
                <CardDescription>
                    Correlation between Reddit Sentiment and Stock Market Value
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={stockData}>
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
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Sentiment', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Price ($)', angle: 90, position: 'insideRight' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="sentiment" barSize={20} fill="#413ea0" name="Sentiment" />
                            <Line yAxisId="right" type="monotone" dataKey="price" stroke="#ff7300" name="Stock Price" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
