import { IGoal } from '@mixafrica/shared/types/goal';
import { type StateCreator } from 'zustand';



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
  goals: [],
  pastGoals: [],
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
