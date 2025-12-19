"use client"

import { useState, useEffect, useMemo } from "react"
import {
    ComposedChart,
    Line,
    Scatter,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, XCircle, Loader2 } from "lucide-react"

const DATA_FILES = import.meta.glob('/src/data/real_world/*.json')
const getSubredditName = (path: string) => {
    return path.split('/').pop()?.replace('.json', '') || 'Unknown'
}

interface RealWorldDataPoint {
    date: string
    value: number
    is_event: boolean
    event_name?: string
    description?: string
    references?: string[]
    event_value?: number | null
    nearby_event?: RealWorldDataPoint // Reference to an event if this point is near one
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0].payload;
        const activeEvent = dataPoint.is_event ? dataPoint : dataPoint.nearby_event;

        return (
            <div className="bg-[var(--background)] border border-[var(--border)] p-4 rounded-lg shadow-xl text-sm max-w-[320px] backdrop-blur-sm bg-opacity-95 z-50">
                <p className="font-bold mb-2 text-base border-b border-border pb-1">{dataPoint.date}</p>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Activity Score:</span>
                    <span className="font-mono font-bold text-blue-500">{dataPoint.value}</span>
                </div>

                {activeEvent && (
                    <div className="mt-3 pt-3 border-t border-border bg-muted/30 -mx-4 px-4 pb-1">
                        <div className="flex items-center gap-2 mb-2 text-[#ff4500]">
                            <div className="h-2 w-2 rounded-full bg-[#ff4500] shadow-[0_0_8px_#ff4500]" />
                            <p className="font-bold uppercase tracking-wider text-xs">
                                {dataPoint.is_event ? "Historical Event" : "Nearby Event Detected"}
                            </p>
                        </div>
                        <p className="font-bold text-lg leading-tight mb-2 text-foreground">{activeEvent.event_name}</p>
                        <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                            <span>👉</span> Click to view history
                        </p>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function RealWorldChart() {
    const [chartData, setChartData] = useState<RealWorldDataPoint[]>([])
    const [selectedPath, setSelectedPath] = useState<string>("")
    const [selectedEvent, setSelectedEvent] = useState<RealWorldDataPoint | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const subredditOptions = useMemo(() => {
        return Object.keys(DATA_FILES).map((path) => ({
            path,
            name: getSubredditName(path)
        }))
    }, [])

    useEffect(() => {
        if (subredditOptions.length > 0 && !selectedPath) {
            setSelectedPath(subredditOptions[0].path)
        }
    }, [subredditOptions])

    useEffect(() => {
        if (!selectedPath) return;

        const loadData = async () => {
            setIsLoading(true)
            setSelectedEvent(null)
            try {
                const module: any = await DATA_FILES[selectedPath]()
                const rawData = module.default || module

                let processedData = rawData.map((d: RealWorldDataPoint) => ({
                    ...d,
                    event_value: d.is_event ? d.value : null,
                    nearby_event: undefined
                })) as RealWorldDataPoint[]

                const NEARBY_RADIUS = 2;
                for (let i = 0; i < processedData.length; i++) {
                    if (processedData[i].is_event) {
                        for (let j = 1; j <= NEARBY_RADIUS; j++) {
                            if (i - j >= 0 && !processedData[i - j].is_event) {
                                processedData[i - j].nearby_event = processedData[i];
                            }
                        }
                        for (let j = 1; j <= NEARBY_RADIUS; j++) {
                            if (i + j < processedData.length && !processedData[i + j].is_event) {
                                processedData[i + j].nearby_event = processedData[i];
                            }
                        }
                    }
                }

                setChartData(processedData)
            } catch (error) {
                console.error("Failed to load subreddit data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [selectedPath])

    const yDomain: any = useMemo(() => {
        if (!chartData.length) return ["auto", "auto"] as const
        const values = chartData.map((d) => d.value)
        const min = Math.min(...values)
        const max = Math.max(...values)
        if (min === max) return [min - 1, max + 1] as const
        const padding = (max - min) * 0.1
        return [Math.max(0, min - padding), max + padding] as const
    }, [chartData])

    return (
        <Card className="w-full transition-all duration-300">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <CardTitle>Real World Events Analysis</CardTitle>
                    <CardDescription>
                        Interactive rolling average.
                        <span className="text-[#ff4500] font-bold ml-1">Orange dots</span> are clickable events.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Subreddit:</span>
                    <select
                        value={selectedPath}
                        onChange={(e) => setSelectedPath(e.target.value)}
                        className="h-9 w-[180px] rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        {subredditOptions.map((opt) => (
                            <option key={opt.path} value={opt.path}>
                                r/{opt.name}
                            </option>
                        ))}
                    </select>
                </div>
            </CardHeader>

            <CardContent className="pb-4 min-h-[500px]">
                {isLoading ? (
                    <div className="flex h-[400px] w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className={`flex flex-col lg:flex-row gap-6 h-[500px] transition-all duration-500`}>

                        {/* --- LEFT: The Chart --- */}
                        <div className={`h-full w-full ${selectedEvent ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-500`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={chartData}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    onClick={(e: any) => {
                                        // Chart-level click handler with proximity check
                                        if (e && e.activePayload && e.activePayload.length) {
                                            const data = e.activePayload[0].payload;
                                            if (data.is_event) {
                                                setSelectedEvent(data);
                                            } else if (data.nearby_event) {
                                                setSelectedEvent(data.nearby_event);
                                            }
                                        }
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-20" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={yDomain}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                    />
                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Activity Volume"
                                        activeDot={false}
                                        isAnimationActive={true}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="event_value"
                                        stroke="#ff4500"
                                        strokeWidth={0}
                                        legendType="circle"
                                        name="Significant Events"
                                        dot={{ r: 6, fill: "#ff4500", strokeWidth: 0, cursor: 'pointer' }}
                                        activeDot={{ r: 8, fill: "#ff4500", cursor: 'pointer' }}
                                        connectNulls={false}
                                        animationDuration={500}
                                    />

                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        {/* --- RIGHT: The Side Column --- */}
                        {selectedEvent && (
                            <div className="w-full lg:w-1/3 h-full animate-in fade-in slide-in-from-right-10 duration-300 border-l border-[var(--border)] pl-0 lg:pl-6 overflow-y-auto">
                                <div className="p-6 border-b border-[var(--border)] bg-muted/20 rounded-t-xl mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-bold text-[#ff4500] uppercase tracking-widest flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[#ff4500] animate-pulse"></span>
                                            Event Detected
                                        </p>
                                        <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight mt-2">{selectedEvent.event_name}</h3>
                                    <p className="text-sm text-muted-foreground mt-2 font-mono bg-background/50 inline-block px-2 py-1 rounded border border-[var(--border)]">
                                        {selectedEvent.date}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Context</h4>
                                        <p className="text-sm leading-relaxed text-foreground/90">
                                            {selectedEvent.description}
                                        </p>
                                    </div>

                                    {selectedEvent.references && selectedEvent.references.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Reddit Comments References</h4>
                                            <div className="space-y-3">
                                                {selectedEvent.references.map((ref, idx) => (
                                                    <blockquote key={idx} className="relative pl-4 border-l-4 border-[#ff4500]/50 hover:border-[#ff4500] transition-colors bg-muted/30 p-3 rounded-r text-sm text-muted-foreground italic">
                                                        "{ref}"
                                                    </blockquote>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}