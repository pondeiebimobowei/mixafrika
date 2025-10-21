
import type { LucideIcon } from "lucide-react";

export interface ContinentalCluster {
    name: string;
    category: string;
    roi: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

export interface Country {
    name: string;
    iso: string;
    capital: string;
    gdpGrowth: number;
    interestRate: number;
    inflation: number;
    clusters: ContinentalCluster[];
}

export interface Region {
    id: string;
    name: string;
    countries: Country[];
}

export interface ContinentalData {
    topPerformers: Country[];
    regions: Region[];
}

    