
import { HardHat, Wheat, Shirt, Tv, Gem, Anchor, Sun, Ship, Leaf, Landmark } from 'lucide-react';
import type { ContinentalData } from '@/types/continental';

export const continentalData: ContinentalData = {
    topPerformers: [
        { 
            name: 'Rwanda',
            iso: 'rw',
            capital: 'Kigali',
            gdpGrowth: 8.2,
            interestRate: 7.0,
            inflation: 5.7,
            clusters: [
                {
                    name: 'Kigali Innovation City',
                    category: 'Technology',
                    roi: '+40%',
                    icon: Gem,
                    color: 'text-purple-500',
                    bgColor: 'bg-purple-500/10'
                },
                {
                    name: 'Kinigi Agritourism',
                    category: 'Agriculture & Tourism',
                    roi: '+35%',
                    icon: Wheat,
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10'
                }
            ]
        },
        { 
            name: 'Ivory Coast',
            iso: 'ci',
            capital: 'Yamoussoukro',
            gdpGrowth: 7.2,
            interestRate: 5.5,
            inflation: 4.4,
            clusters: [
                {
                    name: 'Abidjan Port Logistics',
                    category: 'Logistics & Trade',
                    roi: '+33%',
                    icon: Anchor,
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-500/10'
                },
                {
                    name: 'San-Pédro Cocoa',
                    category: 'Agriculture',
                    roi: '+38%',
                    icon: Wheat,
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10'
                }
            ]
        },
    ],
    regions: [
        {
            id: 'west-africa',
            name: 'West Africa',
            countries: [
                { 
                    name: 'Nigeria',
                    iso: 'ng',
                    capital: 'Abuja',
                    gdpGrowth: 3.3,
                    interestRate: 18.75,
                    inflation: 29.9,
                    clusters: [
                        { name: 'Balogun Market (Textiles)', category: 'Textiles & Apparel', roi: '+25%', icon: Shirt, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
                        { name: 'Onitsha Market (Electronics)', category: 'Consumer Electronics', roi: '+30%', icon: Tv, color: 'text-purple-500', bgColor: 'bg-purple-500/10' }
                    ]
                },
                { 
                    name: 'Ghana',
                    iso: 'gh',
                    capital: 'Accra',
                    gdpGrowth: 5.5,
                    interestRate: 29.5,
                    inflation: 23.2,
                    clusters: [
                        { name: 'Kantanka Automobile', category: 'Manufacturing', roi: '+28%', icon: HardHat, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
                        { name: 'Accra Tech Hub', category: 'Technology', roi: '+35%', icon: Gem, color: 'text-purple-500', bgColor: 'bg-purple-500/10' }
                    ]
                },
                { 
                    name: 'Ivory Coast',
                    iso: 'ci',
                    capital: 'Yamoussoukro',
                    gdpGrowth: 7.2,
                    interestRate: 5.5,
                    inflation: 4.4,
                    clusters: [
                         { name: 'Abidjan Port Logistics', category: 'Logistics & Trade', roi: '+33%', icon: Anchor, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
                         { name: 'San-Pédro Cocoa', category: 'Agriculture', roi: '+38%', icon: Wheat, color: 'text-green-500', bgColor: 'bg-green-500/10' }
                    ]
                },
            ]
        },
        {
            id: 'east-africa',
            name: 'East Africa',
            countries: [
                { 
                    name: 'Kenya',
                    iso: 'ke',
                    capital: 'Nairobi',
                    gdpGrowth: 5.6,
                    interestRate: 13.0,
                    inflation: 6.9,
                    clusters: [
                        { name: 'Silicon Savannah', category: 'Technology', roi: '+42%', icon: Gem, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
                        { name: 'Mombasa Port Trade', category: 'Logistics & Trade', roi: '+31%', icon: Anchor, color: 'text-blue-500', bgColor: 'bg-blue-500/10' }
                    ]
                },
                { 
                    name: 'Rwanda',
                    iso: 'rw',
                    capital: 'Kigali',
                    gdpGrowth: 8.2,
                    interestRate: 7.0,
                    inflation: 5.7,
                     clusters: [
                        { name: 'Kigali Innovation City', category: 'Technology', roi: '+40%', icon: Gem, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
                        { name: 'Kinigi Agritourism', category: 'Agriculture & Tourism', roi: '+35%', icon: Wheat, color: 'text-green-500', bgColor: 'bg-green-500/10' }
                    ]
                },
            ]
        },
        {
            id: 'north-africa',
            name: 'North Africa',
            countries: [
                {
                    name: 'Egypt',
                    iso: 'eg',
                    capital: 'Cairo',
                    gdpGrowth: 4.2,
                    interestRate: 27.25,
                    inflation: 32.5,
                    clusters: [
                        { name: 'Suez Canal Logistics', category: 'Logistics & Trade', roi: '+22%', icon: Ship, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
                        { name: 'Nile Delta Agriculture', category: 'Agriculture', roi: '+28%', icon: Wheat, color: 'text-green-500', bgColor: 'bg-green-500/10' },
                    ]
                },
                {
                    name: 'Morocco',
                    iso: 'ma',
                    capital: 'Rabat',
                    gdpGrowth: 3.5,
                    interestRate: 3.0,
                    inflation: 2.3,
                    clusters: [
                        { name: 'Casablanca Finance City', category: 'Finance', roi: '+26%', icon: Landmark, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
                        { name: 'Noor Solar Complex', category: 'Renewable Energy', roi: '+31%', icon: Sun, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
                    ]
                }
            ]
        },
        {
            id: 'southern-africa',
            name: 'Southern Africa',
            countries: [
                {
                    name: 'South Africa',
                    iso: 'za',
                    capital: 'Pretoria',
                    gdpGrowth: 0.9,
                    interestRate: 8.25,
                    inflation: 5.3,
                    clusters: [
                        { name: 'Johannesburg Mining', category: 'Mining', roi: '+18%', icon: Gem, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
                        { name: 'Stellenbosch Wine', category: 'Agriculture', roi: '+24%', icon: Leaf, color: 'text-green-500', bgColor: 'bg-green-500/10' },
                    ]
                },
                {
                    name: 'Botswana',
                    iso: 'bw',
                    capital: 'Gaborone',
                    gdpGrowth: 4.3,
                    interestRate: 2.65,
                    inflation: 3.9,
                    clusters: [
                        { name: 'Jwaneng Diamond Trade', category: 'Mining & Resources', roi: '+29%', icon: Gem, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
                    ]
                }
            ]
        },
        {
            id: 'central-africa',
            name: 'Central Africa',
            countries: [
                {
                    name: 'Cameroon',
                    iso: 'cm',
                    capital: 'Yaoundé',
                    gdpGrowth: 4.0,
                    interestRate: 5.0,
                    inflation: 7.4,
                    clusters: [
                        { name: 'Douala Port Coffee', category: 'Agriculture', roi: '+27%', icon: Wheat, color: 'text-green-500', bgColor: 'bg-green-500/10' },
                    ]
                },
                {
                    name: 'DRC',
                    iso: 'cd',
                    capital: 'Kinshasa',
                    gdpGrowth: 6.8,
                    interestRate: 25.0,
                    inflation: 22.3,
                    clusters: [
                        { name: 'Katanga Cobalt Mining', category: 'Mining', roi: '+33%', icon: HardHat, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
                    ]
                }
            ]
        }
    ]
};

    
