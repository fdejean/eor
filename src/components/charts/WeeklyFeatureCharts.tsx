
import { ChartSlider } from '@/components/ui/ChartSlider';
import { WeeklySentimentChart } from '@/components/charts/WeeklySentimentChart';
import { WeeklyVolatilityChart } from '@/components/charts/WeeklyVolatilityChart';

export function WeeklyFeatureCharts() {
    return (
        <ChartSlider className="" itemClassName="px-2">
            {/* Card 1: Sentiment */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <WeeklySentimentChart />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Sentiment vs Price</h4>
                    <p className="text-sm text-muted-foreground">Surprisingly, we find a strong correlation in this first graph. This is mostly due to Reddit’s user-base growth, as well as the rise in Apple’s stock price from 2014 to 2017.</p>
                </div>
            </div>

            {/* Card 2: Volatility */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <WeeklyVolatilityChart />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Volatility Analysis</h4>
                    <p className="text-sm text-muted-foreground">We look at volatility (std) to see whether this is a general pattern. Sharp drops in sentiment often precede price volatility spikes.</p>
                </div>
            </div>
        </ChartSlider>
    );
}
