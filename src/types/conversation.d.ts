/**
 * Domain model for the AI Conversation experience.
 *
 * State is NORMALIZED: messages live in a `messagesById` hashMap keyed by
 * `messageId`, with a `messageOrder` array giving their chronological order.
 * This lets a single message (e.g. a reaction change) update in place without
 * touching `messageOrder`, so only the affected row re-renders.
 *
 * These types are intentionally open-ended so new "conversation experiences"
 * (recommendation types, author types, reaction types) can be added without
 * reshaping the core. The concrete value sets live as enums in
 * `src/enums/conversation.ts`.
 */
import {
  FEEDBACK_REASON,
  LOAD_STATUS,
  MESSAGE_AUTHOR,
  MESSAGE_STATUS,
  REACTION_TYPE,
  RECOMMENDATION_TYPE,
} from '../enums/conversation';

/** Who authored a message in the timeline. */
export type MessageAuthorType = MESSAGE_AUTHOR;

/** Delivery lifecycle for optimistic (user-sent) messages. */
export type MessageDeliveryStatus = MESSAGE_STATUS;

/** A reason chip attached to a DISLIKE reaction (stored in `Reaction.comments`). */
export type FeedbackReason = FEEDBACK_REASON;

/**
 * A known reaction PLUS an open string, so new reaction experiences can be
 * introduced without a type change. This is the extensibility seam.
 */
export type ReactionType = REACTION_TYPE | (string & {});

/** Well-known recommendation experiences with a dedicated renderer. */
export type KnownRecommendationType = RECOMMENDATION_TYPE;

/**
 * A known experience PLUS an open string, so the backend can introduce future
 * experiences the client renders via a fallback until a dedicated renderer is
 * registered. This is the extensibility seam.
 */
export type RecommendationType = RECOMMENDATION_TYPE | (string & {});

export type Recommendation = {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
  /** Arbitrary payload for richer future experiences (price, deep-link, etc.). */
  meta?: Record<string, unknown>;
};

/**
 * A stable participant identity. Every author type maps to exactly one User,
 * so a message's `senderId` always resolves to a known, unique user.
 */
export type User = {
  userId: string;
  authorType: MessageAuthorType;
  displayName: string;
  /** Optional icon name (react-native-paper) for the author header. */
  icon?: string;
};

/**
 * A per-user reaction to a message. `comments` is the "list of comments"
 * carried with the reaction (e.g. the selected dislike reasons). LIKE/DISLIKE
 * are mutually exclusive per user; other reaction types are additive.
 */
export type Reaction = {
  messageId: string;
  userId: string;
  reactionType: ReactionType;
  comments: string[];
  createdAt: number;
};

export type Conversation = {
  conversationId: string;
  title?: string;
  /** userIds of every participant in this conversation. */
  participantIds: string[];
  createdAt: number;
  updatedAt?: number;
};

export type Message = {
  messageId: string;
  conversationId: string;
  /** userId of the author; resolves to a `User` in `usersById`. */
  senderId: string;
  /** Idempotency key for optimistic sends, so a retry can't duplicate a row. */
  clientRequestId?: string;
  /** Denormalized author category, kept so the renderer registry + grouping stay simple. */
  type: MessageAuthorType;
  text: string;
  createdAt: number;
  /** Present only for optimistic user messages moving through send lifecycle. */
  status?: MessageDeliveryStatus;
  /** Reactions attached to this message (like/dislike + comments, etc.). */
  reactions: Reaction[];
  /** Zero or more recommendation experiences surfaced with this message. */
  recommendations: Recommendation[];
  /** The messageId this one is replying to, if any (resolved to a preview at render time). */
  replyToMessageId?: string;
};

/**
 * Lightweight snapshot of the message being replied to. This is a DERIVED view
 * type (built at render time from `replyToMessageId`), not stored state.
 */
export type ReplyContext = {
  messageId: string;
  author: MessageAuthorType;
  preview: string;
};

/** Status of the initial conversation load (loading / empty / error handling). */
export type ConversationLoadStatus = LOAD_STATUS;

/** Normalized bundle used to bulk-load state (seed, hydrate, migration). */
export type NormalizedConversation = {
  usersById: Record<string, User>;
  conversationsById: Record<string, Conversation>;
  activeConversationId: string | null;
  messagesById: Record<string, Message>;
  messageOrder: string[];
};

export type ConversationState = {
  loadStatus: ConversationLoadStatus;
  usersById: Record<string, User>;
  conversationsById: Record<string, Conversation>;
  activeConversationId: string | null;
  /** hashMap of messageId -> Message. */
  messagesById: Record<string, Message>;
  /** chronological queue of messageIds; identity is stable across in-place patches. */
  messageOrder: string[];
};

/** Union payload shape consumed by the conversation reducer. */
export type ConversationActionPayload = {
  loadStatus?: ConversationLoadStatus;
  /** Bulk normalized snapshot for SET_MESSAGES. */
  snapshot?: NormalizedConversation;
  message?: Message;
  messageId?: string;
  patch?: Partial<Message>;
  reaction?: Reaction;
  /** For REMOVE_REACTION: identifies which reaction to drop. */
  userId?: string;
  reactionType?: ReactionType;
};
