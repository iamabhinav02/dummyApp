export const STORAGE_KEYS = {
  THEME_MODE: 'theme:mode',
  /** Shared metadata: users, conversation records, and the active id (no messages). */
  CONVERSATION_INDEX: 'conversation:index',
} as const;

/**
 * Per-conversation message store key, so each conversation persists and loads
 * independently — writing a message to one conversation never rewrites another.
 */
export const conversationMessagesKey = (
  conversationId: string,
): `conversation:messages:${string}` => `conversation:messages:${conversationId}`;

export type StorageKey =
  | typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
  | `conversation:messages:${string}`;
