import { STORAGE_KEYS } from '../constants/storage';
import { MODULES } from '../constants/modules';
import { EXPENSES } from '../reducers/actions';
import CommonReduxStore from '../store/commonStore';
import { IExpenseItem, IExpensesReducer } from '../types/reducers';
import { AsyncStorageController } from './AsyncStorageController';

export const ExpensesController = {
  async hydrate() {
    const items = await AsyncStorageController.get<IExpenseItem[]>(STORAGE_KEYS.EXPENSES_ITEMS);
    if (!items) {
      return;
    }

    CommonReduxStore.getInstance().dispatch({
      type: EXPENSES.SET_ITEMS,
      payload: { items },
    });
  },

  async addExpense(expense: Omit<IExpenseItem, 'id' | 'timestamp'>) {
    const state = CommonReduxStore.getInstance().getState()[MODULES.EXPENSES.reducerKey] as IExpensesReducer;
    const currentItems = state.items || [];

    const newItem: IExpenseItem = {
      id: `expense-${Date.now()}`,
      timestamp: Date.now(),
      ...expense,
    };

    const newItems = [newItem, ...currentItems];

    CommonReduxStore.getInstance().dispatch({
      type: EXPENSES.SET_ITEMS,
      payload: { items: newItems },
    });

    await AsyncStorageController.set(STORAGE_KEYS.EXPENSES_ITEMS, newItems);
  },

  async removeExpense(expenseId: string) {
    const state = CommonReduxStore.getInstance().getState()[MODULES.EXPENSES.reducerKey] as IExpensesReducer;
    const currentItems = state.items || [];
    const newItems = currentItems.filter((item) => item.id !== expenseId);

    CommonReduxStore.getInstance().dispatch({
      type: EXPENSES.SET_ITEMS,
      payload: { items: newItems },
    });

    await AsyncStorageController.set(STORAGE_KEYS.EXPENSES_ITEMS, newItems);
  },
};
