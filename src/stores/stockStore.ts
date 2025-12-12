import { atom } from 'nanostores';

export type BrandId = 'apple' | 'top10' | 'top50' | 'tesla' | 'nvidia' | 'amazon' | 'google';

export interface BrandOption {
    id: BrandId;
    label: string;
}

export const brandOptions: BrandOption[] = [
    { id: 'apple', label: 'Apple' },
    { id: 'tesla', label: 'Tesla' },
    { id: 'nvidia', label: 'NVIDIA' },
    { id: 'amazon', label: 'Amazon' },
    { id: 'google', label: 'Google' },
    { id: 'top10', label: 'Top 10 NASDAQ' },
    { id: 'top50', label: 'Top 50 NASDAQ' },
];

export const selectedBrand = atom<BrandId>('apple');
