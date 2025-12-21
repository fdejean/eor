import React from 'react';
import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { ChartSlider } from '@/components/ui/ChartSlider';
import { GenericFeatureBarChart } from '@/components/charts/GenericFeatureBarChart';
import { FeatureScatterChart } from '@/components/charts/FeatureScatterChart';

export function FeatureDeepDiveCharts() {
    const $selectedBrand = useStore(selectedBrand);
    const brandLabel = $selectedBrand.charAt(0).toUpperCase() + $selectedBrand.slice(1);

    return (
        <ChartSlider className="overflow-visible" itemClassName="px-2">
            {/* Card 1: Single Brand Price */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <GenericFeatureBarChart variant="price_std" />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Single Brand Analysis</h4>
                    <p className="text-sm text-muted-foreground">Isolating the strongest predictive features for  {brandLabel} price.</p>
                </div>
            </div>

            {/* Card 2: Scatter */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <FeatureScatterChart />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Price vs Volume</h4>
                    <p className="text-sm text-muted-foreground">Scatter plot revealing how features correlate differently with Price vs Trading Volume.</p>
                </div>
            </div>

            {/* Card 3: Predictors (Volume) */}
            <div className="w-full h-full flex flex-col gap-4 justify-center">
                <div className="w-full flex items-center">
                    <GenericFeatureBarChart variant="volume_predictors" />
                </div>
                <div className="px-2">
                    <h4 className="font-semibold mb-1">Top Predictors</h4>
                    <p className="text-sm text-muted-foreground">Isolating the strongest predictive features for {brandLabel} volume.</p>
                </div>
            </div>
        </ChartSlider>
    );
}
