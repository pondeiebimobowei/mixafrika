
import { type StateCreator } from 'zustand';
import type { Goal, PastGoal, GoalActivity } from '@/types';

const initialGoals: Goal[] = [
    {
    id: 4,
    name: 'Macbook Pro',
    current: 800000,
    target: 1500000,
    icon: '💻',
    targetDate: '2025-06-01',
    activities: []
  },
  {
    id: 1,
    name: 'New Car',
    current: 1200000,
    target: 3000000,
    icon: '🚗',
    targetDate: '2026-12-31',
    activities: [
        { date: '2025-04-10', amount: 50000, type: 'contribution' },
        { date: '2025-04-01', amount: 100000, type: 'initial' },
    ]
  },
  {
    id: 2,
    name: 'Vacation to Zanzibar',
    current: 150000,
    target: 500000,
    icon: '✈️',
    targetDate: '2025-08-01',
     activities: [
        { date: '2025-04-05', amount: 50000, type: 'contribution' },
    ]
  },
  {
    id: 3,
    name: 'Downpayment for House',
    current: 2500000,
    target: 10000000,
    icon: '🏠',
    targetDate: '2028-01-01',
    activities: []
  },
];

const initialPastGoals: PastGoal[] = [
  {
    id: 5,
    name: 'Emergency Fund',
    current: 500000,
    target: 500000,
    icon: '🛡️',
    targetDate: '2024-12-31',
    activities: [],
    status: 'completed',
  },
  {
    id: 6,
    name: 'Learn to Code Bootcamp',
    current: 250000,
    target: 700000,
    icon: '🎓',
    targetDate: '2025-01-01',
    activities: [],
    status: 'abandoned',
  },
];

export interface GoalsSlice {
  goals: Goal[];
  pastGoals: PastGoal[];
  addGoal: (goal: Omit<Goal, 'id' | 'current' | 'activities'>) => void;
  updateGoal: (goalId: number, updatedData: Partial<Omit<Goal, 'id'>>) => void;
  addContribution: (goalId: number, amount: number) => void;
}

export const createGoalsSlice: StateCreator<
  GoalsSlice,
  [['zustand/immer', never]],
  [],
  GoalsSlice
> = (set) => ({
  goals: initialGoals,
  pastGoals: initialPastGoals,
  addGoal: (newGoalData) => {
    const newGoal: Goal = {
      id: Date.now(),
      current: 0,
      activities: [],
      ...newGoalData,
    };
    set(state => {
        state.goals.unshift(newGoal);
    });
  },
  updateGoal: (goalId, updatedData) => {
    set(state => {
      const goalIndex = state.goals.findIndex(g => g.id === goalId);
      if (goalIndex !== -1) {
        state.goals[goalIndex] = { ...state.goals[goalIndex], ...updatedData };
      }
    });
  },
  addContribution: (goalId, amount) => {
    set(state => {
      const goal = state.goals.find(g => g.id === goalId);
      if(goal) {
          goal.current += amount;
          const newActivity: GoalActivity = {
            date: new Date().toISOString().split('T')[0],
            amount,
            type: 'contribution',
          };
          goal.activities.unshift(newActivity);
      }
    });
  }
});
