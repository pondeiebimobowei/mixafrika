import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Heart, MessageSquare, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import type { SocialNotification } from '@/types';


type SocialNotificationsData = {
  "Today": SocialNotification[];
  "This week": SocialNotification[];
};

const notificationConfig = {
  new_follower: {
    icon: UserPlus,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  new_like: {
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  new_comment: {
    icon: MessageSquare,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
};

interface SocialNotificationsSheetProps {
    notifications: SocialNotificationsData;
    setNotifications: Dispatch<SetStateAction<SocialNotificationsData>>;
}

export function SocialNotificationsSheet({ notifications, setNotifications }: SocialNotificationsSheetProps) {

  const handleNotificationClick = (id: number) => {
    const newNotifications = { ...notifications };
    let notificationFound = false;

    for (const group in newNotifications) {
      if (notificationFound) break;
      const items = (newNotifications as any)[group];
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          if (!items[i].read) {
            items[i].read = true;
            notificationFound = true;
          }
          break;
        }
      }
    }

    if (notificationFound) {
      setNotifications(newNotifications);
    }
  };
  
  const unreadCount = Object.values(notifications).flat().filter(n => !n.read).length;

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <SheetHeader className="px-4 pt-4 pb-4 border-b">
        <SheetTitle className="sr-only">Social Notifications</SheetTitle>
        <div className="flex items-center">
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground -ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </SheetClose>
          <div className="flex items-center gap-2 mx-auto pr-8">
            <h2 className="text-2xl font-bold">Activity</h2>
            {unreadCount > 0 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-sm font-bold">
                    {unreadCount}
                </div>
            )}
          </div>
        </div>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <div className="py-4">
          {Object.entries(notifications).map(([group, items]) => (
            <div key={group}>
              <h3 className="font-semibold text-muted-foreground px-4 mb-2 mt-2">{group}</h3>
              <div className="flex flex-col">
                {items.map((notification) => {
                  const config = notificationConfig[notification.type];
                  const Icon = config.icon;
                  return (
                    <div 
                        key={notification.id} 
                        className="flex items-start gap-4 px-4 py-3 border-b cursor-pointer"
                        onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.avatar} alt={notification.user} />
                            <AvatarFallback>{notification.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center", config.bgColor)}>
                              <Icon className={cn("h-3 w-3", config.color)} />
                          </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm">
                            <span className="font-semibold">{notification.user}</span>
                            &nbsp;
                            {notification.message}
                        </p>
                      </div>
                      <div className='text-right pt-1'>
                        {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-red-500 ml-auto mb-2" />
                        )}
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{notification.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
