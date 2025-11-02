import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, ArrowLeft, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '../ui/separator';
import type { Goal } from '@/types';
import { useGoalsStore } from '@/store';

type ViewState = 
    | { view: 'list' }
    | { view: 'details'; goal: Goal }
    | { view: 'create' }
    | { view: 'edit'; goal: Goal }

type GoalFormData = Omit<Goal, 'id' | 'current' | 'activities'>;


function GoalFormView({ existingGoal, onSave, onBack }: { existingGoal?: Goal, onSave: (data: GoalFormData) => void, onBack: () => void }) {
    const [name, setName] = useState(existingGoal?.name || '');
    const [target, setTarget] = useState(existingGoal?.target.toString() || '');
    const [icon, setIcon] = useState(existingGoal?.icon || '💰');
    const [targetDate, setTargetDate] = useState(existingGoal?.targetDate || '');
    const isEditing = !!existingGoal;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const goalData: GoalFormData = { name, target: parseFloat(target), icon, targetDate };
        onSave(goalData);
    };

    return (
        <>
            <SheetHeader className="px-4 pt-4 pb-4 border-b">
                <div className="flex items-center">
                     <Button variant="ghost" size="icon" className="-ml-2" onClick={onBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <SheetTitle className="text-lg font-bold mx-auto pr-8">{isEditing ? 'Edit Goal' : 'Create Goal'}</SheetTitle>
                </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div>
                        <Label htmlFor="goal-name">Goal Name</Label>
                        <Input id="goal-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., New Car" required />
                    </div>
                    <div>
                        <Label htmlFor="goal-target">Target Amount</Label>
                        <Input id="goal-target" type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g., 3000000" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="goal-icon">Icon</Label>
                             <Input id="goal-icon" value={icon} onChange={e => setIcon(e.target.value)} placeholder="e.g., 🚗" maxLength={2} required />
                             <p className="text-xs text-muted-foreground mt-1">Emoji</p>
                        </div>
                        <div>
                            <Label htmlFor="goal-date">Target Date</Label>
                            <Input id="goal-date" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-background border-t">
                    <Button type="submit" size="lg" className="w-full">
                        {isEditing ? 'Save Changes' : 'Create Goal'}
                    </Button>
                </div>
            </form>
        </>
    )
};

export function GoalsSheet() {
    const [viewState, setViewState] = useState<ViewState>({ view: 'list' });
    const { goals, pastGoals, addGoal, updateGoal } = useGoalsStore();

    const handleCreateGoal = (newGoalData: GoalFormData) => {
        addGoal(newGoalData);
        setViewState({ view: 'list' });
    };

    const handleUpdateGoal = (goalId: number, updatedGoalData: GoalFormData) => {
        updateGoal(goalId, { ...updatedGoalData, target: Number(updatedGoalData.target) });
        setViewState({ view: 'list' });
    }

    const renderListView = () => (
        <>
            <SheetHeader className="px-4 pt-4 pb-4 border-b">
                <div className="flex justify-between items-center">
                    <SheetTitle className="text-lg font-bold">My Goals</SheetTitle>
                    <SheetClose asChild>
                        <Button>Done</Button>
                    </SheetClose>
                </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-muted-foreground text-sm px-2">
                    Track your financial goals and see your progress.
                </p>

                {goals.map((goal) => (
                    <Card key={goal.id} className="bg-card cursor-pointer" onClick={() => setViewState({ view: 'details', goal })}>
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className='flex items-center gap-3'>
                                    <span className="text-xl">{goal.icon}</span>
                                    <h3 className="font-semibold text-base">{goal.name}</h3>
                                </div>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setViewState({ view: 'edit', goal })}}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-base font-bold text-primary">
                                        ₦{goal.current.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        of ₦{goal.target.toLocaleString()}
                                    </span>
                                </div>
                                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {pastGoals.length > 0 && (
                    <div className="pt-4">
                        <Separator />
                        <h3 className="text-lg font-bold my-4">Past Goals</h3>
                        <div className="space-y-3">
                            {pastGoals.map((goal) => (
                                <Card key={goal.id} className="bg-card opacity-70">
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div className='flex items-center gap-3'>
                                                <span className="text-xl">{goal.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold text-base">{goal.name}</h3>
                                                    <p className="text-xs text-muted-foreground">Target: ₦{goal.target.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            {goal.status === 'completed' ? (
                                                <div className="flex items-center gap-1.5 text-green-500">
                                                    <CheckCircle className="h-5 w-5" />
                                                    <span className="text-xs font-semibold">Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-red-500">
                                                    <XCircle className="h-5 w-5" />
                                                    <span className="text-xs font-semibold">Abandoned</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 bg-background border-t">
                <Button size="lg" className="w-full" onClick={() => setViewState({ view: 'create' })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Goal
                </Button>
            </div>
        </>
    );

    const renderDetailView = (goal: Goal) => (
         <>
            <SheetHeader className="px-4 pt-4 pb-4 border-b">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setViewState({ view: 'list' })}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="mx-auto pr-8 text-center">
                        <span className="text-2xl block">{goal.icon}</span>
                        <SheetTitle className="text-lg font-bold">{goal.name}</SheetTitle>
                    </div>
                </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <Card>
                    <CardContent className="p-4 space-y-2">
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        <div className="flex justify-between items-baseline">
                            <div>
                               <p className="text-xs text-muted-foreground">Progress</p>
                               <span className="text-lg font-bold text-primary">₦{goal.current.toLocaleString()}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Target: ₦{goal.target.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
                 <div className="grid grid-cols-2 gap-2">
                    <Button>Contribute</Button>
                    <Button variant="outline">Withdraw</Button>
                </div>
                <div className="flex gap-2">
                     <Button variant="outline" className="flex-1" onClick={() => setViewState({ view: 'edit', goal })}>Edit Goal</Button>
                     <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4"/></Button>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <div className="space-y-2">
                    {goal.activities.length > 0 ? goal.activities.map((activity, index) => (
                        <div key={index} className="flex justify-between items-center text-sm p-3 bg-card rounded-md">
                            <p>Contribution</p>
                            <div className="text-right">
                               <p className="font-medium text-primary">+₦{activity.amount.toLocaleString()}</p>
                               <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                    )}
                    </div>
                </div>
            </div>
        </>
    );

    const renderContent = () => {
        switch (viewState.view) {
            case 'list':
                return renderListView();
            case 'details':
                return renderDetailView(viewState.goal);
            case 'create':
                return <GoalFormView onSave={handleCreateGoal} onBack={() => setViewState({ view: 'list' })} />;
            case 'edit':
                return <GoalFormView existingGoal={viewState.goal} onSave={(data) => handleUpdateGoal(viewState.goal.id, data)} onBack={() => setViewState({ view: 'list' })} />;
            default:
                return renderListView();
        }
    };

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
        {renderContent()}
    </div>
  );
}
