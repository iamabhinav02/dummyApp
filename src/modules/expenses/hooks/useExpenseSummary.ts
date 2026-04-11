import { useMemo } from 'react';
import { IExpenseItem } from '../../../types/reducers';

export const useExpenseSummary = (items: IExpenseItem[]) => {
  return useMemo(() => {
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const categories = Array.from(new Set(items.map((item) => item.category))).length;

    return {
      totalAmount,
      categories,
      totalItems: items.length,
    };
  }, [items]);
};
