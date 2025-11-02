import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TrendingUp, TrendingDown, Globe, type LucideIcon } from 'lucide-react';
import { continentalData } from '@/data/continental';
import { cn } from '@/lib/utils';

export function ContinentalView() {
    const [_, setSelectedCountry] = useState(continentalData.regions[0].countries[0]);

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <section>
                <h2 className="text-lg font-semibold font-headline mb-4">Top Performing Economies</h2>
                <div className="grid grid-cols-2 gap-4">
                    {continentalData.topPerformers.map(country => (
                        <Card key={country.name} className="bg-card border-0" onClick={() => setSelectedCountry(country)}>
                            <CardContent className="p-3 flex items-center gap-3">
                                <img src={`https://flagcdn.com/w40/${country.iso}.png`} alt={`${country.name} flag`} width={32} height={24} className="rounded-sm"/>
                                <div>
                                    <p className="font-bold text-sm">{country.name}</p>
                                    <div className={cn("flex items-center text-xs", country.gdpGrowth > 0 ? "text-primary" : "text-destructive")}>
                                        {country.gdpGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                        {country.gdpGrowth}%
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold font-headline mb-4">Economies by Region</h2>
                <Accordion type="single" collapsible defaultValue="west-africa" className="w-full">
                    {continentalData.regions.map(region => (
                        <AccordionItem value={region.id} key={region.id}>
                            <AccordionTrigger className="font-semibold">{region.name}</AccordionTrigger>
                            <AccordionContent>
                                <Accordion type="single" collapsible className="w-full space-y-3">
                                {region.countries.map(country => (
                                    <AccordionItem value={country.name} key={country.name} className="border-0">
                                        <AccordionTrigger className="p-0 hover:no-underline">
                                             <Card className="bg-card border-0 w-full">
                                                <CardContent className="p-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <img src={`https://flagcdn.com/w40/${country.iso}.png`} alt={`${country.name} flag`} width={32} height={24} className="rounded-sm"/>
                                                        <div>
                                                            <p className="font-bold">{country.name}</p>
                                                            <p className="text-xs text-muted-foreground">{country.capital}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cn("flex items-center text-sm font-semibold", country.gdpGrowth > 0 ? "text-primary" : "text-destructive")}>
                                                        {country.gdpGrowth}%
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <div className="space-y-2">
                                                <Card className="bg-primary/10 border-dashed">
                                                    <CardContent className="grid grid-cols-3 gap-2 text-center text-sm p-3">
                                                        <div>
                                                            <p className="font-bold">{country.gdpGrowth}%</p>
                                                            <p className="text-xs text-muted-foreground">GDP</p>
                                                        </div>
                                                         <div>
                                                            <p className="font-bold">{country.interestRate}%</p>
                                                            <p className="text-xs text-muted-foreground">Interest</p>
                                                        </div>
                                                         <div>
                                                            <p className="font-bold">{country.inflation}%</p>
                                                            <p className="text-xs text-muted-foreground">Inflation</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                {country.clusters.map(cluster => {
                                                    const Icon = (cluster.icon as LucideIcon) || Globe;
                                                    return (
                                                        <Card key={cluster.name} className="bg-card border-0">
                                                            <CardContent className="p-3 flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={cn("p-2.5 rounded-full", cluster.bgColor)}>
                                                                        <Icon className={cn("h-5 w-5", cluster.color)} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-sm">{cluster.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{cluster.category}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-primary text-sm">{cluster.roi}</p>
                                                                    <p className="text-xs text-muted-foreground">Est. ROI</p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )
                                                })}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
    );
}
    
