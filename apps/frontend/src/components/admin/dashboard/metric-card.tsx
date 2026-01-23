import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    subtitle: string;
    change?: {
        value: string;
        trend: 'up' | 'down';
    };
    icon?: LucideIcon;
    variant?: 'default' | 'dark';
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    variant = 'default'
}) => {
    const isDark = variant === 'dark';

    return (
        <Card className={cn(
            "border-none rounded-4xl shadow-sm p-0",
            isDark ? "bg-[#1B4D3E] text-white" : "bg-white"
        )}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div className={cn(
                        "p-2 rounded-lg",
                        isDark ? "bg-white/10" : "bg-green-50"
                    )}>
                        {Icon && <Icon size={20} className={cn(isDark ? "text-white" : "text-primary")} />}
                    </div>
                    {/* Menu dots (optional) */}
                </div>

                <div className="space-y-1">
                    {change && (
                        <div className={cn("text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1 mb-2",
                            change.trend === 'up' ? (isDark ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700') : 'bg-red-100 text-red-700'
                        )}>
                            {change.trend === 'up' ? "+" : "-"}{change.value}
                        </div>
                    )}
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-xl font-bold text-black">{value}</h2>
                    </div>
                    <h3 className={cn("text-xs font-medium", isDark ? "text-gray-200" : "text-gray-500")}>
                        {title}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
};

export default MetricCard;
