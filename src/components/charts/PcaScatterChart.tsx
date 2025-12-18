"use client"

import React, { Suspense, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import data from "@/data/preprocessing/pca_3d.json"

const Plot = React.lazy(() => import('react-plotly.js'));

const COLORS = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'];

export function PcaScatterChart() {
    const traces = useMemo(() => {
        // sample data to ensure performance while keeping enough points
        // every 2nd point up to 10000 points
        const sampledData = data.filter((_, i) => i % 2 === 0).slice(0, 10000);
        
        // group by cluster
        const clusters = new Map();
        sampledData.forEach((d: any) => {
            if (!clusters.has(d.cluster)) {
                clusters.set(d.cluster, { x: [], y: [], z: [], text: [] });
            }
            const c = clusters.get(d.cluster);
            c.x.push(d.x);
            c.y.push(d.y);
            c.z.push(d.z);
            c.text.push(d.subreddit);
        });

        const plotTraces: any[] = [];
        Array.from(clusters.entries()).sort((a: any, b: any) => a[0] - b[0]).forEach(([clusterId, values]: any) => {
            plotTraces.push({
                x: values.x,
                y: values.y,
                z: values.z,
                mode: 'markers',
                type: 'scatter3d',
                name: `Cluster ${clusterId}`,
                text: values.text,
                marker: {
                    size: 3,
                    color: COLORS[clusterId % COLORS.length],
                    opacity: 0.8
                },
                hovertemplate: '<b>%{text}</b><br>Cluster: ' + clusterId + '<br>X: %{x:.2f}<br>Y: %{y:.2f}<br>Z: %{z:.2f}<extra></extra>'
            });
        });
        return plotTraces;
    }, []);

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader>
                <CardTitle>3D PCA of Subreddit Embeddings</CardTitle>
                <CardDescription>
                    Interactive 3D visualization. <strong>Drag</strong> to rotate, <strong>scroll</strong> to zoom.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 flex-1 min-h-0">
                <div className="h-full w-full min-h-[400px]">
                    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D Chart...</div>}>
                        <Plot
                            data={traces}
                            layout={{
                                autosize: true,
                                margin: { l: 0, r: 0, b: 0, t: 0 },
                                scene: {
                                    xaxis: { title: 'PC1' },
                                    yaxis: { title: 'PC2' },
                                    zaxis: { title: 'PC3' },
                                    camera: {
                                        eye: { x: 1.5, y: 1.5, z: 1.5 }
                                    }
                                },
                                showlegend: true,
                                legend: { x: 0, y: 1 },
                                paper_bgcolor: 'rgba(0,0,0,0)',
                                plot_bgcolor: 'rgba(0,0,0,0)',
                            }}
                            style={{ width: '100%', height: '100%' }}
                            useResizeHandler={true}
                            config={{ responsive: true }}
                        />
                    </Suspense>
                </div>
            </CardContent>
        </Card>
    )
}
