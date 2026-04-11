import { useMemo } from 'react';
import { IGoalItem } from '../../../types/reducers';

export const useGoalProgress = (goal: IGoalItem) => {
  return useMemo(() => {
    if (goal.targetAmount <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
  }, [goal.savedAmount, goal.targetAmount]);
};
