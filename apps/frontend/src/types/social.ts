
export interface UserProfile {
    name: string;
    handle: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    posts: number;
    reshares: number;
    isFollowing: boolean;
}

export interface SocialFeed {
    id: number;
    user: string;
    handle: string;
    avatar: string;
    content: string;
    image?: string;
    imageHint?: string;
    videoUrl?: string;
    likes: number;
    comments: number;
    shares: number;
    views: string;
    timestamp: string;
    isLiked: boolean;
    sponsored?: boolean;
    cta?: {
        text: string;
        link: string;
    };
}
