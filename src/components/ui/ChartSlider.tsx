import React, { useState, useRef, useEffect, isValidElement, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChartSliderProps {
    children: React.ReactNode;
    className?: string;
    itemClassName?: string;
}

export function ChartSlider({ children, className, itemClassName }: ChartSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Recursively flatten children to handle Astro's slot wrapping behavior
    const getSlides = (nodes: React.ReactNode): React.ReactNode[] => {
        const arr = React.Children.toArray(nodes);
        if (arr.length === 0) return [];

        // If we have a single child that is a valid element (likely a Fragment or wrapper Div)
        // we try to unwrap its children to see if we find the actual slides.
        if (arr.length === 1 && isValidElement(arr[0])) {
            const element = arr[0] as React.ReactElement<any>;
            const childCallback = element.props.children;
            // If the single child has children props, we recurse exactly once to see if those are the slides
            // We don't want to recurse infinitely, just one level of unwrapping is usually enough for Astro/React quirks.
            // However, checking if it is a Fragment is safer.
            // Aggressive check: If we have exactly 1 child, but that child contains multiple items,
            // we assume it's a wrapper (Fragment, Layout Div, Astro Slot) and use the inner children.
            // This is safe for single slides because unwrapping a single slide returns 1 item, so we don't return innerChildren.
            if (element.props.children) {
                const innerChildren = React.Children.toArray(childCallback);
                // If unwrapping gives us more items, use them.
                // This splits [Div, Div] wrapper -> 2 slides.
                // This keeps [Div] wrapper -> 1 slide (inner length = 1).
                if (innerChildren.length > 1) {
                    return innerChildren;
                }
            }
        }
        return arr;
    };

    const slides = getSlides(children);
    const count = slides.length;

    // Handle scroll to update active index
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollLeft;
            const itemWidth = container.offsetWidth;
            // Calculate index based on scroll center to be more forgiving
            const newIndex = Math.round(scrollPosition / itemWidth);

            if (newIndex !== activeIndex && newIndex >= 0 && newIndex < count) {
                setActiveIndex(newIndex);
            }
        };

        // Use a small timeout to debounce/wait for snap to settle could be good, 
        // but direct scroll generic handler works well with snap-mandatory.
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex, count]);

    const scrollToSlide = (index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Explicitly set active index immediately for instant feedback
        setActiveIndex(index);

        container.scrollTo({
            left: container.offsetWidth * index,
            behavior: 'smooth',
        });
    };

    return (
        <div className={cn("flex flex-col gap-4 w-full h-full", className)}>
            {/* Scroll Area */}
            <div
                ref={scrollContainerRef}
                className="flex-grow w-full overflow-x-auto flex snap-x snap-mandatory gap-0 no-scrollbar"
            >
                {slides.map((child, index) => (
                    <div
                        key={index}
                        className={cn(
                            "min-w-full w-full flex-shrink-0 snap-center h-full flex flex-col justify-center", // Base styles
                            itemClassName
                        )}
                    >
                        {child}
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-4 py-2">
                <button
                    onClick={() => scrollToSlide(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="p-1 rounded-full hover:bg-muted/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: count }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToSlide(index)}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                index === activeIndex
                                    ? "w-8 bg-primary"
                                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => scrollToSlide(activeIndex + 1)}
                    disabled={activeIndex === count - 1}
                    className="p-1 rounded-full hover:bg-muted/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
