"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Chapter {
    id: string;
    label: string;
}

export function ChapterNavigation() {
    const [activeId, setActiveId] = React.useState<string>("intro")
    const [chapters, setChapters] = React.useState<Chapter[]>([])
    const observer = React.useRef<IntersectionObserver | null>(null)
    const ratios = React.useRef<Record<string, number>>({})

    React.useEffect(() => {
        // 1. Discovery Phase: Find all sections that are chapters
        const elements = document.querySelectorAll('[data-chapter]')
        const discoveredChapters: Chapter[] = []

        elements.forEach(el => {
            discoveredChapters.push({
                id: el.getAttribute('data-chapter') || '',
                label: el.getAttribute('data-nav-label') || 'Chapter'
            })
        })

        setChapters(discoveredChapters)
        if (discoveredChapters.length > 0) {
            setActiveId(discoveredChapters[0].id)
        }

        // 2. Observation Phase: Track visibility using Max Ratio Logic
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                // We track ratio for ALL observed sections to properly handle sub-slides
                ratios.current[entry.target.id] = entry.intersectionRatio
            })

            let maxRatio = 0
            let maxId = discoveredChapters[0]?.id || "intro"
            let currentWinnerId = maxId

            Object.entries(ratios.current).forEach(([id, ratio]) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio
                    currentWinnerId = id
                }
            })

            // If the winner is a sub-slide (e.g., seasonal-chart), map it to the chapter parent
            // Logic: Check if the current winner starts with any known chapter ID prefix
            // For simplicity, our naming convention is [chapter]-intro, [chapter]-chart, etc.
            // So we map "seasonal-chart" -> "seasonal-intro" if "seasonal-intro" is a registered chapter

            let mappedId = currentWinnerId

            // Try to find the matching chapter for this section
            // If we are looking at 'seasonal-chart', and 'seasonal-intro' exists as a chapter, use that.
            const exactMatch = discoveredChapters.find(c => c.id === currentWinnerId)

            if (!exactMatch) {
                // It's a sub-slide. Find which chapter prefix it belongs to.
                // e.g. "seasonal-chart" -> startsWith "seasonal" -> matches "seasonal-intro"
                const parentChapter = discoveredChapters.find(c => currentWinnerId.startsWith(c.id.split('-')[0]))
                if (parentChapter) {
                    mappedId = parentChapter.id
                }
            }

            if (maxRatio > 0.1) {
                setActiveId(mappedId)
            }
        }

        observer.current = new IntersectionObserver(handleIntersect, {
            threshold: [0.1, 0.25, 0.5, 0.75, 0.9],
            root: null,
            rootMargin: "0px"
        })

        // Observe ALL sections on the page, not just chapters, to track scrolling through sub-slides
        const allSections = document.querySelectorAll('section')
        allSections.forEach(section => observer.current?.observe(section))

        return () => observer.current?.disconnect()
    }, [])

    if (chapters.length === 0) return null

    return (
        <nav className="fixed left-6 top-1/2 z-50 -translate-y-1/2 hidden md:block">
            <div className="flex flex-col gap-4">
                {chapters.map((chapter) => (
                    <a
                        key={chapter.id}
                        href={`#${chapter.id}`}
                        className="group flex items-center gap-2"
                        onClick={() => setActiveId(chapter.id)}
                    >
                        <div
                            className={cn(
                                "h-2 w-2 rounded-full transition-all duration-300",
                                activeId === chapter.id
                                    ? "bg-foreground scale-125 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                    : "bg-muted-foreground/50 group-hover:bg-foreground group-hover:scale-110"
                            )}
                        />
                        <span
                            className={cn(
                                "text-sm font-medium transition-all duration-300",
                                activeId === chapter.id ? "opacity-100 translate-x-0 font-bold" : "opacity-40 translate-x-0 text-muted-foreground group-hover:opacity-100"
                            )}
                        >
                            {chapter.label}
                        </span>
                    </a>
                ))}
            </div>
        </nav>
    )
}
