"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { seasonalData } from "@/data/mockData"

export function SeasonalChart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Seasonal Trends</CardTitle>
                <CardDescription>
                    Sentiment and Emotion variation over the year
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={seasonalData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="month"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="sentiment"
                                stroke="#8884d8"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                name="Sentiment"
                            />
                            <Line
                                type="monotone"
                                dataKey="emotion"
                                stroke="#82ca9d"
                                strokeWidth={2}
                                name="Emotion"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
