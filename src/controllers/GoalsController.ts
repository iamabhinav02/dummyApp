import { STORAGE_KEYS } from '../constants/storage';
import { MODULES } from '../constants/modules';
import { GOALS } from '../reducers/actions';
import CommonReduxStore from '../store/commonStore';
import { IGoalItem, IGoalsReducer } from '../types/reducers';
import { AsyncStorageController } from './AsyncStorageController';

export const GoalsController = {
  async hydrate() {
    const items = await AsyncStorageController.get<IGoalItem[]>(STORAGE_KEYS.GOALS_ITEMS);
    if (!items) {
      return;
    }

    CommonReduxStore.getInstance().dispatch({
      type: GOALS.SET_ITEMS,
      payload: { items },
    });
  },

  async upsertGoal(goal: Omit<IGoalItem, 'id' | 'updatedAt'> & { id?: string }) {
    const state = CommonReduxStore.getInstance().getState()[MODULES.GOALS.reducerKey] as IGoalsReducer;
    const currentItems = state.items || [];

    const item: IGoalItem = {
      id: goal.id || `goal-${Date.now()}`,
      updatedAt: Date.now(),
      name: goal.name,
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
    };

    const newItems = [item, ...currentItems.filter((existingGoal) => existingGoal.id !== item.id)];

    CommonReduxStore.getInstance().dispatch({
      type: GOALS.SET_ITEMS,
      payload: { items: newItems },
    });

    await AsyncStorageController.set(STORAGE_KEYS.GOALS_ITEMS, newItems);
  },

  async removeGoal(goalId: string) {
    const state = CommonReduxStore.getInstance().getState()[MODULES.GOALS.reducerKey] as IGoalsReducer;
    const currentItems = state.items || [];
    const newItems = currentItems.filter((item) => item.id !== goalId);

    CommonReduxStore.getInstance().dispatch({
      type: GOALS.SET_ITEMS,
      payload: { items: newItems },
    });

    await AsyncStorageController.set(STORAGE_KEYS.GOALS_ITEMS, newItems);
  },
};
