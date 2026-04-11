import { MODULES } from './modules';

export const STORAGE_KEYS = {
  EXPENSES_ITEMS: MODULES.EXPENSES.storageKey,
  CREDITSCORE_DATA: MODULES.CREDITSCORE.storageKey,
  GOALS_ITEMS: MODULES.GOALS.storageKey,
};

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
