"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import rawData from "@/data/seasonal/annual_patterns.json"

// Map technical names to display names
const emotionMap: Record<string, string> = {
    "LIWC_Affect": "Affection",
    "LIWC_Posemo": "Positive Emotion",
    "LIWC_Negemo": "Negative Emotion",
    "LIWC_Anx": "Anxiety",
    "LIWC_Anger": "Anger",
    "LIWC_Sad": "Sadness"
}

const colors: Record<string, string> = {
    "Positive Emotion": "#22c55e", // green-500
    "Affection": "#10b981", // emerald-500
    "Negative Emotion": "#ef4444", // red-500
    "Anxiety": "#f59e0b", // amber-500
    "Anger": "#dc2626", // red-600
    "Sadness": "#3b82f6" // blue-500
}

// Pre-process data outside component to improve performance
const processedData = (() => {
    const data = []
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
        data.push(entry)
    }
    return data
})()

// Calculate max values for normalization
const maxValues: Record<string, number> = {}
Object.values(emotionMap).forEach(emotion => {
    maxValues[emotion] = Math.max(...processedData.map(d => d[emotion] as number))
})

const PRESETS = [
    {
        id: "holiday",
        title: "Holiday Bookends",
        description: "Positive Emotion and Affection form a 'U' shape: high at the start, dipping in summer, and soaring back for the holidays.",
        emotions: ["Positive Emotion", "Affection"]
    },
    {
        id: "rising",
        title: "Rising Temperature",
        description: "Anger and Negative Emotion thaw out with the weather, climbing steadily to reach a fever pitch in Summer and Fall.",
        emotions: ["Anger", "Negative Emotion"]
    },
    {
        id: "spikes",
        title: "Sudden Storms",
        description: "Sadness and Anxiety don't follow the seasons; they strike in violent, evenly distributed spikes throughout the year, piercing the calendar's rhythm.",
        emotions: ["Sadness", "Anxiety"]
    }
]

export function AnnualPulseSection() {
    const [visibleEmotions, setVisibleEmotions] = useState<string[]>(PRESETS[0].emotions)
    const [activePreset, setActivePreset] = useState<string | null>(PRESETS[0].id)

    const toggleEmotion = (emotion: string) => {
        const newEmotions = visibleEmotions.includes(emotion)
            ? visibleEmotions.filter(e => e !== emotion)
            : [...visibleEmotions, emotion]
        
        setVisibleEmotions(newEmotions)
        setActivePreset(null) // Deselect preset on manual toggle
    }

    const selectPreset = (presetId: string) => {
        const preset = PRESETS.find(p => p.id === presetId)
        if (preset) {
            setVisibleEmotions(preset.emotions)
            setActivePreset(presetId)
        }
    }

    const formatXAxis = (tickItem: number) => {
        const date = new Date(2024, 0, tickItem); // Leap year for 366 days
        return date.toLocaleString('default', { month: 'short' });
    }

    const chartData = processedData

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-center w-full">
            <div className="lg:col-span-2 h-[60vh] flex flex-col p-6 bg-muted/10 rounded-xl border">
                 {/* Chart Header with Toggles */}
                 <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {Object.values(emotionMap).map(emotion => (
                            <Button
                                key={emotion}
                                variant="outline"
                                size="sm"
                                onClick={() => toggleEmotion(emotion)}
                                className={cn(
                                    "text-xs h-7 transition-all",
                                    visibleEmotions.includes(emotion) 
                                        ? "border-transparent text-white hover:text-white" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                style={{ 
                                    backgroundColor: visibleEmotions.includes(emotion) ? colors[emotion] : undefined,
                                }}
                            >
                                {emotion}
                            </Button>
                        ))}
                    </div>
                 </div>

                 {/* Chart */}
                 <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)', opacity: 1 }}
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
                                        isAnimationActive={false} // Disable animation for faster updates
                                    />
                                )
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-muted-foreground italic text-center lg:text-left">
                    Click on the stories to reveal the patterns:
                </p>
                {PRESETS.map(preset => (
                    <button
                        key={preset.id}
                        onClick={() => selectPreset(preset.id)}
                        className={cn(
                            "w-full p-4 rounded-lg text-left transition-all border-2",
                            activePreset === preset.id
                                ? "bg-primary/5 border-primary shadow-md"
                                : "bg-muted/20 border-transparent hover:bg-muted/30"
                        )}
                    >
                        <h4 className={cn("font-semibold mb-2", activePreset === preset.id ? "text-primary" : "")}>
                            {preset.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {preset.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    )
}
