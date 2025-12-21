"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import priceStdData from "@/data/stock_analysis/feature_correlations_price_std.json"
import volumePredictorsData from "@/data/stock_analysis/weekly_sentiment_price.json"
import pearsonData from "@/data/stock_analysis/feature_correlations_pearson.json"

export type FeatureChartVariant = 'price_std' | 'volume_predictors' | 'pearson_price' | 'pearson_volume';

interface GenericFeatureBarChartProps {
    variant: FeatureChartVariant;
    title?: string;
    description?: string;
}

export function GenericFeatureBarChart({ variant, title, description }: GenericFeatureBarChartProps) {
    const $selectedBrand = useStore(selectedBrand);
    const brandKey = $selectedBrand.toLowerCase();
    const brandLabel = $selectedBrand.charAt(0).toUpperCase() + $selectedBrand.slice(1);

    let data: any[] = [];
    let barColorLogic: (value: number) => string = () => "#8884d8";
    let dataKey = "value";
    let defaultTitle = "";
    let defaultDescription = "";

    // Data Selection & Normalization Logic
    switch (variant) {
        case 'price_std':
            // @ts-ignore
            data = (priceStdData[brandKey] || []).slice(0, 20).map((item: any) => ({
                feature: item.feature,
                value: item.correlation
            }));
            barColorLogic = (val) => val > 0 ? "#16a34a" : "#ef4444"; // Green/Red
            defaultTitle = `Top Features for Price Correlation (${brandLabel})`;
            defaultDescription = `Top 20 Features by correlation for ${brandLabel}`;
            break;

        case 'volume_predictors':
            // @ts-ignore
            data = (volumePredictorsData[brandKey] || []).slice(0, 20).map((item: any) => ({
                feature: item.feature,
                value: item.corr
            }));
            barColorLogic = (val) => val > 0 ? "#f97316" : "#a855f7"; // Orange/Purple
            defaultTitle = `Top Predictors (${brandLabel})`;
            defaultDescription = `Top features for predicting Volume correlation for ${brandLabel}`;
            break;

        case 'pearson_price':
            // @ts-ignore
            data = (pearsonData[brandKey]?.price || []).slice(0, 20).map((item: any) => ({
                feature: item.feature,
                value: item.r,
                pValue: item.p,
                significanceText: item.interpretation
            }));
            barColorLogic = (val) => val > 0 ? "#16a34a" : "#ef4444"; // Green/Red
            defaultTitle = `Top 20 Features by Price Correlation for ${brandLabel}`;
            defaultDescription = `Pearson correlation (r) with Price`;
            break;

        case 'pearson_volume':
            // @ts-ignore
            data = (pearsonData[brandKey]?.volume || []).slice(0, 20).map((item: any) => ({
                feature: item.feature,
                value: item.r,
                pValue: item.p,
                significanceText: item.interpretation
            }));
            barColorLogic = (val) => val > 0 ? "#6366f1" : "#a855f7"; // Indigo/Purple (Blue-ish/Purple)
            defaultTitle = `Top 20 Features by Volume Correlation for ${brandLabel}`;
            defaultDescription = `Pearson correlation (r) with Volume`;
            break;
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border p-3 rounded-lg shadow-lg text-foreground text-sm">
                    <p className="font-bold mb-1">{label}</p>
                    <div className="space-y-1">
                        <p>Correlation: <span className="font-mono">{data.value.toFixed(3)}</span></p>
                        {data.pValue !== undefined && (
                            <p>p-value: <span className="font-mono">
                                {data.pValue < 0.001
                                    ? data.pValue.toExponential(2)
                                    : data.pValue.toFixed(3)}
                            </span></p>
                        )}
                        {data.significanceText && (
                            <p className="text-muted-foreground text-xs italic mt-1 max-w-xs">{data.significanceText}</p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title || defaultTitle}</CardTitle>
                <CardDescription>{description || defaultDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data} margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                            <XAxis type="number" stroke="#888888" fontSize={12} />
                            <YAxis
                                dataKey="feature"
                                type="category"
                                width={100}
                                stroke="#888888"
                                fontSize={11}
                                interval={0}
                                tickFormatter={(val) => val.replace('LIWC_', '').replace('frac_', '')}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine x={0} stroke="#000" />
                            <Bar dataKey="value" name="Correlation">
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={barColorLogic(entry.value)} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
