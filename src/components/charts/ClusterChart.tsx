"use client"

import { ScatterChart, Scatter, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ZAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { clusterData } from "@/data/mockData"

export function ClusterChart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Subreddit Clusters</CardTitle>
                <CardDescription>
                    Visualizing semantic similarities between subreddits
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis type="number" dataKey="x" name="Dimension 1" stroke="#888888" tickLine={false} axisLine={false} />
                            <YAxis type="number" dataKey="y" name="Dimension 2" stroke="#888888" tickLine={false} axisLine={false} />
                            <ZAxis type="number" dataKey="size" range={[50, 400]} name="Volume" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Scatter name="Clusters" data={clusterData} fill="#8884d8" shape="circle" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
