import React from 'react';
import { useStore } from '@nanostores/react';
import { selectedBrand, type BrandId } from '@/stores/stockStore';
import brandSubredditsJson from '@/data/brand_subreddits.json';
import { Badge } from '@/components/ui/badge';

type BrandSubreddits = {
    [key: string]: string[];
};

const brandSubreddits = brandSubredditsJson as BrandSubreddits;
import { motion, AnimatePresence } from 'framer-motion';

export const BrandSubredditList = () => {
    const $selectedBrand = useStore(selectedBrand);

    // Get subreddits for current brand (fallback to empty array if not found)
    const subreddits = brandSubreddits[$selectedBrand] || [];

    // Helper to get brand display name
    const getBrandName = (id: BrandId) => {
        return id.charAt(0).toUpperCase() + id.slice(1).replace('top', 'Top ');
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-8 items-center bg-card/30 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
            {/* Left Side: Explanation */}
            <div className="md:w-1/3 flex flex-col gap-6">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Data Sources</h3>
                    <p className="text-lg text-primary font-medium">
                        Embedding Search Strategy
                    </p>
                </div>

                <div className="prose dark:prose-invert text-muted-foreground">
                    <p>
                        To capture the true sentiment of <strong>{getBrandName($selectedBrand)}</strong>,
                        we don't just look at the main r/{$selectedBrand} community.
                    </p>
                    <p>
                        We use <strong>vector embeddings</strong> to identify subreddit communities with
                        semantically similar conversations and user overlaps.
                    </p>
                    <p>
                        This approach reveals hidden discussions across the platform,
                        from adjacent technology forums to general financial discussions.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Analyzing {subreddits.length} communities</span>
                </div>
            </div>

            {/* Right Side: Tag Cloud */}
            <div className="md:w-2/3 h-full relative overflow-hidden bg-background/50 rounded-xl p-6 border border-border/30 shadow-inner">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background/50 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/50 to-transparent z-10" />

                <div className="h-full overflow-y-auto pr-2 no-scrollbar">
                    <div className="flex flex-wrap gap-2 content-start">
                        <AnimatePresence mode="popLayout">
                            {subreddits.map((sub, index) => (
                                <motion.div
                                    key={`${$selectedBrand}-${sub}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: Math.min(index * 0.02, 0.5)
                                    }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="text-sm py-1.5 px-3 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                                    >
                                        r/{sub}
                                    </Badge>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
