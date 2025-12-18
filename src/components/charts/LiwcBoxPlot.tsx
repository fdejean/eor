"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import data from "@/data/preprocessing/liwc_values_boxplot.json"

function interpolateColor(color1: string, color2: string, factor: number) {
    if (factor > 1) factor = 1;
    if (factor < 0) factor = 0;
    
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const BoxShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    
    const bottom = y + height;
    const scale = height;
    
    const yMin = bottom - payload.normalized.min * scale;
    const yQ1 = bottom - payload.normalized.q1 * scale;
    const yMedian = bottom - payload.normalized.median * scale;
    const yQ3 = bottom - payload.normalized.q3 * scale;
    
    let yMax = bottom - payload.normalized.max * scale;
    const isClipped = yMax < y;
    if (isClipped) {
        yMax = y;
    }

    return (
        <g>
            {}
            <line x1={x + width/2} y1={yMin} x2={x + width/2} y2={yMax} stroke="var(--foreground)" strokeDasharray={isClipped ? "4 2" : ""} />
            {}
            <line x1={x + width/3} y1={yMax} x2={x + 2*width/3} y2={yMax} stroke="var(--foreground)" />
            {}
            <line x1={x + width/3} y1={yMin} x2={x + 2*width/3} y2={yMin} stroke="var(--foreground)" />
            {}
            <rect x={x} y={yQ3} width={width} height={Math.max(0, yQ1 - yQ3)} fill={payload.fill || "#8884d8"} stroke="var(--foreground)" fillOpacity={0.8} />
            {}
            <line x1={x} y1={yMedian} x2={x + width} y2={yMedian} stroke="white" strokeWidth={2} />
            {}
            <text 
                x={x + width / 2} 
                y={yMedian - 6} 
                textAnchor="middle" 
                fill="var(--foreground)" 
                fontSize={12}
                fontWeight="bold"
                stroke="var(--background)"
                strokeWidth={3}
                paintOrder="stroke"
                style={{ pointerEvents: 'none' }}
            >
                {payload.median.toFixed(2)}
            </text>
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-background border rounded-md p-3 shadow-md text-sm">
                <p className="font-bold mb-2">{data.name}</p>
                <div className="space-y-1 font-mono">
                    <p>Max: {data.max.toFixed(3)}</p>
                    <p>Q3:  {data.q3.toFixed(3)}</p>
                    <p className="font-bold text-primary">Median: {data.median.toFixed(3)}</p>
                    <p>Mean: {data.mean.toFixed(3)}</p>
                    <p>Q1:  {data.q1.toFixed(3)}</p>
                    <p>Min: {data.min.toFixed(3)}</p>
                </div>
            </div>
        );
    }
    return null;
};

export function LiwcBoxPlot() {
    // sort data by median
    // normalize data so each feature scales to a "visualmax"
    // visualmax = Min(Max, Q3 + 1.5 * IQR)
    const processedData = [...data]
        .sort((a, b) => b.median - a.median)
        .map((item, index, array) => {
            const iqr = item.q3 - item.q1;
            const upperFence = item.q3 + 1.5 * iqr;
            
            let scaleVal = (upperFence > 0) ? Math.min(item.max, upperFence) : item.max;
            
            if (scaleVal <= 0) scaleVal = 1;

            // color gradient
            const color = interpolateColor("#7c3aed", "#f59e0b", index / (array.length - 1));

            return {
                ...item,
                displayMax: 1, // Constant height for the bar
                fill: color,
                normalized: {
                    min: item.min / scaleVal,
                    q1: item.q1 / scaleVal,
                    median: item.median / scaleVal,
                    q3: item.q3 / scaleVal,
                    max: item.max / scaleVal
                }
            };
        });

    const minWidth = Math.max(1000, processedData.length * 50);

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader>
                <CardTitle>LIWC Feature Distributions</CardTitle>
                <CardDescription>
                    Box plots of LIWC features across all posts (sorted by median).
                    <br/>
                    <strong>Note:</strong> Features are scaled to focus on the main distribution (IQR). Extreme outliers (dashed lines) may extend beyond the view.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 flex-1 min-h-0 overflow-hidden">
                <div className="h-[400px] w-full overflow-x-auto">
                    <div style={{ width: `${minWidth}px`, height: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                                {}
                                <YAxis stroke="#888888" tickLine={false} axisLine={false} tickFormatter={() => ""} />
                                <Tooltip 
                                    cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                                    content={<CustomTooltip />}
                                />
                                <Bar dataKey="displayMax" shape={<BoxShape />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
