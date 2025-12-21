import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';

import { WeeklySentimentChart } from '@/components/charts/WeeklySentimentChart';


export function WeeklyFeatureCharts() {
    const $selectedBrand = useStore(selectedBrand);
    const brandLabel = $selectedBrand.charAt(0).toUpperCase() + $selectedBrand.slice(1);

    return (
        <div className="w-full h-full flex flex-col gap-4 justify-center">
            <div className="w-full flex items-center">
                <WeeklySentimentChart />
            </div>
            <div className="px-2">
                <h4 className="font-semibold mb-1">Sentiment vs Price</h4>
                <p className="text-sm text-muted-foreground">Surprisingly, we find a strong correlation in this first graph. This is mostly due to Reddit’s user-base growth, as well as the rise in {brandLabel}’s stock price from 2014 to 2017.</p>
            </div>
        </div>
    );
}
