import React from 'react';
import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { ChartSlider } from '@/components/ui/ChartSlider';
import { GenericFeatureBarChart } from '@/components/charts/GenericFeatureBarChart';
import { HypothesisTestingResult } from '@/components/charts/HypothesisTestingResult';

export function HypothesisCharts() {
    const $selectedBrand = useStore(selectedBrand);
    const brandLabel = $selectedBrand.charAt(0).toUpperCase() + $selectedBrand.slice(1);

    return (
        <ChartSlider className="overflow-visible" itemClassName="px-2">

            {/* Slide 1: Hypothesis Results */}
            <div className="w-full h-full flex flex-col justify-center overflow-y-auto">
                <HypothesisTestingResult />
            </div>

            {/* Slide 2: Price Correlations */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <GenericFeatureBarChart variant="pearson_price" />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Price Correlations</h4>
                    <p className="text-sm text-muted-foreground">Top features correlated with {brandLabel}'s stock price.</p>
                </div>
            </div>

            {/* Slide 3: Volume Correlations */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <GenericFeatureBarChart variant="pearson_volume" />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Volume Correlations</h4>
                    <p className="text-sm text-muted-foreground">Top features correlated with {brandLabel}'s trading volume.</p>
                </div>
            </div>

        </ChartSlider>
    );
}
