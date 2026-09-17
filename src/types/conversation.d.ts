/**
 * Domain model for the AI Conversation experience.
 *
 * These types are intentionally open-ended so new "conversation experiences"
 * (recommendation types, author types) can be added without reshaping the core.
 */

/** Who authored a message in the timeline. */
export type MessageAuthorType = 'user' | 'ai' | 'human' | 'system';

/** Delivery lifecycle for optimistic (user-sent) messages. */
export type MessageDeliveryStatus = 'sending' | 'sent' | 'failed';

export type FeedbackRating = 'like' | 'dislike';

export type FeedbackReason = 'inaccurate' | 'too_generic' | 'didnt_help' | 'too_long';

/**
 * Recommendation type is a well-known union PLUS an open string, so the backend
 * can introduce future experiences the client renders via a fallback until a
 * dedicated renderer is registered. This is the extensibility seam.
 */
export type KnownRecommendationType =
  | 'gemstone'
  | 'tarot'
  | 'consultation'
  | 'article'
  | 'promotion'
  | 'remedy'
  | 'panchang';

export type RecommendationType = KnownRecommendationType | (string & {});

export type Recommendation = {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
  /** Arbitrary payload for richer future experiences (price, deep-link, etc.). */
  meta?: Record<string, unknown>;
};

export type MessageFeedback = {
  rating?: FeedbackRating;
  reasons: FeedbackReason[];
};

/** Lightweight snapshot of the message being replied to, shown in the composer. */
export type ReplyContext = {
  messageId: string;
  author: MessageAuthorType;
  preview: string;
};

export type ConversationMessage = {
  id: string;
  type: MessageAuthorType;
  text: string;
  createdAt: number;
  /** Present only for optimistic user messages moving through send lifecycle. */
  status?: MessageDeliveryStatus;
  /** AI messages may surface zero or more recommendation experiences. */
  recommendations?: Recommendation[];
  /** AI messages support like/dislike + reason feedback. */
  feedback?: MessageFeedback;
  /** The message this one is replying to, if any. */
  replyTo?: ReplyContext;
};

/** Status of the initial conversation load (loading / empty / error handling). */
export type ConversationLoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export type ConversationState = {
  loadStatus: ConversationLoadStatus;
  messages: ConversationMessage[];
  /** Active reply target for the composer, or null when composing normally. */
  reply: ReplyContext | null;
};

/** Union payload shape consumed by the conversation reducer. */
export type ConversationActionPayload = {
  loadStatus?: ConversationLoadStatus;
  messages?: ConversationMessage[];
  message?: ConversationMessage;
  messageId?: string;
  patch?: Partial<ConversationMessage>;
  reply?: ReplyContext | null;
};
