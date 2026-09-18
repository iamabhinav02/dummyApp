import {
  FeedbackReason,
  Message,
  ReactionType,
  Recommendation,
  ReplyContext,
} from '../../../../types/conversation';

/**
 * Props every message renderer receives. Grouping flags let renderers decide
 * whether to show the author header and how to space consecutive bubbles.
 * `replyTo` is resolved by `MessageRow` from the message's `replyToMessageId`.
 */
export type MessageComponentProps = {
  message: Message;
  replyTo?: ReplyContext;
  isGroupStart: boolean;
  isGroupEnd: boolean;
  onLongPress?: (message: Message) => void;
  onRetry?: (message: Message) => void;
  onPressRecommendation?: (recommendation: Recommendation) => void;
  onToggleReaction?: (messageId: string, reactionType: ReactionType) => void;
  onToggleReason?: (messageId: string, reason: FeedbackReason) => void;
};

/** The interaction handlers a timeline row forwards to its renderer. */
export type MessageRowHandlers = Pick<
  MessageComponentProps,
  | 'onLongPress'
  | 'onRetry'
  | 'onPressRecommendation'
  | 'onToggleReaction'
  | 'onToggleReason'
>;
