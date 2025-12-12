import React from 'react';
import { ChartSlider } from '@/components/ui/ChartSlider';
import { FeatureSingleBrandChart } from '@/components/charts/FeatureSingleBrandChart';
import { FeatureAllBrandsChart } from '@/components/charts/FeatureAllBrandsChart';
import { FeatureScatterChart } from '@/components/charts/FeatureScatterChart';
import { FeaturePredictorsChart } from '@/components/charts/FeaturePredictorsChart';

export function FeatureDeepDiveCharts() {
    return (
        <ChartSlider className="overflow-visible" itemClassName="px-2">
            {/* Card 1: Single Brand */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <FeatureSingleBrandChart />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Single Brand Analysis</h4>
                    <p className="text-sm text-muted-foreground">Top correlated features for Apple. Identifying specific signals within the r/Apple community.</p>
                </div>
            </div>

            {/* Card 2: All Brands */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <FeatureAllBrandsChart />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Cross-Brand Patterns</h4>
                    <p className="text-sm text-muted-foreground">Aggregating data across 20 brands to find universal linguistic signals that correlate with market movements.</p>
                </div>
            </div>

            {/* Card 3: Scatter */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <FeatureScatterChart />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Price vs Volume</h4>
                    <p className="text-sm text-muted-foreground">Scatter plot revealing how features correlate differently with Price vs Trading Volume.</p>
                </div>
            </div>

            {/* Card 4: Predictors */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <FeaturePredictorsChart />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Top Predictors</h4>
                    <p className="text-sm text-muted-foreground">Isolating the strongest predictive features for both price direction and market volume.</p>
                </div>
            </div>
        </ChartSlider>
    );
}
