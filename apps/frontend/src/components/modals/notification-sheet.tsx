import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, CheckCircle2, Heart, PlusCircle, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationsStore } from '@/store';

const notificationConfig = {
  new_match: {
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  new_cluster: {
    icon: PlusCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  goal_achieved: {
    icon: CheckCircle2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  new_follower: {
    icon: UserPlus,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
};


export function NotificationsSheet() {
  const { notifications, markNotificationAsRead } = useNotificationsStore();

  const handleNotificationClick = (id: number) => {
    markNotificationAsRead(id);
  };
  
  const unreadCount = Object.values(notifications).flat().filter(n => !n.read).length;

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <SheetHeader className="px-4 pt-4 pb-4 border-b">
        <SheetTitle className="sr-only">Notifications</SheetTitle>
        <div className="flex items-center">
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground -ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </SheetClose>
          <div className="flex items-center gap-2 mx-auto pr-8">
            <h2 className="text-2xl font-bold">Notifications</h2>
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
                      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0", config.bgColor)}>
                          <Icon className={cn("h-6 w-6", config.color)} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold leading-tight text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                      <div className='text-right'>
                        {!notification.read && (
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 ml-auto mb-2" />
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
