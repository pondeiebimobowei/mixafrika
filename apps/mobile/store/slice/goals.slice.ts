import { IGoal } from '@mixafrica/shared/types/goal';
import { type StateCreator } from 'zustand';

const initialGoals: IGoal[] = [
  {
    user_id: '4',
    name: 'Macbook Pro',
    current_amount: 800000,
    target: 1500000,
    image: '💻',
    target_date: '2025-06-01',
    // activities: []
  },
  {
    user_id: '1',
    name: 'New Car',
    current_amount: 1200000,
    target: 3000000,
    image: '🚗',
    target_date: '2026-12-31',
    // activities: [
    //     { date: '2025-04-10', amount: 50000, type: 'contribution' },
    //     { date: '2025-04-01', amount: 100000, type: 'initial' },
    // ]
  },
  {
    user_id: '2',
    name: 'Vacation to Zanzibar',
    current_amount: 150000,
    target: 500000,
    image: '✈️',
    target_date: '2025-08-01',
    //  activities: [
    //     { date: '2025-04-05', amount: 50000, type: 'contribution' },
    // ]
  },
  {
    user_id: '3',
    name: 'Downpayment for House',
    current_amount: 2500000,
    target: 10000000,
    image: '🏠',
    target_date: '2028-01-01',
    // activities: []
  },
];

const initialPastGoals: IGoal[] = [
  {
    user_id: '5',
    name: 'Emergency Fund',
    current_amount: 500000,
    target: 500000,
    image: '🛡️',
    target_date: '2024-12-31',
    // activities: [],
    // status: 'completed',
  },
  {
    user_id: '6',
    name: 'Learn to Code Bootcamp',
    current_amount: 250000,
    target: 700000,
    image: '🎓',
    target_date: '2025-01-01',
    // activities: [],
    // status: 'abandoned',
  },
];

export interface GoalsSlice {
  goals: IGoal[];
  pastGoals: IGoal[];
  addGoal: (goal: Omit<IGoal, 'id' | 'current' | 'activities'>) => void;
  updateGoal: (goalId: string, updatedData: Partial<Omit<IGoal, 'id'>>) => void;
  addContribution: (goalId: string, amount: number) => void;
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
    const newGoal: IGoal = {
      ...newGoalData,
      user_id: Date.now().toString(),
      current_amount: 0,
      // activities: [],
    };
    set((state) => {
      state.goals.unshift(newGoal);
    });
  },
  updateGoal: (goalId, updatedData) => {
    set((state) => {
      const goalIndex = state.goals.findIndex((g) => g.user_id === goalId);
      if (goalIndex !== -1) {
        state.goals[goalIndex] = { ...state.goals[goalIndex], ...updatedData };
      }
    });
  },
  addContribution: (goalId, amount) => {
    set((state) => {
      const goal = state.goals.find((g) => g.user_id === goalId);
      if (goal) {
        goal.current_amount += amount;
        const newActivity = {
          date: new Date().toISOString().split('T')[0],
          amount,
          type: 'contribution',
        };
        // goal.activities.unshift(newActivity);
      }
    });
  },
});
