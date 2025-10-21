
export type Notification = {
  id: number;
  type: 'new_match' | 'new_cluster' | 'goal_achieved' | 'new_follower';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
};

export type SocialNotification = {
  id: number;
  type: 'new_follower' | 'new_like' | 'new_comment';
  user: string;
  avatar: string;
  message: string;
  read: boolean;
  timestamp: string;
};

export type NotificationsData = {
  Today: Notification[];
  "This week": Notification[];
};
