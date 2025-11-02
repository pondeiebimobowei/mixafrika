
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Goal } from '@/types';

interface GoalSelectProps {
    onValueChange: (value: string) => void;
    goals: Goal[];
}

export function GoalSelect({ onValueChange, goals }: GoalSelectProps) {
    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select a goal..." />
            </SelectTrigger>
            <SelectContent>
                {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id.toString()}>
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{goal.icon}</span>
                            <div>
                                <p className="font-semibold">{goal.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Current: ₦{goal.current.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
