export const STORAGE_KEYS = {
  THEME_MODE: 'theme:mode',
  CONVERSATION_MESSAGES: 'conversation:messages',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
