"use client"

import { useStore } from '@nanostores/react';
import { selectedBrand, brandOptions, type BrandId } from '@/stores/stockStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BrandSelectorProps {
    className?: string;
    variant?: 'select' | 'pills';
}

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function BrandSelector({ className, variant = 'select' }: BrandSelectorProps) {
    const $selectedBrand = useStore(selectedBrand);

    if (variant === 'pills') {
        return (
            <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
                {brandOptions.map((option) => (
                    <Button
                        key={option.id}
                        variant={$selectedBrand === option.id ? "default" : "outline"}
                        onClick={() => selectedBrand.set(option.id)}
                        className={cn(
                            "transition-all",
                            $selectedBrand === option.id && "ring-2 ring-primary ring-offset-2"
                        )}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        );
    }

    return (
        <Select value={$selectedBrand} onValueChange={(value) => selectedBrand.set(value as BrandId)}>
            <SelectTrigger className={cn("w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
                <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
                {brandOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
