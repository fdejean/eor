"use client"

import { useState, useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import rawData from "@/data/seasonal/annual_patterns.json"

// Map technical names to display names
const emotionMap: Record<string, string> = {
    "LIWC_Affect": "Affection",
    "LIWC_Posemo": "Positive Emotion",
    "LIWC_Negemo": "Negative Emotion",
    "LIWC_Anger": "Anger",
    "LIWC_Anx": "Anxiety",
    "LIWC_Sad": "Sadness"
}

const colors: Record<string, string> = {
    "Positive Emotion": "#22c55e", // green-500
    "Affection": "#10b981", // emerald-500
    "Negative Emotion": "#ef4444", // red-500
    "Anger": "#dc2626", // red-600
    "Anxiety": "#f59e0b", // amber-500
    "Sadness": "#3b82f6" // blue-500
}

export function SeasonalChart() {
    const [visibleEmotions, setVisibleEmotions] = useState<string[]>(["Positive Emotion", "Negative Emotion", "Anger", "Sadness"])

    const data = useMemo(() => {
        const processedData = []
        const columns = rawData.columns
        const indices = rawData.index
        const values = rawData.data

        for (let i = 0; i < indices.length; i++) {
            const day = indices[i]
            const entry: any = { day }
            
            for (let j = 0; j < columns.length; j++) {
                const colName = columns[j]
                const displayName = emotionMap[colName] || colName
                entry[displayName] = values[i][j]
            }
            processedData.push(entry)
        }
        return processedData
    }, [])

    const toggleEmotion = (emotion: string) => {
        setVisibleEmotions(prev => 
            prev.includes(emotion) 
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        )
    }

    const formatXAxis = (tickItem: number) => {
        const date = new Date(2024, 0, tickItem); // Leap year for 366 days
        return date.toLocaleString('default', { month: 'short' });
    }

    return (
        <Card className="w-full h-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Annual Emotional Patterns</CardTitle>
                <CardDescription>
                    7-day moving average of emotion intensity throughout the year
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                    {Object.values(emotionMap).map(emotion => (
                        <Button
                            key={emotion}
                            variant={visibleEmotions.includes(emotion) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleEmotion(emotion)}
                            className="text-xs h-7"
                            style={{ 
                                backgroundColor: visibleEmotions.includes(emotion) ? colors[emotion] : undefined,
                                borderColor: colors[emotion],
                                color: visibleEmotions.includes(emotion) ? 'white' : colors[emotion]
                            }}
                        >
                            {emotion}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatXAxis}
                            interval={30}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toFixed(2)}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)', opacity: 1 }}
                            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                            labelFormatter={(label) => {
                                const date = new Date(2024, 0, label);
                                return date.toLocaleDateString('default', { month: 'long', day: 'numeric' });
                            }}
                            formatter={(value: number) => value.toExponential(2)}
                        />
                        <Legend />
                        {Object.values(emotionMap).map(emotion => (
                            visibleEmotions.includes(emotion) && (
                                <Line
                                    key={emotion}
                                    type="monotone"
                                    dataKey={emotion}
                                    stroke={colors[emotion] || "#8884d8"}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
