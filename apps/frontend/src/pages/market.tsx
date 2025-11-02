import { useState, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, TrendingDown, AreaChart as AreaChartIcon, BarChart2, CandlestickChart, Users, X, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, BarChart, Bar, YAxis } from "recharts"
import { allClusters, clusterDetailsData, adBanners, weeklyPoolData } from '@/data/markets';
import type { Cluster, FilterType, ChartView } from '@/types';
import { CandlestickChartComponent } from '@/components/candle-stick-chart';
import { ContinentalView } from '@/components/contenental-view';
import { PlaceHolderImages } from '@/lib/place-holder-image';
import { Link } from 'react-router';
import { InvestmentAssistantSheet } from '@/components/modals/investment-assistant-sheet';

type ViewMode = 'clusters' | 'continental';


const chartConfig: ChartConfig = {
  balogun: { label: 'Balogun', color: 'hsl(var(--chart-1))' },
  onitsha: { label: 'Onitsha', color: 'hsl(var(--chart-2))' },
  aba: { label: 'Aba', color: 'hsl(var(--chart-3))' },
  kano: { label: 'Kano', color: 'hsl(var(--chart-4))' },
  volume: {
    label: "Volume",
    color: "hsl(var(--primary))",
  },
  performance: {
    label: "Performance",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [chartView, setChartView] = useState<ChartView>('area');
  const [selectedInsightCluster, setSelectedInsightCluster] = useState<Cluster | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('clusters');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== 'continental') {
      setViewMode('clusters');
    } else {
      setViewMode('continental');
    }
  };
  
  const filteredClusters = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return allClusters.filter((cluster) => {
      const matchesSearch = cluster.name.toLowerCase().includes(lowercasedQuery);
      const matchesFilter = activeFilter === 'all' || cluster.status === activeFilter;
      return matchesSearch && (activeFilter === 'continental' ? true : matchesFilter);
    });
  }, [searchQuery, activeFilter]);
  
  const leaderboardClusters = useMemo(() => {
    return [...allClusters].sort((a, b) => {
        const roiA = parseFloat(a.roi.replace('%', '').replace('+', ''));
        const roiB = parseFloat(b.roi.replace('%', '').replace('+', ''));
        return roiB - roiA;
    });
  }, []);

  const renderChart = () => {
    switch (chartView) {
      case 'bar':
        return (
          <BarChart accessibilityLayer data={weeklyPoolData.map(d => ({ ...d, volume: d.volume[3] }))}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis hide domain={['dataMin - 500000', 'dataMax + 500000']} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => `₦${(Number(value) / 1e6).toFixed(1)}M`} />} />
            <Bar dataKey="volume" fill="var(--color-volume)" radius={4} />
          </BarChart>
        );
      case 'candlestick':
        return <CandlestickChartComponent data={weeklyPoolData} />;
      case 'area':
      default:
        return (
          <AreaChart accessibilityLayer data={weeklyPoolData.map(d => ({...d, volume: d.volume[3]}))} >
            <defs>
              <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-volume)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-volume)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis hide domain={['dataMin - 500000', 'dataMax + 500000']} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => `₦${(Number(value) / 1e6).toFixed(1)}M`} />} />
            <Area dataKey="volume" type="natural" fill="url(#fillVolume)" fillOpacity={0.4} stroke="var(--color-volume)" />
          </AreaChart>
        );
    }
  };
  
  const insightDetails = selectedInsightCluster ? clusterDetailsData[selectedInsightCluster.id] : null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-headline">Markets</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-card border-0 rounded-full w-40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
         <div className="flex gap-2">
            <Button variant={activeFilter === 'all' ? 'default' : 'secondary'} onClick={() => handleFilterClick('all')} className="rounded-full h-8 text-xs">All</Button>
            <Button variant={activeFilter === 'active' ? 'default' : 'secondary'} onClick={() => handleFilterClick('active')} className="rounded-full h-8 text-xs">Active</Button>
            <Button variant={activeFilter === 'pooling' ? 'default' : 'secondary'} onClick={() => handleFilterClick('pooling')} className="rounded-full h-8 text-xs">Pooling</Button>
            <Button 
                variant={activeFilter === 'continental' ? 'default' : 'secondary'} 
                onClick={() => handleFilterClick('continental')} 
                className={cn("rounded-full h-8 text-xs", activeFilter === 'continental' ? "" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20")}
            >
              <Crown className="mr-2 h-4 w-4" />
              Continental
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 space-y-6">
        {viewMode === 'continental' ? (
          <ContinentalView />
        ) : (
          <>
            <section>
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  plugins={[plugin.current]}
                  className="w-full"
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                >
                  <CarouselContent>
                    {adBanners.map((ad, index) => {
                      const image = PlaceHolderImages.find(p => p.id === ad.imageId);
                      return (
                      <CarouselItem key={index}>
                        <Link to={ad.link}>
                          <div className="relative h-40 rounded-lg overflow-hidden">
                            {image && (
                              <img
                                src={image.imageUrl}
                                alt={ad.title}
                                
                                style={{objectFit:"cover"}}
                                data-ai-hint={image.imageHint}
                              />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
                              <h3 className="text-white font-bold text-lg">{ad.title}</h3 >
                              <p className="text-white/90 text-sm">{ad.description}</p>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                </Carousel>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold font-headline">Available Clusters</h2>
                <Button variant="link" className="text-primary pr-0">View all</Button>
              </div>
              <div className="space-y-3">
                {filteredClusters.map((cluster) => {
                  const isPooling = cluster.status === 'pooling';
                  const poolProgress = isPooling ? ((cluster.poolCurrent || 0) / (cluster.poolTarget || 1)) * 100 : 0;

                  return (
                  <Link to={`/clusters/${cluster.id}`} key={cluster.name} className="block">
                    <Card className="bg-card border-0">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn("p-3 rounded-full", cluster.bgColor)}>
                            { cluster.logo && <cluster.logo className={cn("h-6 w-6", cluster.color)} />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <p className="font-bold whitespace-nowrap truncate">{cluster.name}</p>
                            {isPooling ? (
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">Pooling</Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">Active</Badge>
                            )}
                          </div>
                          {isPooling ? (
                              <div className="mt-2 space-y-1">
                                <Progress value={poolProgress} className="h-1.5" />
                                <p className="text-xs text-muted-foreground">{poolProgress.toFixed(0)}% funded of ₦{(cluster.poolTarget || 0).toLocaleString()}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">{cluster.category}</p>
                            )}
                        </div>
                        {!isPooling && (
                            <div className="text-right">
                              <p className="font-bold">{cluster.roi}</p>
                              <div className={`flex items-center justify-end gap-1 text-sm ${cluster.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                                {cluster.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                <span>{cluster.repayment}</span>
                              </div>
                            </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )})}
                {filteredClusters.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No clusters match your criteria.</p>
                    </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold font-headline mb-4">Trending Clusters</h2>
              <div className="grid grid-cols-2 gap-4">
                  {allClusters.slice(0, 4).map((cluster) => (
                    <Link to={`/clusters/${cluster.id}`} key={cluster.name} className="block">
                        <Card key={cluster.name} className="bg-card border-0">
                            <CardContent className="p-4 flex flex-col items-start gap-2">
                                <div className={cn("p-3 rounded-full", cluster.bgColor)}>
                                    { cluster.logo && <cluster.logo className={cn("h-6 w-6", cluster.color)} />}
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-bold text-base truncate">{cluster.name.split(' ')[0]}</p>
                                        <p className="font-semibold text-sm">{cluster.roi}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs ${cluster.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                                        {cluster.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        <span>{cluster.repayment}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                  ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold font-headline mb-4">Top Performers</h2>
              <Sheet open={!!selectedInsightCluster} onOpenChange={(isOpen) => !isOpen && setSelectedInsightCluster(null)}>
                <Card className="bg-card border-0 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                        {leaderboardClusters.slice(0, 3).map((cluster) => {
                          const trendIcon = cluster.trend === 'up' 
                            ? <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-10 border-b-green-500"></div>
                            : <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-10 border-t-red-500"></div>;
                          
                          return (
                            <SheetTrigger asChild key={cluster.id}>
                              <div onClick={() => setSelectedInsightCluster(cluster)} className="block cursor-pointer">
                                  <div className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-lg">
                                      <div className="flex items-center gap-3">
                                          <div className={cn("flex items-center justify-center h-8 w-8 rounded-full", 
                                              cluster.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'
                                          )}>
                                              {trendIcon}
                                          </div>
                                          <div className={cn("p-1.5 rounded-full", cluster.bgColor)}>
                                              { cluster.logo && <cluster.logo className={cn("h-4 w-4", cluster.color)} />}
                                          </div>
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                          <p className="font-bold text-sm truncate">{cluster.name}</p>
                                          <p className="text-xs text-muted-foreground">{cluster.category}</p>
                                      </div>
                                      <div className="text-right">
                                          <p className="font-bold text-primary">{cluster.roi}</p>
                                          <p className="text-xs text-muted-foreground">Est. ROI</p>
                                      </div>
                                  </div>
                              </div>
                            </SheetTrigger>
                        )})}
                    </CardContent>
                </Card>
                {selectedInsightCluster && insightDetails && (
                    <SheetContent side="bottom" className="rounded-t-3xl p-0 h-[85vh]">
                        <SheetHeader className="p-4 border-b text-left">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-full", selectedInsightCluster.bgColor)}>
                                        { selectedInsightCluster.logo && <selectedInsightCluster.logo className={cn("h-5 w-5", selectedInsightCluster.color)} />}
                                    </div>
                                    <div>
                                        <SheetTitle className="text-lg font-bold">{selectedInsightCluster.name}</SheetTitle>
                                        <p className="text-sm text-muted-foreground">{selectedInsightCluster.category}</p>
                                    </div>
                                </div>
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </SheetClose>
                            </div>
                        </SheetHeader>
                        <div className="p-4 space-y-4 overflow-y-auto h-[calc(85vh-130px)]">
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-base'>Growth Insight</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-3 gap-y-4 gap-x-2 text-center">
                                    <div className="border-r">
                                        <p className="text-xl font-bold text-primary">{insightDetails.growth}%</p>
                                        <p className="text-xs text-muted-foreground">Est. ROI</p>
                                    </div>
                                    <div className="border-r">
                                        <p className="text-xl font-bold">{insightDetails.cycle} days</p>
                                        <p className="text-xs text-muted-foreground">Cycle</p>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">₦{(insightDetails.volume / 1000000).toFixed(1)}M</p>
                                        <p className="text-xs text-muted-foreground">Volume</p>
                                    </div>
                                    <div className="pt-3 border-r">
                                        <p className="text-xl font-bold">{insightDetails.repayment}</p>
                                        <p className="text-xs text-muted-foreground">Repayment</p>
                                    </div>
                                    <div className="pt-3 border-r">
                                        <p className="text-xl font-bold flex items-center justify-center gap-1">
                                          <Users className="h-4 w-4"/> 
                                          {insightDetails.investorSentiment}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Sentiment</p>
                                    </div>
                                    <div className="pt-3">
                                        <p className="text-xl font-bold">1.2k</p>
                                        <p className="text-xs text-muted-foreground">Investors</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-base'>Historical Performance (Est. ROI %)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-40 w-full">
                                        <AreaChart accessibilityLayer data={insightDetails.performanceData}>
                                            <defs>
                                                <linearGradient id="fillPerformance" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-performance)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="var(--color-performance)" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => `${value}%`} />} />
                                            <Area dataKey="performance" type="natural" fill="url(#fillPerformance)" fillOpacity={0.4} stroke="var(--color-performance)" />
                                        </AreaChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-base'>Recent Activities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                    {insightDetails.activities.map((activity: any, index: number) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className={cn("flex items-center justify-center h-8 w-8 rounded-full", activity.bgColor)}>
                                                <activity.icon className={cn("h-4 w-4", activity.color)} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{activity.message}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="px-4 py-2 bg-background border-t absolute bottom-0 w-full">
                            <Button className="w-full" asChild>
                                <Link to={`/clusters/${selectedInsightCluster.id}`}>View Full Cluster Details</Link>
                            </Button>
                        </div>
                    </SheetContent>
                )}
              </Sheet>
            </section>
            
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold font-headline">Weekly Pool Volume</h2>
                <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
                  <Button variant={chartView === 'area' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setChartView('area')}>
                    <AreaChartIcon className="h-4 w-4" />
                  </Button>
                  <Button variant={chartView === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setChartView('bar')}>
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button variant={chartView === 'candlestick' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setChartView('candlestick')}>
                    <CandlestickChart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
                <Card className="bg-card border-0 shadow-sm">
                    <CardContent className="p-4">
                        <ChartContainer config={chartConfig} className="h-40 w-full">
                            {renderChart()}
                        </ChartContainer>
                    </CardContent>
                </Card>
            </section>

          </>
        )}
      </main>
      <Sheet open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full max-h-full">
            <InvestmentAssistantSheet onClose={() => setIsAssistantOpen(false)} />
          </SheetContent>
      </Sheet>
      {activeFilter === 'continental' && (
        <div className="sticky bottom-0 p-4 bg-background border-t z-20">
          <Button 
            className="w-full"
            size="lg"
            onClick={() => setIsAssistantOpen(true)}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Ask AI Assistant
          </Button>
        </div>
      )}
    </div>
  );
}
