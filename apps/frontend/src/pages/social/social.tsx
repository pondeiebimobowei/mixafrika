import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Bell, MoreHorizontal, Heart, MessageSquare, Repeat, Eye, Image as ImageIcon, Film, FileText, BarChart2, Award, UserPlus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { SocialFeed, UserProfile } from '@/types';
import { userProfiles, initialSocialFeeds, initialSocialNotificationsData } from '@/data/social';
import { Link } from 'react-router';
import { SocialNotificationsSheet } from '@/components/modals/social-notifications-sheet';
import toast from 'react-hot-toast';


export default function SocialFeedPage() {
    const [socialFeeds, setSocialFeeds] = useState<SocialFeed[]>(initialSocialFeeds);
    const [newPostContent, setNewPostContent] = useState('');
    const [socialNotifications, setSocialNotifications] = useState(initialSocialNotificationsData);
    const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);

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

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;

        const newPost: SocialFeed = {
            id: Date.now(),
            user: "Kelvin",
            handle: "kelvin_invest",
            avatar: "https://picsum.photos/seed/104/200/200",
            content: newPostContent,
            likes: 0,
            comments: 0,
            shares: 0,
            views: '1',
            timestamp: "Just now",
            isLiked: false,
        };

        setSocialFeeds([newPost, ...socialFeeds]);
        setNewPostContent('');
    };

    const handleFollowToggle = (handle: string) => {
        if (!viewingProfile) return;
        setViewingProfile(prev => prev ? { ...prev, isFollowing: !prev.isFollowing } : null);
        toast.success(`You followed ${handle}`)
        // Note: This only affects the dialog. A real app would need to update the main userProfiles object
        // or make an API call.
    };

    return (
        <Dialog open={!!viewingProfile} onOpenChange={(isOpen) => !isOpen && setViewingProfile(null)}>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/">

                    <ArrowLeft />
                  </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline">Community</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Bell />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full">
                        <SheetTitle className="sr-only">Social Notifications</SheetTitle>
                        <SocialNotificationsSheet notifications={socialNotifications} setNotifications={setSocialNotifications} />
                    </SheetContent>
                </Sheet>
            </header>

            <main className="flex-1 p-4 space-y-4">
                 <Card className="bg-card border-0 shadow-sm rounded-xl">
                    <CardContent className="p-3">
                       <div className="flex items-start gap-3">
                           <Avatar className="h-9 w-9">
                                <AvatarImage src="https://picsum.photos/seed/104/200/200" />
                                <AvatarFallback>K</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    placeholder="What's on your mind, Kelvin?"
                                    className="bg-transparent border-0 focus-visible:ring-0 p-0 text-base"
                                    rows={2}
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                                            <ImageIcon className="h-5 w-5" />
                                        </Button>
                                         <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                                            <Film className="h-5 w-5" />
                                        </Button>
                                         <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                                            <BarChart2 className="h-5 w-5" />
                                        </Button>
                                         <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                                            <FileText className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <Button size="sm" onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                                        Post
                                    </Button>
                                </div>
                            </div>
                       </div>
                    </CardContent>
                 </Card>
                 <h2 className="text-lg font-semibold font-headline px-1 pt-2">Recent Activity</h2>
                 {socialFeeds.map((feed) => {
                    const profile = userProfiles[feed.handle as keyof typeof userProfiles];
                    return (
                    <Card key={feed.id} className="bg-card border-0 shadow-sm rounded-xl">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <DialogTrigger asChild>
                                    <Avatar className="h-10 w-10 cursor-pointer" onClick={() => setViewingProfile(profile)}>
                                        <AvatarImage src={feed.avatar} />
                                        <AvatarFallback>{feed.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </DialogTrigger>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <DialogTrigger asChild>
                                                <p className="font-semibold cursor-pointer" onClick={() => setViewingProfile(profile)}>{feed.user}</p>
                                            </DialogTrigger>
                                            <p className="text-xs text-muted-foreground">{feed.timestamp}</p>
                                        </div>
                                         {feed.sponsored ? (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>Sponsored</span>
                                                <Award className="h-4 w-4 text-yellow-500" />
                                            </div>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                                                <MoreHorizontal className="h-5 w-5"/>
                                            </Button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm">{feed.content}</p>
                                    {feed.image && (
                                        <div className="mt-2 rounded-lg border overflow-hidden relative">
                                            <img
                                                src={feed.image}
                                                alt="Feed image"
                                                width={600}
                                                height={400}
                                                className="w-full object-cover"
                                                data-ai-hint={feed.imageHint}
                                            />
                                            {feed.cta && (
                                                <Button asChild className="absolute bottom-3 left-3 right-3">
                                                    <Link to={feed.cta.link}>{feed.cta.text}</Link>
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                    {feed.videoUrl && (
                                        <div className="mt-2 rounded-lg border overflow-hidden">
                                            <video
                                                src={feed.videoUrl}
                                                controls
                                                className="w-full aspect-video"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 text-muted-foreground -ml-2 text-xs">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1.5 text-xs hover:text-primary"
                                    onClick={() => handleLike(feed.id)}
                                >
                                    <Heart className={cn("h-4 w-4", feed.isLiked && "fill-primary text-primary")} />
                                    {feed.likes}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1.5 text-xs hover:text-primary"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    {feed.comments}
                                </Button>
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1.5 text-xs hover:text-primary"
                                >
                                    <Repeat className="h-4 w-4" />
                                    {feed.shares}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    <span>{feed.views}</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                 )})}
            </main>
             {viewingProfile && (
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={viewingProfile.avatar} />
                                    <AvatarFallback>{viewingProfile.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <DialogTitle className="text-lg">{viewingProfile.name}</DialogTitle>
                                    <p className="text-sm text-muted-foreground">@{viewingProfile.handle}</p>
                                </div>
                            </div>
                            {viewingProfile.isFollowing ? (
                                <Button variant="secondary" onClick={() => handleFollowToggle(viewingProfile.handle)}>
                                    <Check className="mr-2 h-4 w-4" /> Following
                                </Button>
                            ) : (
                                <Button onClick={() => handleFollowToggle(viewingProfile.handle)}>
                                    <UserPlus className="mr-2 h-4 w-4" /> Follow
                                </Button>
                            )}
                        </div>
                    </DialogHeader>
                    <p className="text-sm my-3">{viewingProfile.bio}</p>
                    <Separator />
                     <div className="flex justify-around text-center py-2">
                        <div>
                            <span className="font-bold">{viewingProfile.followers.toLocaleString()}</span> <span className="text-muted-foreground text-sm">Followers</span>
                        </div>
                        <div>
                            <span className="font-bold">{viewingProfile.following.toLocaleString()}</span> <span className="text-muted-foreground text-sm">Following</span>
                        </div>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full mt-2">View Full Profile</Button>
                </DialogContent>
            )}
        </div>
        </Dialog>
    );
}
