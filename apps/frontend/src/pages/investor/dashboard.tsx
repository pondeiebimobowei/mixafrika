import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, TrendingUp, Heart, MessageCircle, Repeat, X, Eye } from "lucide-react";
import {
  ChartContainer
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, Cell, XAxis, YAxis, Tooltip, Area, AreaChart as RechartsAreaChart, CartesianGrid } from 'recharts';
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { ChartType, Timeframe } from '@/types';
import { dashboardClusters, generateChartData, chartData1D } from '@/data/investor';
import { initialSocialFeeds } from "@/data";
import toast from "react-hot-toast";
import { NotificationsSheet } from "@/components/modals/notification-sheet";
import { Link } from "react-router";
import { PlaceHolderImages } from "@/lib/place-holder-image";


const timeframes: { [key: string]: {label: string, data: any[], totalChange: number, percentageChange: number} } = {
    '1H': { label: "Past Hour's Gain", ...generateChartData(12, '5m')},
    '1D': { label: "Today's Gain", ...chartData1D },
    '1W': { label: "This Week's Gain", ...generateChartData(7, 'Day') },
    '1M': { label: "This Month's Gain", ...generateChartData(30, 'Day') },
    '3M': { label: "3-Month Gain", ...generateChartData(12, 'Week') },
    '1Y': { label: "This Year's Gain", ...generateChartData(12, 'Month') },
    'All': { label: "All Time Gain", ...generateChartData(24, 'Month') }
}

export default function InvestorDashboardPage() {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [socialFeeds, setSocialFeeds] = useState(initialSocialFeeds);

  const { label, data: chartData, totalChange, percentageChange } = timeframes[timeframe];
  
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const { value } = data.activePayload[0].payload;
      toast.success(`₦${value.toLocaleString()}`);
    }
  };

  const handleLike = (feedId: number) => {
    setSocialFeeds(feeds =>
      feeds.map(feed => {
        if (feed.id === feedId) {
          const isLiked = !feed.isLiked;
          const likes = isLiked ? feed.likes + 1 : feed.likes - 1;
          return { ...feed, isLiked, likes };
        }
        return feed;
      })
    );
  };
  
  const handleActionClick = (action: string) => {
    console.log(action)
    toast.success("This functionality is not yet implemented.");
  };

  const filteredClusters = useMemo(() => {
    if (!searchQuery) return dashboardClusters;
    const lowercasedQuery = searchQuery.toLowerCase();
    return dashboardClusters.filter(cluster => 
      cluster.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  const filteredSocialFeeds = useMemo(() => {
    if (!searchQuery) return socialFeeds;
    const lowercasedQuery = searchQuery.toLowerCase();
    return socialFeeds.filter(feed =>
      feed.user.toLowerCase().includes(lowercasedQuery) ||
      feed.handle.toLowerCase().includes(lowercasedQuery) ||
      feed.content.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, socialFeeds]);


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4">
        <div className={cn("transition-all duration-300", isSearchOpen ? "opacity-0 w-0" : "opacity-100 w-auto")}>
          <p className="text-primary">Portfolio value</p>
          <p className="text-2xl font-bold font-headline flex items-center gap-2">
            ₦241,124.00
          </p>
        </div>
        <div className={cn("flex items-center gap-2 transition-all duration-300", isSearchOpen ? "flex-1" : "")}>
           <div className={cn("relative flex items-center transition-all duration-300", isSearchOpen ? "w-full" : "w-auto")}>
            <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground", isSearchOpen ? "" : "hidden")}>
                <Search />
            </div>
            <Input
                placeholder="Search..."
                className={cn(
                    "pl-10 bg-card border-0 rounded-full transition-all duration-300",
                    isSearchOpen ? "w-full sm:w-full" : "w-0 p-0 border-transparent"
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="rounded-full">
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-6 w-6" />}
            </Button>
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("rounded-full", isSearchOpen ? "hidden" : "block")}>
                    <Bell className="h-6 w-6 text-yellow-600" />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full">
                <SheetTitle className="sr-only">Notifications</SheetTitle>
                <NotificationsSheet />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1 p-4 space-y-6">
        <Card className="bg-card border-0 shadow-xl overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold flex items-center text-grass-green">
                        <TrendingUp className="h-4 w-4 mr-1" /> ₦{totalChange.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (+{percentageChange.toFixed(2)}%)
                    </p>
                </div>
              <div className="flex items-center gap-2">
                  <Button variant={chartType === 'bar' ? 'secondary' : 'ghost'} size="sm" onClick={() => setChartType('bar')} className="px-3 h-8 text-xs rounded-full">Bar</Button>
                  <Button variant={chartType === 'area' ? 'secondary' : 'ghost'} size="sm" onClick={() => setChartType('area')} className="px-3 h-8 text-xs rounded-full">Area</Button>
              </div>
            </div>
            <div className="h-[150px] w-full mt-4">
               <ChartContainer config={{}} className="h-full w-full">
                  {chartType === 'bar' ? (
                    <RechartsBarChart 
                        data={chartData} 
                        margin={{ top: 5, right: 0, left: -35, bottom: -10 }}
                        onClick={handleBarClick}
                    >
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                        <YAxis tickLine={false} axisLine={false} tick={false} />
                        <Tooltip
                            cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            labelStyle={{color: 'hsl(var(--muted-foreground))'}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                  ) : (
                    <RechartsAreaChart data={chartData} margin={{ top: 5, right: 0, left: -35, bottom: -10 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                        <YAxis domain={['dataMin', 'dataMax']} tickLine={false} axisLine={false} tick={false} />
                        <Tooltip
                            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            labelStyle={{color: 'hsl(var(--muted-foreground))'}}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" />
                    </RechartsAreaChart>
                  )}
                </ChartContainer>
            </div>
             <div className="flex justify-around mt-4">
                {(['1H','1D', '1W', '1M', '3M', '1Y', 'All'] as Timeframe[]).map((period) => (
                  <Button key={period} variant={timeframe === period ? 'default' : 'ghost'} onClick={() => setTimeframe(period)} className="px-3 h-8 text-xs rounded-full">
                    {period}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold font-headline">Clusters</h2>
            <Button variant="link" className="text-primary" asChild><Link to="/market" >See all</Link></Button>
          </div>
          <div className="space-y-2">
            {filteredClusters.map((cluster) => (
              <Link to={`/clusters/${cluster.id}`} key={cluster.name} className="block" >
                <Card className="bg-card border-0 mb-2">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-full", cluster.bgColor)}>
                          <cluster.icon className={cn("h-6 w-6", cluster.color)} />
                      </div>
                      <div>
                        <p className="font-semibold">{cluster.name}</p>
                        <p className="text-[10px] text-muted-foreground tracking-wide">{cluster.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{cluster.roi}</p>
                      <p className="text-sm text-primary">{cluster.roiPercent}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
             {filteredClusters.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                    <p>No clusters found for &quot;{searchQuery}&quot;</p>
                </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold font-headline">Social Feeds</h2>
            <Button variant="link" className="text-primary" asChild><Link to="/social">See all</Link></Button>
          </div>
          <div className="space-y-4">
            {filteredSocialFeeds.map((feed) => {
               const avatarImage = PlaceHolderImages.find(p => p.id === `user-avatar-${feed.handle.split('_')[0]}`);
               const feedImage = feed.image ? PlaceHolderImages.find(p => p.imageUrl === feed.image) : undefined;
               return (
              <Card key={feed.id} className="bg-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      {avatarImage && <AvatarImage src={avatarImage.imageUrl} />}
                      <AvatarFallback>{feed.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <p className="font-semibold">{feed.user}</p>
                        <p className="text-xs text-muted-foreground">@{feed.handle}</p>
                         <p className="text-xs text-muted-foreground">&middot;</p>
                        <p className="text-xs text-muted-foreground">{feed.timestamp}</p>
                      </div>
                      <p className="mt-1 text-sm">{feed.content}</p>
                      {feed.image && feedImage && (
                        <img
                            src={feedImage.imageUrl}
                            alt="Feed image"
                            width={600}
                            height={400}
                            className="mt-2 rounded-lg border w-full object-cover"
                            data-ai-hint={feedImage.imageHint}
                        />
                      )}
                      <div className="flex justify-between items-center mt-3 text-muted-foreground -ml-2">
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1.5 text-xs hover:text-red-500"
                              onClick={() => handleLike(feed.id)}
                          >
                              <Heart className={cn("h-4 w-4", feed.isLiked && "fill-red-500 text-red-500")} />
                              {feed.likes}
                          </Button>
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1.5 text-xs hover:text-primary"
                              onClick={() => handleActionClick('Comment')}
                          >
                              <MessageCircle className="h-4 w-4" />
                              {feed.comments}
                          </Button>
                           <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1.5 text-xs hover:text-primary"
                              onClick={() => handleActionClick('Share')}
                          >
                              <Repeat className="h-4 w-4" />
                              {feed.shares}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs">
                              <Eye className="h-4 w-4" />
                              <span>{feed.views}</span>
                          </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )})}
            {filteredSocialFeeds.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                    <p>No feed items found for &quot;{searchQuery}&quot;</p>
                </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
