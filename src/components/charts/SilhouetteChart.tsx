"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import data from "@/data/preprocessing/silhouette_scores.json"

export function SilhouetteChart() {
    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader>
                <CardTitle>Silhouette Analysis for Optimal k</CardTitle>
                <CardDescription>
                    Silhouette score for different numbers of clusters. Higher is better.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 25,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="k" 
                            label={{ value: 'Number of Clusters (k)', position: 'insideBottom', offset: -10 }} 
                        />
                        <YAxis 
                            label={{ value: 'Silhouette Score', angle: -90, position: 'insideLeft' }} 
                        />
                        <Tooltip 
                            formatter={(value: number) => [value.toFixed(4), "Silhouette Score"]}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#008000" 
                            strokeWidth={2}
                            dot={{ r: 5, fill: "#008000" }}
                            activeDot={{ r: 8 }} 
                        />
                        {}
                        <ReferenceLine x={9} stroke="red" strokeDasharray="3 3" label="Selected k=9" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
