"use client"

import { useState, useEffect } from "react"
import type { RealWorldDataPoint } from "@/components/charts/types"
import { RealWorldChart } from "@/components/charts/RealWorldChart"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Import all JSON files
const DATA_FILES = import.meta.glob('/src/data/real_world/*.json')

interface SubredditMetadata {
    name: string;      // "nba" (derived from filename prefix)
    dataPath: string;  // path to nba_data.json
    metaPath: string;  // path to nba_metadata.json
    title: string;
    subreddit_name: string;
    text: string;
    image: string;
    palette: string;
    icon: string;
}

const getSubredditName = (path: string) => {
    // path example: .../nba_data.json or .../nba_metadata.json
    const filename = path.split('/').pop() || ''
    return filename.replace('_data.json', '').replace('_metadata.json', '')
}

export function RealWorldDashboard() {
    const [subreddits, setSubreddits] = useState<SubredditMetadata[]>([])
    const [activeSubreddit, setActiveSubreddit] = useState<SubredditMetadata | null>(null)
    const [chartData, setChartData] = useState<RealWorldDataPoint[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isLoadingMeta, setIsLoadingMeta] = useState(true)

    // 1. Initial Load: Scan files and pair data + metadata
    useEffect(() => {
        const loadMetadata = async () => {
            setIsLoadingMeta(true)
            const metaMap = new Map<string, Partial<SubredditMetadata>>()

            // Group files by subreddit name
            for (const path in DATA_FILES) {
                const name = getSubredditName(path)
                if (!metaMap.has(name)) {
                    metaMap.set(name, { name })
                }
                const entry = metaMap.get(name)!

                if (path.endsWith('_data.json')) {
                    entry.dataPath = path
                } else if (path.endsWith('_metadata.json')) {
                    entry.metaPath = path
                }
            }

            const completeMetas: SubredditMetadata[] = []

            for (const [name, entry] of metaMap.entries()) {
                if (entry.dataPath && entry.metaPath) {
                    try {
                        // Load metadata file content
                        const module: any = await DATA_FILES[entry.metaPath]()
                        const metaContent = module.default || module

                        completeMetas.push({
                            name: name,
                            dataPath: entry.dataPath,
                            metaPath: entry.metaPath,
                            title: metaContent.title || name,
                            subreddit_name: metaContent.subreddit_name || `r/${name}`,
                            text: metaContent.text || "",
                            image: metaContent.image || "",
                            palette: metaContent.palette || "#8884d8",
                            icon: metaContent.icon || "📊"
                        })
                    } catch (e) {
                        console.error(`Failed to load metadata for ${name}`, e)
                    }
                }
            }

            // Sort alphabetically
            completeMetas.sort((a, b) => a.title.localeCompare(b.title))

            setSubreddits(completeMetas)
            if (completeMetas.length > 0) {
                setActiveSubreddit(completeMetas[0])
            }
            setIsLoadingMeta(false)
        }

        loadMetadata()
    }, [])

    // 2. Load Chart Data when active subreddit changes
    useEffect(() => {
        if (!activeSubreddit) return

        const loadChartData = async () => {
            setIsLoadingData(true)
            try {
                const module: any = await DATA_FILES[activeSubreddit.dataPath]()
                const rawData = module.default || module

                // Process data (add nearby_event references, etc.)
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
                console.error("Failed to load chart data", error)
            } finally {
                setIsLoadingData(false)
            }
        }

        loadChartData()
    }, [activeSubreddit])

    return (
        <div className="w-full space-y-6">
            {/* Top Navigation: Cards */}
            <div className="flex gap-4 overflow-x-auto py-2 pb-4 snap-x">
                {isLoadingMeta ? (
                    // Skeleton loading for cards
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 w-40 bg-muted animate-pulse rounded-xl flex-shrink-0" />
                    ))
                ) : (
                    subreddits.map((sub) => (
                        <button
                            key={sub.name}
                            onClick={() => setActiveSubreddit(sub)}
                            className={`
                                relative flex items-center gap-4
                                p-4 h-24 w-48 rounded-xl border-2 transition-all duration-200 text-left snap-start
                                ${activeSubreddit?.name === sub.name
                                    ? "bg-muted/50 border-[var(--color)] shadow-md translate-y-[-2px]"
                                    : "bg-background border-muted hover:border-muted-foreground/50 hover:bg-muted/20"
                                }
                            `}
                            style={{
                                borderColor: activeSubreddit?.name === sub.name ? sub.palette : undefined,
                            } as React.CSSProperties}
                        >
                            {/* Icon on the left */}
                            <span className="text-3xl flex-shrink-0">{sub.icon}</span>

                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight">{sub.subreddit_name}</span>
                                <span className="text-xs text-muted-foreground hidden md:block opacity-0">r/{sub.name}</span>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Detail Section */}
            {activeSubreddit && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Description + Image */}
                    <Card
                        className="border-none shadow-none overflow-hidden transition-all duration-500 rounded-3xl"
                        style={{ backgroundColor: activeSubreddit.palette + '15' }} // 15 = ~8% opacity
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 max-w-5xl mx-auto">
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <span className="text-foreground font-bold text-sm uppercase tracking-[0.2em] opacity-60">
                                    About this Data
                                </span>
                                <h3 className="text-2xl md:text-4xl font-bold text-foreground">
                                    {activeSubreddit.title}
                                </h3>
                                <p className="text-xl font-medium leading-relaxed text-foreground/90">
                                    {activeSubreddit.text}
                                </p>
                            </div>

                            {activeSubreddit.image && (
                                <div className="flex-shrink-0 w-32 md:w-48 flex justify-center items-center">
                                    <img
                                        src={activeSubreddit.image}
                                        alt={activeSubreddit.title}
                                        className="w-full h-auto object-contain max-h-32 drop-shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Chart Container */}
                    <div className="min-h-[500px] relative">
                        {isLoadingData ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-xl">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            </div>
                        ) : null}

                        <RealWorldChart
                            data={chartData}
                            activeSubreddit={activeSubreddit.name}
                            primaryColor={activeSubreddit.palette}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
