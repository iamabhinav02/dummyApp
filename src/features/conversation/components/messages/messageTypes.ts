import {
  ConversationMessage,
  FeedbackRating,
  FeedbackReason,
  Recommendation,
} from '../../../../types/conversation';

/**
 * Props every message renderer receives. Grouping flags let renderers decide
 * whether to show the author header and how to space consecutive bubbles.
 */
export type MessageComponentProps = {
  message: ConversationMessage;
  isGroupStart: boolean;
  isGroupEnd: boolean;
  onLongPress?: (message: ConversationMessage) => void;
  onRetry?: (message: ConversationMessage) => void;
  onPressRecommendation?: (recommendation: Recommendation) => void;
  onSetRating?: (messageId: string, rating: FeedbackRating) => void;
  onToggleReason?: (messageId: string, reason: FeedbackReason) => void;
};
