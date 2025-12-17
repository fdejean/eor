"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand } from '@/stores/stockStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle } from 'lucide-react';
import hypothesisData from "@/data/stock_analysis/hypothesis_testing.json"

export function HypothesisTestingResult() {
    const $selectedBrand = useStore(selectedBrand);

    // @ts-ignore
    const hypothesis = hypothesisData[$selectedBrand];

    if (!hypothesis) {
        return <div className="text-muted-foreground">No hypothesis data available for this brand.</div>;
    }

    return (
        <div className="w-full flex flex-col justify-center gap-12">
            <div className="text-center space-y-4">
                <p className="text-xl text-muted-foreground">
                    Null Hypothesis (<span className="font-serif italic font-semibold">H<sub>0</sub></span>): <span className="italic">Reddit sentiment does not <span className="font-semibold text-primary/80">predict</span> {$selectedBrand} stock movements.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto items-center">
                <ResultCard
                    type="Price"
                    data={hypothesis.price}
                />
                <ResultCard
                    type="Volume"
                    data={hypothesis.volume}
                />
            </div>

            <div className="text-center pt-4">
                <p className="text-xl max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                    {hypothesis.price.significant || hypothesis.volume.significant
                        ? <><span className="text-primary font-semibold text-2xl">Partial Evidence Found.</span><br /></>
                        : <><span className="text-destructive font-semibold text-2xl">Fail to reject <span className="font-serif italic">H<sub>0</sub></span>.</span><br /></>}

                    {hypothesis.price.significant || hypothesis.volume.significant
                        ? "Specific features show predictive power, but the signal is not consistent across all metrics."
                        : "The observed correlation is statistically indistinguishable from noise for this brand."}
                </p>
            </div>
        </div>
    )
}

function ResultCard({ type, data }: { type: string, data: any }) {
    const isSig = data.significant;

    return (
        <Card className={`border-2 ${isSig ? 'border-primary/20 bg-primary/5' : 'border-destructive/20 bg-destructive/5'}`}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xl">
                    <span>Best {type} Predictor</span>
                    {isSig
                        ? <CheckCircle2 className="h-6 w-6 text-primary" />
                        : <XCircle className="h-6 w-6 text-destructive" />
                    }
                </CardTitle>
                <CardDescription className="text-base font-medium">
                    Feature: <span className="text-foreground">{data.feature.replace('LIWC_', '')}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Pearson r</div>
                        <div className={`text-3xl font-mono font-bold ${isSig ? 'text-primary' : 'text-muted-foreground'}`}>
                            {data.r.toFixed(2)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">p-value</div>
                        <div className={`text-3xl font-mono font-bold ${isSig ? 'text-primary' : 'text-destructive'}`}>
                            {data.p.toFixed(3)}
                        </div>
                    </div>
                </div>

                <div className={`text-sm font-medium ${isSig ? 'text-primary' : 'text-destructive'}`}>
                    {data.interpretation}
                </div>
            </CardContent>
        </Card>
    )
}
