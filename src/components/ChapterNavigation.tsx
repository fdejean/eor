"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SubChapter {
    id: string;
    label: string;
}

interface Chapter {
    id: string;
    label: string;
    subchapters: SubChapter[];
}

export function ChapterNavigation() {
    const [activeId, setActiveId] = React.useState<string>("intro")
    const [chapters, setChapters] = React.useState<Chapter[]>([])
    const observer = React.useRef<IntersectionObserver | null>(null)
    const ratios = React.useRef<Record<string, number>>({})

    React.useEffect(() => {
        // Discovery Phase: Find all sections and build hierarchy based on DOM order
        const sections = document.querySelectorAll('section')
        const discoveredChapters: Chapter[] = []
        let currentChapter: Chapter | null = null

        sections.forEach(el => {
            const chapterId = el.getAttribute('data-chapter')
            const subchapterId = el.getAttribute('data-subchapter')
            const navLabel = el.getAttribute('data-nav-label')

            if (chapterId) {
                // Start a new chapter
                currentChapter = {
                    id: chapterId,
                    label: navLabel || 'Chapter',
                    subchapters: []
                }
                discoveredChapters.push(currentChapter)
            } else if (subchapterId && currentChapter) {
                // Add to current chapter
                currentChapter.subchapters.push({
                    id: subchapterId,
                    label: navLabel || 'Subchapter'
                })
            }
        })

        setChapters(discoveredChapters)

        // Observation Phase: Track visibility
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                ratios.current[entry.target.id] = entry.intersectionRatio
            })

            let maxRatio = 0
            let currentWinnerId = activeId // Default to current if no clear winner

            // Find the section with the highest visibility ratio
            Object.entries(ratios.current).forEach(([id, ratio]) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio
                    currentWinnerId = id
                }
            })

            if (maxRatio > 0.1) {
                setActiveId(currentWinnerId)
            }
        }

        observer.current = new IntersectionObserver(handleIntersect, {
            threshold: [0.1, 0.25, 0.5, 0.75, 0.9],
            root: null,
            rootMargin: "-10% 0px -10% 0px" // Adjust margin to focus on center
        })

        sections.forEach(section => observer.current?.observe(section))

        return () => observer.current?.disconnect()
    }, [])

    if (chapters.length === 0) return null

    return (
        <nav className="fixed left-0 top-0 h-full max-h-screen z-50 flex flex-col justify-center transition-all duration-500 w-8 hover:w-72 group">
            {/* Background Blur */}
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md border-r border-border/50 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Scrollable Container - centered via my-auto if small, scrollable if tall */}
            <div className="relative flex flex-col gap-6 pl-2 group-hover:pl-6 pr-6 min-w-[280px] max-h-screen overflow-y-auto overflow-x-hidden no-scrollbar py-4 transition-all duration-500">
                {chapters.map((chapter) => {
                    const isActiveChapter = activeId === chapter.id || chapter.subchapters.some(s => s.id === activeId);

                    return (
                        <div key={chapter.id} className="flex flex-col gap-2">
                            {/* Main Chapter Link */}
                            <a
                                href={`#${chapter.id}`}
                                className="flex items-center gap-4 group/item"
                                onClick={() => setActiveId(chapter.id)}
                            >
                                <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                                    <div
                                        className={cn(
                                            "h-2 w-2 rounded-full transition-all duration-300 absolute",
                                            isActiveChapter
                                                ? "bg-primary scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background"
                                                : "bg-muted-foreground/50 group-hover/item:bg-foreground group-hover/item:scale-110"
                                        )}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        "text-sm font-bold transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0",
                                        isActiveChapter ? "text-foreground" : "text-muted-foreground group-hover/item:text-foreground"
                                    )}
                                >
                                    {chapter.label}
                                </span>
                            </a>

                            {/* Subchapters - Only show on hover to keep spacing constant */}
                            <div className={cn(
                                "ml-[0.45rem] border-l-2 border-border/50 pl-6 space-y-3 transition-all duration-300 opacity-0 group-hover:opacity-100 h-0 overflow-hidden py-0 group-hover:h-auto group-hover:py-2"
                            )}>
                                {chapter.subchapters.map((sub) => (
                                    <a
                                        key={sub.id}
                                        href={`#${sub.id}`}
                                        className="block text-xs transition-colors hover:text-primary"
                                        onClick={() => setActiveId(sub.id)}
                                    >
                                        <span className={cn(
                                            "transition-colors duration-200",
                                            activeId === sub.id ? "text-primary font-semibold" : "text-muted-foreground"
                                        )}>
                                            {sub.label}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}
