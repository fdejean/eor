"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import rawData from "@/data/seasonal/seasonal_emotions.json"
import cluster0 from "@/data/seasonal/cluster_0.json"
import cluster12 from "@/data/seasonal/cluster_12.json"
import cluster19 from "@/data/seasonal/cluster_19.json"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const datasets: Record<string, any> = {
    "global": rawData,
    "cluster0": cluster0,
    "cluster12": cluster12,
    "cluster19": cluster19
}

const clusterDescriptions: Record<string, string> = {
    "global": "All subreddits aggregated.",
    "cluster0": "Chill subreddits (chillwave, ambientmusic, chillout).",
    "cluster12": "Shooter games (doom, battlefield, falloutmods).",
    "cluster19": "Modding and emulating communities (dolphinemulator, xcom2mods, obs)."
}

export function SeasonalHeatmap() {
    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Seasonal Emotion Intensity</CardTitle>
                <CardDescription>
                    Heatmap showing the intensity of each emotion across seasons.
                    <br/>
                    <span className="text-xs text-muted-foreground">Darker colors indicate higher intensity.</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <Tabs defaultValue="global" className="w-full">
                    <TabsList className="mb-4 w-full justify-start overflow-x-auto">
                        <TabsTrigger value="global">Global</TabsTrigger>
                        <TabsTrigger value="cluster0">Cluster 0</TabsTrigger>
                        <TabsTrigger value="cluster12">Cluster 12</TabsTrigger>
                        <TabsTrigger value="cluster19">Cluster 19</TabsTrigger>
                    </TabsList>
                    
                    {Object.keys(datasets).map(key => (
                        <TabsContent key={key} value={key} className="space-y-4">
                            <p className="text-sm text-muted-foreground italic">
                                {clusterDescriptions[key]}
                            </p>
                            <HeatmapGrid data={datasets[key]} />
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    )
}

function HeatmapGrid({ data }: { data: any }) {
    const { columns: seasons, index: emotions, data: values } = data

    // Find min and max for scaling colors
    const allValues = values.flat()
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)

    const getColor = (value: number) => {
        // Normalize value between 0 and 1
        const normalized = (value - min) / (max - min)
        // Use a red scale (or purple/blue)
        // Low: 255, 245, 245 (light red) -> High: 153, 27, 27 (dark red)
        // Let's use HSL for easier interpolation
        // Light: 0, 100%, 98% -> Dark: 0, 70%, 40%
        const lightness = 98 - (normalized * 58)
        return `hsl(0, 80%, ${lightness}%)`
    }
    
    const getTextColor = (value: number) => {
        const normalized = (value - min) / (max - min)
        return normalized > 0.6 ? 'white' : 'black'
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-separate border-spacing-1">
                <thead>
                    <tr>
                        <th className="p-2"></th>
                        {seasons.map((season: string) => (
                            <th key={season} className="p-2 font-medium text-center">{season}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {emotions.map((emotion: string, i: number) => (
                        <tr key={emotion}>
                            <td className="p-2 font-medium whitespace-nowrap">{emotion}</td>
                            {seasons.map((_: any, j: number) => {
                                const value = values[i][j]
                                return (
                                    <td key={j} className="p-0">
                                        <div 
                                            className="w-16 h-10 rounded flex items-center justify-center text-xs transition-all hover:scale-105 shadow-sm mx-auto"
                                            style={{ backgroundColor: getColor(value), color: getTextColor(value) }}
                                            title={`${emotion} in ${seasons[j]}: ${value.toFixed(3)}`}
                                        >
                                            {value.toFixed(2)}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
