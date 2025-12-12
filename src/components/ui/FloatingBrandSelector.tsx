"use client"

import React, { useEffect, useState } from 'react';
import { BrandSelector } from './BrandSelector';
import { cn } from '@/lib/utils';

interface FloatingBrandSelectorProps {
    sectionIds: string[];
}

export function FloatingBrandSelector({ sectionIds }: FloatingBrandSelectorProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            // Check if any monitored section is currently intersecting
            const isAnyVisible = entries.some(entry => entry.isIntersecting);

            // Should strictly check if *any* part of the sections are in the viewport
            // The intersection observer fires on changes.
            // If we have multiple sections, we want to know if "at least one" is visible.

            // To be robust, we can check the current visibility state of all elements
            // whenever the observer fires.
            const anyCurrentVisible = sectionIds.some(id => {
                const el = document.getElementById(id);
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                // Visible if top is below viewport top OR bottom is above viewport bottom (partially visible)
                // AND it's not completely scrolled out
                return rect.bottom > 0 && rect.top < window.innerHeight;
            });

            setIsVisible(anyCurrentVisible);
        }, {
            threshold: 0.1
        });

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionIds]);

    return (
        <div
            className={cn(
                "fixed bottom-8 left-6 z-40 transition-all duration-300 transform max-w-[200px]",
                isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
            )}
        >
            <BrandSelector className="justify-start" />
        </div>
    );
}
