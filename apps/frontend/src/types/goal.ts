
export type Goal = {
  id: number;
  name: string;
  current: number;
  target: number;
  icon: string;
  targetDate: string;
  activities: GoalActivity[];
};

export type GoalActivity = {
    date: string;
    amount: number;
    type: 'contribution' | 'initial';
};

export type PastGoal = Goal & { status: 'completed' | 'abandoned' };
