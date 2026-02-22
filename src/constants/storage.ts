export const STORAGE_KEYS = {
  CONVERSION_HISTORY: 'conversion_history',
};

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
