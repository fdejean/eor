import React from 'react';
import { ChartSlider } from '@/components/ui/ChartSlider';
import { HypothesisTestingResult } from '@/components/charts/HypothesisTestingResult';
import { GenericFeatureBarChart } from '@/components/charts/GenericFeatureBarChart';

export function HypothesisTestingCharts() {
    return (
        <ChartSlider className="overflow-visible" itemClassName="px-2">
            {/* Slide 1: Summary Result */}
            <div className="w-full h-full flex flex-col justify-center items-center">
                <HypothesisTestingResult />
            </div>

            {/* Slide 2: Pearson Correlation - Price */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center justify-center">
                    <div className="w-full max-w-4xl">
                        <GenericFeatureBarChart variant="pearson_price" />
                    </div>
                </div>
                <div className="px-2 text-center">
                    <h4 className="font-semibold mb-1">Detailed Pearson Correlation (Price)</h4>
                    <p className="text-sm text-muted-foreground">Detailed breakdown of feature correlations with stock price.</p>
                </div>
            </div>

            {/* Slide 3: Pearson Correlation - Volume */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center justify-center">
                    <div className="w-full max-w-4xl">
                        <GenericFeatureBarChart variant="pearson_volume" />
                    </div>
                </div>
                <div className="px-2 text-center">
                    <h4 className="font-semibold mb-1">Detailed Pearson Correlation (Volume)</h4>
                    <p className="text-sm text-muted-foreground">Detailed breakdown of feature correlations with trading volume.</p>
                </div>
            </div>
        </ChartSlider>
    );
}
